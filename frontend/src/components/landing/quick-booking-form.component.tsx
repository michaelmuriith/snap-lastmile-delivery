import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface QuickBookingFormProps {
  className?: string;
}

const QuickBookingFormComponent: React.FC<QuickBookingFormProps> = ({ className = '' }) => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const navigate = useNavigate();

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (pickupAddress && deliveryAddress) {
      // Navigate to booking page with pre-filled data
      navigate('/connect/send', {
        state: { pickupAddress, deliveryAddress }
      });
    }
  }, [pickupAddress, deliveryAddress, navigate]);

  return (
    <section className={`bg-surface rounded-xl shadow-lg p-6 ${className}`} aria-labelledby="quick-booking-title">
      <h3 id="quick-booking-title" className="text-lg font-semibold text-text-primary mb-4">Quick Booking</h3>
      <form onSubmit={handleSubmit} className="space-y-3" role="form" aria-label="Quick delivery booking form">
        <div>
          <label htmlFor="pickup-address" className="sr-only">Pickup address</label>
          <input
            id="pickup-address"
            type="text"
            placeholder="Pickup address"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            className="form-input text-sm"
            required
            aria-describedby="pickup-help"
          />
          <span id="pickup-help" className="sr-only">Enter the address where the package will be picked up</span>
        </div>
        <div>
          <label htmlFor="delivery-address" className="sr-only">Delivery address</label>
          <input
            id="delivery-address"
            type="text"
            placeholder="Delivery address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="form-input text-sm"
            required
            aria-describedby="delivery-help"
          />
          <span id="delivery-help" className="sr-only">Enter the address where the package will be delivered</span>
        </div>
        <button
          type="submit"
          className="btn-primary w-full text-center block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Submit booking form to get instant quote"
        >
          Get Instant Quote
        </button>
      </form>
    </section>
  );
};

export const QuickBookingForm = React.memo(QuickBookingFormComponent);