import React from 'react';
import { QuickBookingForm } from './quick-booking-form.component';
import { LANDING_CONTENT } from '../../constants/landing.constants';

const HeroSectionComponent: React.FC = () => {
  const { title, subtitle, stats, image: heroImage } = LANDING_CONTENT.hero;
  return (
    <section
      className="relative bg-gradient-to-br from-primary-50 to-secondary-50 overflow-hidden"
      aria-labelledby="hero-title"
      role="banner"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" aria-hidden="true"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left">
            <h1 id="hero-title" className="text-4xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
              {title.split(' ').map((word, index) =>
                word === 'Reliable' ? (
                  <span key={index} className="text-primary" aria-label="Reliable">{word} </span>
                ) : (
                  word + ' '
                )
              )}
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              {subtitle}
            </p>

            <QuickBookingForm className="mb-8 max-w-md mx-auto lg:mx-0" />

            {/* Live Stats */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm" role="region" aria-label="Live statistics">
              <div className="flex items-center">
                <div
                  className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"
                  aria-label="Live status indicator"
                  role="status"
                ></div>
                <span className="text-text-secondary">
                  Live: <span className="font-semibold text-text-primary">{stats.deliveriesToday}</span> deliveries today
                </span>
              </div>
              <div className="text-text-secondary">
                <span className="font-semibold text-text-primary">{stats.rating}★</span> rating
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <figure className="relative" role="img" aria-labelledby="hero-image-caption">
            <div className="relative bg-surface rounded-2xl shadow-xl overflow-hidden">
              <img
                src={heroImage}
                alt="Professional courier delivering a package with real-time tracking"
                className="w-full h-80 object-cover"
                loading="lazy"
              />

              {/* Floating Status Card */}
              <div
                className="absolute top-4 right-4 bg-surface/95 backdrop-blur-sm rounded-lg p-3 shadow-lg"
                role="status"
                aria-label="Current delivery status"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 bg-success rounded-full animate-pulse"
                    aria-label="Package is en route"
                  ></div>
                  <span className="text-sm font-medium text-text-primary">En Route</span>
                </div>
                <p className="text-xs text-text-secondary mt-1">Arriving in 12 min</p>
              </div>
            </div>
            <figcaption id="hero-image-caption" className="sr-only">
              Professional courier service with real-time package tracking
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};

export const HeroSection = React.memo(HeroSectionComponent);