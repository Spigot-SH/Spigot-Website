'use client';

import { apiErrorMessage } from '../lib/errors';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Wallet,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Zap,
  Copy,
  Check,
  Gift,
  QrCode,
} from 'lucide-react';
import QRCode from 'qrcode';
import { creditsApi, CreditsOverview, Tier } from '../api/credits';
import { Spinner } from '../components/common/Spinner';
import {
  connectInjectedEvmWallet,
  switchOrAddArcTestnet,
  signExactEvmPayment,
  EVM_TESTNET_CHAINS,
} from '../wallet/evmWallet';

interface Props {
  overview: CreditsOverview | null;
  onCredited: () => void;
}

type Stage = 'idle' | 'quoting' | 'signing' | 'confirming' | 'done';
type FundingMethod = 'arc' | 'treasury' | 'evm' | 'solana' | 'stellar';

const TopUpPanel: React.FC<Props> = ({ overview, onCredited }) => {
  const [fundingMethod, setFundingMethod] = useState<FundingMethod>('arc');
  const [selected, setSelected] = useState<string>('starter');
  const [customAmount, setCustomAmount] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const [error, setError] = useState<string | null>(null);
  const [copiedArc, setCopiedArc] = useState(false);
  const [copiedEvm, setCopiedEvm] = useState(false);
  const [copiedSolana, setCopiedSolana] = useState(false);
  const [copiedStellar, setCopiedStellar] = useState(false);
  const [arcQrUrl, setArcQrUrl] = useState<string>('');
  const [showQr, setShowQr] = useState(false);
  const [receipt, setReceipt] = useState<{ credited: number; explorerUrl: string } | null>(null);

  const [treasuryChain, setTreasuryChain] = useState<string>('arc-testnet');

  const [selectedEvmChain, setSelectedEvmChain] = useState<string>('base');
  const [connectedEvmAccount, setConnectedEvmAccount] = useState<string | null>(null);
  const [connectingEvm, setConnectingEvm] = useState(false);

  const [connectedSolanaAccount, setConnectedSolanaAccount] = useState<string | null>(null);
  const [connectingSolana, setConnectingSolana] = useState(false);

  const [connectedFreighterAccount, setConnectedFreighterAccount] = useState<string | null>(null);
  const [freighterBalances, setFreighterBalances] = useState<{
    xlm: string;
    usdc: string;
    hasUsdcTrustline: boolean;
  } | null>(null);
  const [connectingFreighter, setConnectingFreighter] = useState(false);

  const arcAddress = overview?.evmWalletAddress || overview?.walletAddress;

  useEffect(() => {
    if (arcAddress) {
      QRCode.toDataURL(arcAddress, {
        width: 160,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      })
        .then(setArcQrUrl)
        .catch(() => null);
    }
  }, [arcAddress]);

  const copyArcAddress = () => {
    if (arcAddress) {
      navigator.clipboard.writeText(arcAddress);
      setCopiedArc(true);
      setTimeout(() => setCopiedArc(false), 2000);
    }
  };

  const copyEvmAddress = () => {
    if (overview?.evmWalletAddress) {
      navigator.clipboard.writeText(overview.evmWalletAddress);
      setCopiedEvm(true);
      setTimeout(() => setCopiedEvm(false), 2000);
    }
  };

  const copySolanaAddress = () => {
    if (overview?.solanaWalletAddress) {
      navigator.clipboard.writeText(overview.solanaWalletAddress);
      setCopiedSolana(true);
      setTimeout(() => setCopiedSolana(false), 2000);
    }
  };

  const copyStellarAddress = () => {
    if (overview?.stellarWalletAddress) {
      navigator.clipboard.writeText(overview.stellarWalletAddress);
      setCopiedStellar(true);
      setTimeout(() => setCopiedStellar(false), 2000);
    }
  };

  const handleConnectEvm = async () => {
    setError(null);
    setConnectingEvm(true);
    try {
      const address = await connectInjectedEvmWallet();
      setConnectedEvmAccount(address);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not connect EVM wallet'));
    } finally {
      setConnectingEvm(false);
    }
  };

  const handleDisconnectEvm = () => setConnectedEvmAccount(null);

  const handleConnectSolana = async () => {
    setError(null);
    setConnectingSolana(true);
    try {
      if (typeof window === 'undefined') throw new Error('Window not available');
      const solana = (
        window as unknown as {
          solana?: { connect: () => Promise<{ publicKey: { toString: () => string } }> };
        }
      ).solana;
      if (!solana) throw new Error('Solana wallet not detected');
      const res = await solana.connect();
      setConnectedSolanaAccount(res.publicKey.toString());
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not connect Solana wallet'));
    } finally {
      setConnectingSolana(false);
    }
  };

  const handleDisconnectSolana = () => setConnectedSolanaAccount(null);

  const handleConnectFreighter = async () => {
    setError(null);
    setConnectingFreighter(true);
    try {
      const { connectFreighterWallet, getFreighterBalances } =
        await import('../wallet/freighterWallet');
      const address = await connectFreighterWallet();
      setConnectedFreighterAccount(address);
      setFreighterBalances(await getFreighterBalances(address));
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not connect Freighter'));
    } finally {
      setConnectingFreighter(false);
    }
  };

  const handleDisconnectFreighter = () => {
    setConnectedFreighterAccount(null);
    setFreighterBalances(null);
  };

  useEffect(() => {
    if (!overview) return;
    if (selected !== 'custom' && !overview.tiers.some(t => t.id === selected)) {
      setSelected(overview.tiers[0]?.id || 'custom');
    }
  }, [overview, selected]);

  const amount = selected === 'custom' ? Number(customAmount) : undefined;
  const chosenTier: Tier | undefined = React.useMemo(() => {
    if (selected === 'custom') {
      return Number.isFinite(amount) && (amount as number) > 0
        ? { id: 'custom', label: `$${amount}`, amountUsdc: amount as number }
        : undefined;
    }
    return overview?.tiers.find(t => t.id === selected);
  }, [selected, amount, overview?.tiers]);

  const handleArcInstantTopUp = useCallback(async () => {
    if (!chosenTier) return;
    setError(null);
    setReceipt(null);
    setStage('confirming');
    try {
      const res = await creditsApi.treasuryTopUp(selected, amount, 'arc-testnet');
      setReceipt({ credited: res.credited, explorerUrl: res.explorerUrl });
      setStage('done');
      onCredited();
    } catch (err) {
      setError(apiErrorMessage(err, 'Arc Testnet top-up failed'));
      setStage('idle');
    }
  }, [chosenTier, selected, amount, onCredited]);

  const handleArcWalletTopUp = useCallback(async () => {
    if (!connectedEvmAccount || !chosenTier) return;
    setError(null);
    setReceipt(null);
    try {
      setStage('quoting');
      await switchOrAddArcTestnet();
      const quote = await creditsApi.quote(selected, amount, 'arc-testnet');
      setStage('signing');
      const paymentSignature = await signExactEvmPayment(quote.requirements, connectedEvmAccount);
      setStage('confirming');
      const confirmed = await creditsApi.confirm(selected, paymentSignature, amount);
      setReceipt({ credited: confirmed.credited, explorerUrl: confirmed.explorerUrl });
      setStage('done');
      onCredited();
    } catch (err) {
      setError(apiErrorMessage(err, 'Arc Testnet wallet top-up failed'));
      setStage('idle');
    }
  }, [connectedEvmAccount, chosenTier, selected, amount, onCredited]);

  const handleTreasuryTopUp = useCallback(async () => {
    if (!chosenTier) return;
    setError(null);
    setReceipt(null);
    setStage('confirming');
    try {
      const res = await creditsApi.treasuryTopUp(selected, amount, treasuryChain);
      setReceipt({ credited: res.credited, explorerUrl: res.explorerUrl });
      setStage('done');
      onCredited();
    } catch (err) {
      setError(apiErrorMessage(err, 'Treasury top-up failed'));
      setStage('idle');
    }
  }, [chosenTier, selected, amount, treasuryChain, onCredited]);

  const buyEvm = useCallback(async () => {
    if (!connectedEvmAccount || !chosenTier) return;
    setError(null);
    setReceipt(null);
    try {
      setStage('quoting');
      const chainConfig = EVM_TESTNET_CHAINS[selectedEvmChain] || EVM_TESTNET_CHAINS.base;
      const quote = await creditsApi.quote(selected, amount, chainConfig.key);
      setStage('signing');
      const paymentSignature = await signExactEvmPayment(quote.requirements, connectedEvmAccount);
      setStage('confirming');
      const confirmed = await creditsApi.confirm(selected, paymentSignature, amount);
      setReceipt({ credited: confirmed.credited, explorerUrl: confirmed.explorerUrl });
      setStage('done');
      onCredited();
    } catch (err) {
      setError(apiErrorMessage(err, 'EVM Top-up failed'));
      setStage('idle');
    }
  }, [connectedEvmAccount, chosenTier, selected, amount, selectedEvmChain, onCredited]);

  const buySolana = useCallback(async () => {
    if (!chosenTier) return;
    setError(null);
    setReceipt(null);
    try {
      setStage('quoting');
      const quote = await creditsApi.quote(selected, amount, 'solana');
      setStage('confirming');
      const sig = btoa(
        JSON.stringify({
          nanopaymentVersion: 1,
          x402Version: 2,
          scheme: 'exact',
          network: quote.requirements.network,
          payload: {
            account: connectedSolanaAccount || overview?.solanaWalletAddress,
            signature: `solana_topup_${Date.now()}`,
          },
        }),
      );
      const confirmed = await creditsApi.confirm(selected, sig, amount);
      setReceipt({ credited: confirmed.credited, explorerUrl: confirmed.explorerUrl });
      setStage('done');
      onCredited();
    } catch (err) {
      setError(apiErrorMessage(err, 'Solana Top-up failed'));
      setStage('idle');
    }
  }, [connectedSolanaAccount, chosenTier, selected, amount, overview, onCredited]);

  const buyStellar = useCallback(async () => {
    if (!chosenTier) return;
    setError(null);
    setReceipt(null);
    try {
      setStage('quoting');
      const quote = await creditsApi.quote(selected, amount, 'stellar');
      setStage('confirming');
      const payer = connectedFreighterAccount || overview?.stellarWalletAddress;
      const sig = btoa(
        JSON.stringify({
          nanopaymentVersion: 1,
          x402Version: 2,
          scheme: 'exact',
          network: quote.requirements.network,
          payload: { account: payer, signature: `stellar_topup_${Date.now()}` },
        }),
      );
      const confirmed = await creditsApi.confirm(selected, sig, amount);
      setReceipt({ credited: confirmed.credited, explorerUrl: confirmed.explorerUrl });
      setStage('done');
      onCredited();
    } catch (err) {
      setError(apiErrorMessage(err, 'Stellar Top-up failed'));
      setStage('idle');
    }
  }, [connectedFreighterAccount, chosenTier, selected, amount, overview, onCredited]);

  const busy = stage !== 'idle' && stage !== 'done';
  const stageLabel = {
    quoting: 'Preparing payment…',
    signing: 'Approve in wallet…',
    confirming: 'Settling on Arc Testnet…',
  }[stage as 'quoting' | 'signing' | 'confirming'];

  return (
    <div className="rounded-lg border border-border bg-panel p-5 mb-5">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <h2 className="text-base m-0 text-main">Add credit</h2>
        <span className="text-xs px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent font-mono">
          Arc Testnet (Primary)
        </span>
      </div>
      <p className="text-sm text-muted mb-4">
        Top up your Arc Testnet account and universal credit balance. Once credited, all marketplace
        API calls settle automatically.
      </p>

      <div className="flex items-center gap-1.5 mb-5 p-1 bg-bg rounded-lg border border-border flex-wrap">
        {(
          [
            ['arc', 'Arc Testnet'],
            ['treasury', 'Instant Faucet'],
            ['evm', 'EVM Chains'],
            ['solana', 'Solana'],
            ['stellar', 'Stellar'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFundingMethod(id as FundingMethod)}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium cursor-pointer ${fundingMethod === id ? 'bg-panel text-main shadow border border-border font-semibold' : 'text-muted hover:text-main'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Arc Testnet Funding Tab */}
      {fundingMethod === 'arc' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-lg bg-bg border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success inline-block animate-pulse" />
                <span className="text-xs font-semibold text-main">
                  Your Dedicated Arc Testnet Account
                </span>
              </div>
              <span className="text-[10px] text-muted font-mono uppercase">Chain ID: 5042002</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded bg-panel border border-border mb-2">
              <span className="font-mono text-xs text-main break-all flex-1 select-all">
                {arcAddress || 'Provisioning…'}
              </span>
              <button
                onClick={copyArcAddress}
                title="Copy Arc Address"
                className="p-1.5 rounded hover:bg-bg text-muted border border-border"
              >
                {copiedArc ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              </button>
              <button
                onClick={() => setShowQr(p => !p)}
                title="Toggle QR Code"
                className="p-1.5 rounded hover:bg-bg text-muted border border-border"
              >
                <QrCode size={14} />
              </button>
            </div>
            {showQr && arcQrUrl && (
              <div className="text-center py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={arcQrUrl}
                  alt="Arc Deposit QR"
                  className="w-36 h-36 rounded bg-white p-1 mb-1 mx-auto"
                />
                <span className="text-[11px] text-muted">
                  Scan to deposit native USDC on Arc Testnet
                </span>
              </div>
            )}
            {arcAddress && (
              <div className="mt-2 text-right">
                <a
                  href={`https://testnet.arcscan.app/address/${arcAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-accent hover:underline inline-flex items-center gap-1"
                >
                  View account on Arcscan <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>

          <div className="p-4 rounded-lg bg-bg border border-border">
            <div className="text-xs font-semibold text-main mb-2">Select Top-Up Amount</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {(overview?.tiers || []).map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className={`px-3 py-2.5 rounded-md text-xs font-medium border cursor-pointer transition-colors ${
                    selected === t.id
                      ? 'bg-main text-bg font-semibold border-main'
                      : 'bg-panel text-main border-border hover:border-main/40'
                  }`}
                >
                  {t.label}
                </button>
              ))}
              <button
                onClick={() => setSelected('custom')}
                className={`px-3 py-2.5 rounded-md text-xs font-medium border cursor-pointer transition-colors ${
                  selected === 'custom'
                    ? 'bg-main text-bg font-semibold border-main'
                    : 'bg-panel text-main border-border hover:border-main/40'
                }`}
              >
                Custom
              </button>
            </div>

            {selected === 'custom' && (
              <div className="mb-4">
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter USDC amount"
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-panel border border-border text-sm text-main placeholder-muted focus:outline-none focus:border-main"
                />
              </div>
            )}

            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={handleArcInstantTopUp}
                disabled={busy || !chosenTier}
                className="w-full py-3 px-4 rounded-md bg-main text-bg text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {busy && stage === 'confirming' ? (
                  <>
                    <Spinner size={15} /> {stageLabel}
                  </>
                ) : (
                  <>
                    <Zap size={16} /> Instant Faucet Top Up ({chosenTier?.amountUsdc || 0} USDC)
                  </>
                )}
              </button>

              <div className="text-center text-xs text-muted my-1">
                — or deposit from your connected web3 wallet —
              </div>

              {connectedEvmAccount ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs px-3 py-2 bg-panel rounded border border-border">
                    <span className="text-muted font-mono truncate mr-2">
                      Wallet: {connectedEvmAccount}
                    </span>
                    <button
                      onClick={handleDisconnectEvm}
                      className="text-xs text-error hover:underline shrink-0"
                    >
                      Disconnect
                    </button>
                  </div>
                  <button
                    onClick={handleArcWalletTopUp}
                    disabled={busy || !chosenTier}
                    className="w-full py-2.5 px-4 rounded-md bg-panel border border-border text-main text-sm font-medium hover:bg-bg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {busy ? (
                      <>
                        <Spinner size={15} /> {stageLabel}
                      </>
                    ) : (
                      <>
                        <Wallet size={15} /> Sign & Transfer on Arc Testnet
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectEvm}
                  disabled={connectingEvm}
                  className="w-full py-2.5 px-4 rounded-md bg-panel border border-border text-main text-sm font-medium hover:bg-bg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {connectingEvm ? <Spinner size={15} /> : <Wallet size={15} />} Connect Browser EVM
                  Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Treasury / Faucet Tab */}
      {fundingMethod === 'treasury' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-lg bg-bg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Gift size={16} className="text-accent" />
              <span className="text-xs font-semibold text-main">Developer Testnet Faucet</span>
            </div>
            <p className="text-xs text-muted mb-4">
              Select any testnet to simulate or deposit native USDC funds directly to your Spigot
              balance.
            </p>

            <div className="mb-4">
              <label className="block text-xs text-muted mb-1 font-medium">Select Chain</label>
              <select
                value={treasuryChain}
                onChange={e => setTreasuryChain(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-panel border border-border text-xs text-main"
              >
                <option value="arc-testnet">Arc Testnet (Native Gas USDC)</option>
                <option value="base-sepolia">Base Sepolia</option>
                <option value="arbitrum-sepolia">Arbitrum Sepolia</option>
                <option value="optimism-sepolia">Optimism Sepolia</option>
                <option value="solana">Solana Devnet</option>
                <option value="stellar">Stellar Testnet</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {(overview?.tiers || []).map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className={`px-3 py-2 rounded-md text-xs font-medium border cursor-pointer ${
                    selected === t.id
                      ? 'bg-main text-bg font-semibold border-main'
                      : 'bg-panel text-main border-border'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleTreasuryTopUp}
              disabled={busy || !chosenTier}
              className="w-full py-3 rounded-md bg-main text-bg text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {busy ? <Spinner size={15} /> : <Zap size={15} />} Claim {chosenTier?.amountUsdc || 0}{' '}
              USDC Credits
            </button>
          </div>
        </div>
      )}

      {/* EVM Multi-Chain Tab */}
      {fundingMethod === 'evm' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-lg bg-bg border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-main">Secondary EVM Chains</span>
              {overview?.evmWalletAddress && (
                <button
                  onClick={copyEvmAddress}
                  className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                  {copiedEvm ? 'Copied EVM Address' : 'Copy EVM Address'}
                </button>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-xs text-muted mb-1">Network</label>
              <select
                value={selectedEvmChain}
                onChange={e => setSelectedEvmChain(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-panel border border-border text-xs text-main"
              >
                {Object.entries(EVM_TESTNET_CHAINS).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {(overview?.tiers || []).map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className={`px-3 py-2 rounded-md text-xs font-medium border cursor-pointer ${
                    selected === t.id
                      ? 'bg-main text-bg font-semibold border-main'
                      : 'bg-panel text-main border-border'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {connectedEvmAccount ? (
              <button
                onClick={buyEvm}
                disabled={busy || !chosenTier}
                className="w-full py-3 rounded-md bg-main text-bg text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {busy ? <Spinner size={15} /> : <Wallet size={15} />} Deposit{' '}
                {chosenTier?.amountUsdc || 0} USDC
              </button>
            ) : (
              <button
                onClick={handleConnectEvm}
                disabled={connectingEvm}
                className="w-full py-3 rounded-md bg-main text-bg text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {connectingEvm ? <Spinner size={15} /> : <Wallet size={15} />} Connect EVM Wallet
              </button>
            )}
          </div>
        </div>
      )}

      {/* Solana Tab */}
      {fundingMethod === 'solana' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-lg bg-bg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-main">Solana Devnet</span>
              {overview?.solanaWalletAddress && (
                <button
                  onClick={copySolanaAddress}
                  className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                  {copiedSolana ? 'Copied Solana Address' : 'Copy Solana Address'}
                </button>
              )}
            </div>
            {overview?.solanaWalletAddress && (
              <p className="font-mono text-xs text-muted p-2 rounded bg-panel border border-border mb-3 break-all select-all">
                {overview.solanaWalletAddress}
              </p>
            )}

            <div className="grid grid-cols-3 gap-2 mb-4">
              {(overview?.tiers || []).map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className={`px-3 py-2 rounded-md text-xs font-medium border cursor-pointer ${
                    selected === t.id
                      ? 'bg-main text-bg font-semibold border-main'
                      : 'bg-panel text-main border-border'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {connectedSolanaAccount ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-panel rounded border border-border">
                  <span className="text-muted font-mono truncate mr-2">
                    Connected: {connectedSolanaAccount}
                  </span>
                  <button
                    onClick={handleDisconnectSolana}
                    className="text-xs text-error hover:underline shrink-0"
                  >
                    Disconnect
                  </button>
                </div>
                <button
                  onClick={buySolana}
                  disabled={busy || !chosenTier}
                  className="w-full py-3 rounded-md bg-main text-bg text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {busy ? <Spinner size={15} /> : <Zap size={15} />} Deposit{' '}
                  {chosenTier?.amountUsdc || 0} USDC (Solana)
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectSolana}
                disabled={connectingSolana}
                className="w-full py-3 rounded-md bg-main text-bg text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {connectingSolana ? <Spinner size={15} /> : <Wallet size={15} />} Connect Phantom
                Wallet
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stellar Tab */}
      {fundingMethod === 'stellar' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-lg bg-bg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-main">Stellar Testnet</span>
              {overview?.stellarWalletAddress && (
                <button
                  onClick={copyStellarAddress}
                  className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                  {copiedStellar ? 'Copied Stellar Address' : 'Copy Stellar Address'}
                </button>
              )}
            </div>
            {overview?.stellarWalletAddress && (
              <p className="font-mono text-xs text-muted p-2 rounded bg-panel border border-border mb-3 break-all select-all">
                {overview.stellarWalletAddress}
              </p>
            )}

            <div className="grid grid-cols-3 gap-2 mb-4">
              {(overview?.tiers || []).map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className={`px-3 py-2 rounded-md text-xs font-medium border cursor-pointer ${
                    selected === t.id
                      ? 'bg-main text-bg font-semibold border-main'
                      : 'bg-panel text-main border-border'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {connectedFreighterAccount ? (
              <div className="flex flex-col gap-2">
                <div className="text-xs text-muted flex items-center justify-between flex-wrap gap-2">
                  <span className="font-mono truncate mr-2">
                    Account: {connectedFreighterAccount}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {freighterBalances && (
                      <span>
                        {freighterBalances.xlm} XLM | {freighterBalances.usdc} USDC
                      </span>
                    )}
                    <button
                      onClick={handleDisconnectFreighter}
                      className="text-xs text-error hover:underline shrink-0"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
                <button
                  onClick={buyStellar}
                  disabled={busy || !chosenTier}
                  className="w-full py-3 rounded-md bg-main text-bg text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {busy ? <Spinner size={15} /> : <Zap size={15} />} Deposit{' '}
                  {chosenTier?.amountUsdc || 0} USDC (Stellar)
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectFreighter}
                disabled={connectingFreighter}
                className="w-full py-3 rounded-md bg-main text-bg text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {connectingFreighter ? <Spinner size={15} /> : <Wallet size={15} />} Connect
                Freighter Wallet
              </button>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Receipt */}
      {receipt && (
        <div className="mt-4 px-4 py-3 rounded-md border border-border bg-bg flex items-start gap-2 text-sm">
          <CheckCircle size={16} className="mt-0.5 shrink-0 text-success" />
          <div className="flex-1">
            <div className="text-main font-medium">Successfully added {receipt.credited} USDC!</div>
            {receipt.explorerUrl && (
              <a
                href={receipt.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs text-accent hover:underline"
              >
                View on Block Explorer <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 px-4 py-3 rounded-md border border-error/40 bg-error/10 flex items-start gap-2 text-xs text-error">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default TopUpPanel;
