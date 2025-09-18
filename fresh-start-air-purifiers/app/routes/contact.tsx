import type {MetaFunction} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    {title: 'Contact Us - Fresh Start Air Purifiers'},
    {name: 'description', content: 'Get in touch with Fresh Start Air Purifiers. We&apos;re here to help you find the perfect air purifier for your needs.'},
  ];
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1e40af] mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We&apos;re here to help you find the perfect air purifier for your home. 
            Get in touch with our team of experts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <br />
              <h2 className="text-2xl font-bold text-[#1e40af] mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#1e40af] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <a href="tel:+19044388325" className="text-[#1e40af] hover:underline">
                      <span className="phone-number">(904) 438-8325</span>
                    </a>
                  </div>
                </div>

                <br />
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#1e40af] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a 
                      href="mailto:info@freshstartairpurifiers.com" 
                      className="text-[#1e40af] hover:underline"
                      data-obfuscated="true"
                    >
                      <span className="email-address" data-user="info" data-domain="freshstartairpurifiers.com">
                        info<span className="at-symbol">@</span>freshstartairpurifiers.com
                      </span>
                    </a>
                  </div>
                </div>

                <br />
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#1e40af] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-[#1e40af] font-medium">Serving Florida and the continental US</p>
                  </div>
                </div>
              </div>
            </div>

            <br />

            <div>
              <h3 className="text-xl font-bold text-[#1e40af] mb-4">Business Hours</h3>
              <div className="space-y-2 text-gray-600">
                <p>Monday - Friday: 10:00 AM - 4:00 PM EST</p>
              
              </div>
            </div>
          </div>

          <br />
          <br />

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-6">Send us a Message</h2>
            <form className="space-y-6" aria-label="Contact form">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
                  placeholder="Your full name"
                  aria-describedby="name-error"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="product">Product Information</option>
                  <option value="support">Technical Support</option>
                  <option value="quote">Request a Quote</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <br />
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#1e40af] focus:border-transparent text-base"
                  style={{ borderRadius: '12px' }}
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <br />
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="add-to-cart-button"
                  style={{ minWidth: '180px', maxWidth: '200px' }}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        <br />

        {/* FAQ Section */}
        
      </div>
    </div>
  );
}