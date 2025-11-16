import {useFetcher, type MetaFunction} from '@remix-run/react';
import {useEffect, useRef, useState} from 'react';

export const meta: MetaFunction = () => {
  return [
    {title: 'Contact Us - Fresh Start Air Purifiers'},
    {name: 'description', content: 'Contact Fresh Start Air Purifiers for help finding the perfect Austin Air purifier with medical-grade HEPA + carbon filtration for your needs.'},
  ];
};

export function links(args?: { location?: { pathname: string } }) {
  if (!args?.location) return [];
  const origin = 'https://freshstartairpurifiers.com';
  return [
    {
      rel: 'canonical',
      href: `${origin}${args.location.pathname}`,
    },
  ];
}

export default function Contact() {
  const fetcher = useFetcher<{success?: boolean; error?: string; message?: string}>();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmitting = fetcher.state === 'submitting';
  const actionData = fetcher.data;
  const [formLoadTime] = useState(Date.now());

  // Reset form on successful submission
  useEffect(() => {
    if (actionData?.success && formRef.current) {
      formRef.current.reset();
      // Scroll to top to show success message
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [actionData]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1e40af] dark:text-blue-300 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We&apos;re here to help you find the perfect air purifier for your home. 
            Get in touch with our team of experts.
          </p>
          <br></br>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1e40af] dark:text-blue-300 mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#1e40af] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Phone</p>
                    <a href="tel:+19044388325" className="text-[#1e40af] dark:text-blue-300 hover:underline">
                      <span className="phone-number">(904) 438-8325</span>
                    </a>
                    <br></br>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#1e40af] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                  <br></br>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Email</p>
                    <a 
                      href="mailto:contact@freshstartairpurifiers.com" 
                      className="text-[#1e40af] dark:text-blue-300 hover:underline"
                      data-obfuscated="true"
                    >
                      <span className="email-address" data-user="info" data-domain="freshstartairpurifiers.com">
                        info<span className="at-symbol">@</span>freshstartairpurifiers.com
                      </span>
                    </a>
                    <br></br>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#1e40af] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <br></br>
                  <div>
                  <br></br>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Location</p>
                    <p className="text-gray-600 dark:text-gray-300">Serving Florida and the continental US</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#1e40af] dark:text-blue-300 mb-0">Business Hours</h3>
              <div className="space-y-2 text-gray-600 dark:text-gray-300 -mt-1">
                <p>Monday - Friday: 10:00 AM - 4:00 PM EST</p>
              
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <br></br>
            <br></br>
            <h2 className="text-2xl font-bold text-[#1e40af] dark:text-blue-300 mb-6">Send us a Message</h2>
            
            {/* Success Message */}
            {actionData?.success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                <p className="text-green-800 dark:text-green-200 font-medium">{actionData.message}</p>
              </div>
            )}

            {/* Error Message */}
            {actionData?.error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
                <p className="text-red-800 dark:text-red-200 font-medium">{actionData.error}</p>
              </div>
            )}

            <fetcher.Form
              ref={formRef}
              method="post"
              action="/api/contact"
              className="space-y-6"
              aria-label="Contact form"
            >
              {/* Honeypot field - hidden from users but visible to bots */}
              <div style={{position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden'}} aria-hidden="true">
                <label htmlFor="website">Website (leave blank)</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              
              {/* Timestamp field for time-based validation */}
              <input
                type="hidden"
                name="formLoadTime"
                value={formLoadTime}
              />

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] dark:focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Your full name"
                  aria-describedby="name-error"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] dark:focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] dark:focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] dark:focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select a topic</option>
                  
                  <option value="general">General Inquiry</option>
                  <option value="product">Product Information</option>
                  <option value="support">Technical Support</option>
                  <option value="quote">Request a Quote</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <br></br>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e40af] dark:focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <br></br>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white dark:bg-gray-800 border-2 border-[#1e40af] dark:border-blue-400 text-[#1e40af] dark:text-blue-300 py-3 px-6 rounded-lg font-semibold hover:bg-[#1e40af] dark:hover:bg-blue-500 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800 disabled:hover:text-[#1e40af] dark:disabled:hover:text-blue-300"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </fetcher.Form>
          </div>
        </div>

        {/* FAQ Section */}
        <br></br>
        <br></br>
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-[#1e40af] dark:text-blue-300 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  What&apos;s the difference between your air purifiers?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our air purifiers are designed for different needs: HealthMate for general use, 
                  HealthMate Plus for chemical reduction, Allergy Machine for allergy relief, 
                  and Bedroom Machine for sensitive sleepers.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  How often should I replace the filters?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Filter replacement depends on usage and air quality. Generally, pre-filters 
                  should be replaced every 3-6 months, and HEPA filters every 12-18 months.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Do you offer installation services?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes! We provide professional installation and setup services to ensure 
                  your air purifier is working optimally for your space.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  What&apos;s your return policy?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We offer a 30-day satisfaction guarantee. If you&apos;re not completely 
                  satisfied with your air purifier, we&apos;ll work with you to make it right.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}