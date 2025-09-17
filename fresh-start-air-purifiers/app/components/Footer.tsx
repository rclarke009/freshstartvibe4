import {Suspense} from 'react';
import {Await, NavLink, Form} from '@remix-run/react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="w-full border-t border-slate-200 bg-slate-50/60">
            <div className="mx-auto max-w-6xl px-6 py-6 sm:px-8 sm:py-8">
              {/* Grid-based footer layout - title left, menu right */}
              <div className="space-y-4">
                {/* First Row: Title and Navigation */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Site Title - Left (3 columns) */}
                  <div className="col-span-3" style={{ paddingLeft: '2rem' }}>
                    <h3 className="text-lg font-semibold text-[#1e40af]">Fresh Start Air Purifiers</h3>
                  </div>

                  {/* Navigation Menu - Right (9 columns) */}
                  <div className="col-span-9 flex items-center justify-end" style={{ paddingRight: '2rem' }}>
                    <nav className="flex flex-wrap items-center" style={{ gap: '1.5rem' }}>
                      <NavLink to="/policies/privacy-policy" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200 px-3 py-2 rounded hover:bg-gray-100"> Privacy </NavLink>
                      <NavLink to="/policies/terms-of-service" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200 px-3 py-2 rounded hover:bg-gray-100">Terms</NavLink>
                      <NavLink to="/pages/faq" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200 px-3 py-2 rounded hover:bg-gray-100">FAQ</NavLink>
                      <NavLink to="/policies/shipping-policy" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200 px-3 py-2 rounded hover:bg-gray-100">Shipping</NavLink>
                      <NavLink to="/policies/refund-policy" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200 px-3 py-2 rounded hover:bg-gray-100">Returns</NavLink>
                    </nav>
                  </div>
                </div>

                {/* Second Row: Copyright */}
                <div className="text-center">
                  <div className="text-sm text-gray-500">
                    © 2025 Fresh Start Air Purifiers. All rights reserved.
                  </div>
                </div>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

