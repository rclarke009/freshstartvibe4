import {Suspense, useState, useEffect, useRef} from 'react';
import {Await, NavLink, Form} from '@remix-run/react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

function ResourcesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <span
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200 cursor-pointer inline-flex items-center gap-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        Resources
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
      
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-slate-200 rounded-lg shadow-lg py-2 min-w-[200px] z-10">
          <NavLink
            to="/fragrance-sensitivity"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-gray-700 hover:text-[#1e40af] hover:bg-gray-100 transition-colors duration-200 px-4 py-2"
          >
            Fragrance Sensitivity
          </NavLink>
          <NavLink
            to="/pages/why-air-purifiers"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-gray-700 hover:text-[#1e40af] hover:bg-gray-100 transition-colors duration-200 px-4 py-2"
          >
            Why Air Purifiers?
          </NavLink>
        </div>
      )}
    </div>
  );
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
                      <ResourcesDropdown />
                      <NavLink to="/policies/privacy-policy" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200 px-3 py-2 rounded hover:bg-gray-100"> Privacy </NavLink>
                      <NavLink to="/policies/terms-of-service" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200 px-3 py-2 rounded hover:bg-gray-100">Terms</NavLink>
                      <NavLink to="/pages/faq" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200 px-3 py-2 rounded hover:bg-gray-100">FAQ</NavLink>
                      <NavLink to="/policies/shipping-policy" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200 px-3 py-2 rounded hover:bg-gray-100">Shipping</NavLink>
                      <NavLink to="/policies/refund-policy" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors duration-200 px-3 py-2 rounded hover:bg-gray-100">Returns</NavLink>
                    </nav>
                  </div>
                </div>

                {/* Copyright */}
                <div className="text-center pt-4">
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

