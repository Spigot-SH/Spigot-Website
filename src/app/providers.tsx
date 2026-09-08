'use client';

import { AuthProvider } from '../auth/AuthContext';
import SignInModal from '../auth/SignInModal';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { ToastProvider } from '../components/common/Toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-bg text-main">
          <Header />
          <div className="flex-1 flex pt-16">
            <Sidebar />
            <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
          </div>
          <SignInModal />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
