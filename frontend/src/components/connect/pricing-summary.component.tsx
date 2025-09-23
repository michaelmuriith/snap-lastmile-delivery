import React from 'react';
import { DELIVERY_SPEEDS } from '../../constants/connect.constants';

interface PricingSummaryProps {
  selectedDeliverySpeed: string;
  distance: number;
  packageSize: string;
  onContinueToPayment: () => void;
}

export const PricingSummary: React.FC<PricingSummaryProps> = React.memo(({
  selectedDeliverySpeed,
  distance,
  packageSize,
  onContinueToPayment
}) => {
  const selectedSpeed = DELIVERY_SPEEDS.find(speed => speed.id === selectedDeliverySpeed);
  const baseRate = selectedSpeed?.basePrice || 0;
  const distanceCost = distance * 2.5; // $2.50 per mile
  const packageSizeCost = packageSize === 'small' ? 0 : packageSize === 'medium' ? 2 : packageSize === 'large' ? 5 : 10;
  const total = baseRate + distanceCost + packageSizeCost;

  const getEstimatedTime = () => {
    return selectedSpeed?.estimatedTime || 'TBD';
  };

  return (
    <div className="bg-surface rounded-xl p-6 shadow-base border-2 border-primary-100">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Pricing Summary</h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Base Rate ({selectedSpeed?.name.split(' ')[0] || 'Standard'})</span>
          <span className="font-medium text-text-primary">Ksh {baseRate.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Distance ({distance.toFixed(1)} km)</span>
          <span className="font-medium text-text-primary">Ksh {distanceCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Package Size ({packageSize})</span>
          <span className="font-medium text-text-primary">Ksh {packageSizeCost.toFixed(2)}</span>
        </div>
        <div className="border-t border-border-light pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-text-primary">Total</span>
            <span className="text-2xl font-bold text-primary">Ksh {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Estimated Delivery Time */}
      <div className="bg-success-50 rounded-lg p-3 mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-success mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span className="text-sm font-medium text-success">Estimated delivery: {getEstimatedTime()}</span>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={onContinueToPayment}
        className="btn-primary w-full text-lg py-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Continue to payment with total amount"
      >
        Continue to Payment
        <svg className="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  );
});