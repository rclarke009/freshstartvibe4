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
            <div className="mx-auto max-w-6xl px-4 py-4">
              {/* Main footer content - horizontal layout on desktop, dropdowns on mobile */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {/* Search */}
                <div className="col-span-2 lg:col-span-1">
                  <h3 className="text-xs font-semibold text-[#1e40af] mb-1">Search</h3>
                  <Form action="/search" method="GET">
                    <label htmlFor="site-search" className="sr-only">Search site</label>
                    <div className="flex items-center gap-1">
                      <input
                        id="site-search"
                        name="q"
                        type="search"
                        placeholder="Search air purifiers…"
                        className="w-full rounded border border-slate-300 bg-white/90 px-2 py-1 text-xs text-gray-700 placeholder-slate-400 outline-none focus:ring-1 focus:ring-[#1e40af]/40"
                      />
                      <button
                        type="submit"
                        className="rounded bg-[#1e40af] px-2 py-1 text-xs font-semibold text-white hover:opacity-95 focus:ring-1 focus:ring-[#1e40af]/40"
                        aria-label="Submit search"
                        title="Search"
                      >
                        Search
                      </button>
                    </div>
                  </Form>
                </div>

                {/* Explore / Navigation Shortcuts */}
                <div className="col-span-1">
                  <details className="group">
                    <summary className="text-xs font-semibold text-[#1e40af] mb-1 cursor-pointer list-none lg:pointer-events-none">
                      <span className="flex items-center justify-between">
                        Explore
                        <svg className="h-2 w-2 transition-transform group-open:rotate-180 lg:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <ul className="mt-1 space-y-0.5 text-xs text-gray-600">
                      <li><NavLink to="/" className="hover:underline">Home</NavLink></li>
                      <li><NavLink to="/products" className="hover:underline">Products</NavLink></li>
                      <li><NavLink to="/collections" className="hover:underline">Collections</NavLink></li>
                      <li><NavLink to="/blogs" className="hover:underline">Blog</NavLink></li>
                      <li><NavLink to="/contact" className="hover:underline">Contact</NavLink></li>
                      <li><NavLink to="/pages/about" className="hover:underline">About Us</NavLink></li>
                    </ul>
                  </details>
                </div>

                {/* Help */}
                <div className="col-span-1">
                  <details className="group">
                    <summary className="text-xs font-semibold text-[#1e40af] mb-1 cursor-pointer list-none lg:pointer-events-none">
                      <span className="flex items-center justify-between">
                        Help
                        <svg className="h-2 w-2 transition-transform group-open:rotate-180 lg:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <ul className="mt-1 space-y-0.5 text-xs text-gray-600">
                      <li><NavLink to="/pages/faq" className="hover:underline">FAQ</NavLink></li>
                      <li><NavLink to="/policies/shipping-policy" className="hover:underline">Shipping</NavLink></li>
                      <li><NavLink to="/pages/warranty" className="hover:underline">Warranty</NavLink></li>
                      <li><NavLink to="/policies/refund-policy" className="hover:underline">Returns</NavLink></li>
                    </ul>
                  </details>
                </div>

                {/* Trust & Legal */}
                <div className="col-span-2 lg:col-span-1">
                  <details className="group">
                    <summary className="text-xs font-semibold text-[#1e40af] mb-1 cursor-pointer list-none lg:pointer-events-none">
                      <span className="flex items-center justify-between">
                        Legal
                        <svg className="h-2 w-2 transition-transform group-open:rotate-180 lg:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <ul className="mt-1 space-y-0.5 text-xs text-gray-600">
                      <li><NavLink to="/policies/privacy-policy" className="hover:underline">Privacy</NavLink></li>
                      <li><NavLink to="/policies/terms-of-service" className="hover:underline">Terms</NavLink></li>
                      <li><NavLink to="/pages/disclaimer" className="hover:underline">Disclaimer</NavLink></li>
                    </ul>
                  </details>
                </div>
              </div>

              {/* Divider */}
              <div className="my-3 h-px w-full bg-slate-200" />

              {/* Bottom row: Social + Copyright */}
              <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                {/* Social */}
                <div className="flex items-center gap-2">
                  <a
                    href="https://instagram.com/freshstartairpurifiers"
                    aria-label="Instagram"
                    className="group inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white/90 hover:bg-white"
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="Instagram"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      className="h-3 w-3 text-gray-600 group-hover:text-[#1e40af]" fill="currentColor">
                      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 15.8 2.8 2.8 0 0 0 12 9.2Zm5.65-.95a.85.85 0 1 1-1.7 0 .85.85 0 0 1 1.7 0Z"/>
                    </svg>
                  </a>
                  <a
                    href="https://x.com/freshstartair"
                    aria-label="X (Twitter)"
                    className="group inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white/90 hover:bg-white"
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="X"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      className="h-3 w-3 text-gray-600 group-hover:text-[#1e40af]" fill="currentColor">
                      <path d="M14.74 10.3 22 2h-1.9l-6.3 7.2L8.2 2H2l7.68 11.05L2 22h1.9l6.76-7.73L15.8 22H22l-7.26-11.7ZM10.4 12.6l-.78-1.12L4 3.3h3.3l4.14 5.98.78 1.13L20 20.7h-3.3l-6.3-8.1Z"/>
                    </svg>
                  </a>
                  <a
                    href="https://facebook.com/freshstartairpurifiers"
                    aria-label="Facebook"
                    className="group inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white/90 hover:bg-white"
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="Facebook"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      className="h-3 w-3 text-gray-600 group-hover:text-[#1e40af]" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>

                {/* Mission + Copyright */}
                <div className="text-center">
                  <p className="text-xs font-medium text-[#1e40af] mb-1">
                    Start Bringing the Fresh Air Indoors
                  </p>
                  <p className="text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} Fresh Start Air Purifiers. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

