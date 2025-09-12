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
            <div className="mx-auto max-w-6xl px-4 py-3">
              {/* Simple footer layout - site title left, menu and copyright right */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Site Title - Left */}
                <div className="flex items-center">
                  <h3 className="text-xl font-semibold text-[#1e40af]">Fresh Start Air Purifiers</h3>
                </div>

                {/* Menu Items and Copyright - Right */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                  {/* Navigation Menu */}
                  <nav className="flex flex-wrap items-center gap-6">
                    <NavLink to="/" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200">Home</NavLink>
                    <NavLink to="/products" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200">Products</NavLink>
                    <NavLink to="/collections" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200">Collections</NavLink>
                    <NavLink to="/blogs" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200">Blog</NavLink>
                    <NavLink to="/contact" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200">Contact</NavLink>
                    <NavLink to="/pages/about" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200">About</NavLink>
                  </nav>

                  {/* Copyright */}
                  <div className="text-sm text-gray-500 lg:ml-4">
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

