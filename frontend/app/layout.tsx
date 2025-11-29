'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AnimatedLeafLogo from '@/components/AnimatedLeafLogo';
import { isAuthenticated } from '@/app/utils/auth';
import { buildRedirectParam, shouldProtectRoute } from '@/app/utils/route-guard';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const floatingLogoExcludedRoutes = [
    "/",
    "/community-forum",
    "/government-schemes",
    "/crop-recommendation",
    "/crop-management",
    "/disease-detection",
    "/plant-disease-detection",
    "/plant-identification",
    "/log-in",
    "/sign-up",
    "/forgot-password",
    "/weather"
  ];
  const shouldShowFloatingLogo = pathname
    ? !floatingLogoExcludedRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      )
    : false;

  useEffect(() => {
    if (!pathname) return;
    setCheckingAuth(true);

    if (!shouldProtectRoute(pathname)) {
      setCheckingAuth(false);
      return;
    }

    if (!isAuthenticated()) {
      const search = typeof window !== 'undefined' ? window.location.search : '';
      const normalizedSearch = search.startsWith('?') ? search.slice(1) : search;
      const redirectTo = buildRedirectParam(pathname, normalizedSearch || null);
      router.replace(`/log-in?redirect=${encodeURIComponent(redirectTo)}`);
      return;
    }

    setCheckingAuth(false);
  }, [pathname, router]);

  return (
    <html lang="en">
      <body className={inter.className}>
        {shouldShowFloatingLogo && (
          <div className="pointer-events-none fixed left-5 top-5 z-[9999]">
            <AnimatedLeafLogo size="sm" />
          </div>
        )}
        {checkingAuth ? (
          <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
            Verifying session...
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
