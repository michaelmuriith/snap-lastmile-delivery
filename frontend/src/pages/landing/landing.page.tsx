import React from 'react';
import { LandingLayout } from '../../components/layout/landing-layout.component';
import { HeroSection } from '../../components/landing/hero-section.component';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <LandingLayout>
      <HeroSection />

      {/* Value Proposition Section */}
      <section className="py-20 bg-surface" aria-labelledby="value-proposition-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="value-proposition-title" className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Why Choose CourierFlow?
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Experience the perfect blend of speed, reliability, and transparency in every delivery
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Real-time Tracking */}
            <article className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Real-time Tracking</h3>
              <p className="text-text-secondary">See every step of your package journey with live GPS tracking and instant status updates.</p>
            </article>

            {/* Professional Drivers */}
            <article className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Vetted Drivers</h3>
              <p className="text-text-secondary">All drivers are background-checked, insured, and trained for professional service.</p>
            </article>

            {/* Instant Booking */}
            <article className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Instant Booking</h3>
              <p className="text-text-secondary">Book a delivery in seconds with transparent pricing and immediate driver matching.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Multi-Entry CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-700" aria-labelledby="cta-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-title" className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Experience Reliable Delivery?
          </h2>
          <p className="text-xl text-primary-100 mb-12 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust CourierFlow for their delivery needs
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Customer CTA */}
            <article className="bg-surface rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Send a Package</h3>
              <p className="text-text-secondary text-sm mb-4">Quick, reliable delivery with real-time tracking</p>
              <button
                onClick={() => handleNavigation('/connect/send')}
                className="btn-primary w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Book Now
              </button>
            </article>

            {/* Driver CTA */}
            <article className="bg-surface rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Become a Driver</h3>
              <p className="text-text-secondary text-sm mb-4">Earn flexible income on your schedule</p>
              <button
                onClick={() => handleNavigation('/connect/driver')}
                className="btn-secondary w-full focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
              >
                Apply Now
              </button>
            </article>

            {/* Business CTA */}
            <article className="bg-surface rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Business Solutions</h3>
              <p className="text-text-secondary text-sm mb-4">Enterprise delivery solutions and API access</p>
              <button
                onClick={() => handleNavigation('/pricing')}
                className="btn-outline w-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                Learn More
              </button>
            </article>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};