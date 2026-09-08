import type { NextConfig } from 'next';

const BACKEND_ORIGIN = (process.env.BACKEND_ORIGIN || 'http://127.0.0.1:4402').replace(/\/$/, '');

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Next writes AGENTS.md and CLAUDE.md into this directory on dev startup unless told not to.
  agentRules: false,

  /**
   * Avatars come from Google sign-in only. An explicit allowlist means a compromised or
   * malicious `avatarUrl` in the session response cannot make the app load an arbitrary
   * remote host — `next/image` refuses any origin not listed here.
   */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh4.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh5.googleusercontent.com' },
    ],
  },

  /**
   * Replaces the old Vite dev proxy, and extends it to production.
   *
   * Gateway routes must reach the gateway byte-for-byte: payment payloads are base64 in headers and
   * the upstream body is proxied verbatim. Rewrites pass the request through untouched, which
   * is why the gateway is not wrapped in a Route Handler.
   */
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${BACKEND_ORIGIN}/api/:path*` },
      { source: '/nanopay/:path*', destination: `${BACKEND_ORIGIN}/nanopay/:path*` },
      { source: '/pay/:path*', destination: `${BACKEND_ORIGIN}/pay/:path*` },
      { source: '/x402/:path*', destination: `${BACKEND_ORIGIN}/x402/:path*` },

      /**
       * The design system is a static site in `public/designsystem/`. Next serves files out of
       * `public/` but does not resolve a directory to its `index.html`, so `/designsystem`
       * alone would 404. Relative asset paths keep working because the browser URL is
       * unchanged — a rewrite is server-side only, unlike a redirect.
       */
      { source: '/designsystem', destination: '/designsystem/index.html' },
    ];
  },
};

export default nextConfig;
