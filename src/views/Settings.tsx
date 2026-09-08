'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Copy,
  Check,
  ExternalLink,
  Wallet,
  Shield,
  LogOut,
  Zap,
  Building2,
  Key,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { creditsApi, CreditsOverview } from '../api/credits';
import { getApiKey } from '../api/client';
import { Spinner } from '../components/common/Spinner';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export default function Settings() {
  const { user, evmWallet, loading, signedIn, openSignIn, signOut, refresh, publisher } = useAuth();
  const [overview, setOverview] = useState<CreditsOverview | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedArc, setCopiedArc] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [topUpAmount, setTopUpAmount] = useState<number | null>(null);
  const [toppingUp, setToppingUp] = useState(false);
  const [topUpMessage, setTopUpMessage] = useState<string | null>(null);

  useEffect(() => {
    setApiKey(getApiKey());
  }, []);

  const load = useCallback(async () => {
    if (!signedIn) return;
    setRefreshing(true);
    try {
      setOverview(await creditsApi.overview());
    } catch {
      setOverview(null);
    } finally {
      setRefreshing(false);
    }
  }, [signedIn]);

  useEffect(() => {
    void load();
  }, [load]);

  const copyArcAddress = () => {
    const addr = overview?.evmWalletAddress || overview?.walletAddress || evmWallet?.address;
    if (addr) {
      navigator.clipboard.writeText(addr);
      setCopiedArc(true);
      setTimeout(() => setCopiedArc(false), 2000);
    }
  };

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleInstantTopUp = async (tier: string, amount: number) => {
    setToppingUp(true);
    setTopUpAmount(amount);
    setTopUpMessage(null);
    try {
      await creditsApi.treasuryTopUp(tier, amount, 'arc-testnet');
      setTopUpMessage(`Successfully added $${amount.toFixed(2)} USDC to your account.`);
      void refresh();
      void load();
      setTimeout(() => setTopUpMessage(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Top-up failed';
      setTopUpMessage(`Error: ${msg}`);
    } finally {
      setToppingUp(false);
      setTopUpAmount(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size={32} className="text-main" />
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="max-w-[560px] mx-auto p-8 text-center pt-24">
        <Shield size={36} className="mx-auto mb-4 text-muted" />
        <h1 className="text-2xl mb-2 text-main">Sign in to access settings</h1>
        <p className="text-muted text-sm mb-6">
          Sign in to view your Arc Testnet account, manage credits, and configure preferences.
        </p>
        <Button variant="primary" onClick={openSignIn}>
          Sign in
        </Button>
      </div>
    );
  }

  const arcAddr = overview?.evmWalletAddress || overview?.walletAddress || evmWallet?.address;

  return (
    <div className="max-w-[800px] mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl mb-1 text-main">Settings</h1>
          <p className="text-muted text-sm m-0">
            Manage your account credentials, Arc Testnet address, and platform balance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="flex items-center gap-1.5 text-xs text-muted hover:text-main bg-panel px-3 py-1.5 rounded-md border border-border cursor-pointer transition-colors"
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Account Profile */}
      <Card className="mb-6">
        <h2 className="text-base mb-4 text-main">Account Profile</h2>
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="text-muted">Email</span>
            <span className="font-mono text-main">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="text-muted">Status</span>
            <span className="flex items-center gap-1.5 text-success font-medium text-xs">
              <span className="w-2 h-2 rounded-full bg-success inline-block" />
              Active
            </span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-muted">Session</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void signOut()}
              className="flex items-center gap-1.5 text-xs"
            >
              <LogOut size={13} />
              <span>Sign out</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Arc Testnet Wallet */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Wallet size={16} className="text-accent" />
          <h2 className="text-base m-0 text-main">Arc Testnet Account</h2>
        </div>
        <p className="text-xs text-muted mb-4">
          Your primary account provisioned on Arc Testnet (Chain ID 5042002). Gasless EIP-3009
          nanopayments settle directly to this address in native USDC.
        </p>

        <div className="p-3.5 rounded-lg bg-bg border border-border">
          <div className="flex items-center justify-between gap-3">
            <span
              className="font-mono text-xs text-main truncate select-all flex-1"
              title={arcAddr || ''}
            >
              {arcAddr || 'Provisioning Arc Testnet account…'}
            </span>
            {arcAddr && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={copyArcAddress}
                  className="flex items-center gap-1 text-xs text-muted hover:text-main bg-panel px-2.5 py-1 rounded border border-border cursor-pointer transition-colors"
                  title="Copy Address"
                >
                  {copiedArc ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                  <span>{copiedArc ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={`https://testnet.arcscan.app/address/${arcAddr}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-muted hover:text-main bg-panel px-2.5 py-1 rounded border border-border transition-colors no-underline"
                  title="View on Arcscan"
                >
                  <span>Arcscan</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Top Up Balance */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={16} className="text-accent" />
          <h2 className="text-base m-0 text-main">Add Credit</h2>
        </div>
        <p className="text-xs text-muted mb-4">
          Instant development top-up directly funded by the Arc Testnet platform treasury.
        </p>

        {topUpMessage && (
          <div className="mb-4 p-3 rounded-md text-xs font-medium bg-panel border border-border text-main">
            {topUpMessage}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '$5 USDC', tier: 'starter', amount: 5 },
            { label: '$10 USDC', tier: 'developer', amount: 10 },
            { label: '$25 USDC', tier: 'pro', amount: 25 },
          ].map(option => (
            <button
              key={option.tier}
              type="button"
              disabled={toppingUp}
              onClick={() => void handleInstantTopUp(option.tier, option.amount)}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-bg hover:bg-panel border border-border hover:border-main transition-colors cursor-pointer disabled:opacity-50"
            >
              <span className="font-mono text-base font-semibold text-main">
                {toppingUp && topUpAmount === option.amount ? <Spinner size={16} /> : option.label}
              </span>
              <span className="text-[11px] text-muted mt-1">Instant 1-Click</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Publisher Settings (if registered) */}
      {publisher && (
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={16} className="text-muted" />
            <h2 className="text-base m-0 text-main">Publisher Credentials</h2>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-muted">Publisher Name</span>
              <span className="font-medium text-main">{publisher.name}</span>
            </div>
            {apiKey && (
              <div className="flex items-center justify-between py-2">
                <span className="text-muted flex items-center gap-1.5">
                  <Key size={13} /> API Key
                </span>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-xs text-muted bg-bg px-2 py-1 rounded border border-border">
                    {apiKey.slice(0, 12)}…{apiKey.slice(-4)}
                  </code>
                  <button
                    type="button"
                    onClick={copyApiKey}
                    className="p-1 rounded text-muted hover:text-main border border-border bg-panel cursor-pointer"
                    title="Copy API Key"
                  >
                    {copiedKey ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
