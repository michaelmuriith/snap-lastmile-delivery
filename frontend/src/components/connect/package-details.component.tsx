import React from 'react';
import { PACKAGE_SIZES, DELIVERY_SPEEDS } from '../../constants/connect.constants';

interface PackageDetailsProps {
  selectedPackageSize: string;
  selectedDeliverySpeed: string;
  specialInstructions: string;
  onPackageSizeChange: (sizeId: string) => void;
  onDeliverySpeedChange: (speedId: string) => void;
  onSpecialInstructionsChange: (instructions: string) => void;
}

export const PackageDetails: React.FC<PackageDetailsProps> = React.memo(({
  selectedPackageSize,
  selectedDeliverySpeed,
  specialInstructions,
  onPackageSizeChange,
  onDeliverySpeedChange,
  onSpecialInstructionsChange
}) => {
  return (
    <div className="bg-surface rounded-xl p-6 shadow-base">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Package Information</h3>

      {/* Package Size Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-3">Package Size</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PACKAGE_SIZES.map((size) => (
            <button
              key={size.id}
              onClick={() => onPackageSizeChange(size.id)}
              className={`p-3 text-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg ${
                selectedPackageSize === size.id
                  ? 'border-2 border-primary bg-primary-50'
                  : 'border-2 border-border rounded-lg hover:border-primary hover:bg-primary-50'
              }`}
              aria-pressed={selectedPackageSize === size.id}
              aria-label={`Select ${size.name} package size, ${size.maxWeight}`}
            >
              <svg
                className={`w-8 h-8 mx-auto mb-2 ${
                  selectedPackageSize === size.id ? 'text-primary' : 'text-text-secondary'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={size.icon} />
              </svg>
              <div className={`text-xs font-medium ${
                selectedPackageSize === size.id ? 'text-primary' : 'text-text-primary'
              }`}>
                {size.name}
              </div>
              <div className="text-xs text-text-secondary">{size.maxWeight}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Time Preferences */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-3">Delivery Speed</label>
        <div className="space-y-3">
          {DELIVERY_SPEEDS.map((speed) => (
            <button
              key={speed.id}
              onClick={() => onDeliverySpeedChange(speed.id)}
              className={`w-full border-2 rounded-lg p-4 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                selectedDeliverySpeed === speed.id
                  ? 'border-primary bg-primary-50'
                  : 'border-border hover:border-primary hover:bg-primary-50'
              }`}
              aria-pressed={selectedDeliverySpeed === speed.id}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-medium ${
                    selectedDeliverySpeed === speed.id ? 'text-primary' : 'text-text-primary'
                  }`}>
                    {speed.name}
                  </div>
                  <div className="text-sm text-text-secondary">{speed.description}</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${
                    selectedDeliverySpeed === speed.id ? 'text-primary' : 'text-text-primary'
                  }`}>
                    Ksh {speed.basePrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-text-secondary">+ distance</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Special Instructions */}
      <div className="mb-4">
        <label htmlFor="special-instructions" className="block text-sm font-medium text-text-primary mb-2">
          Special Instructions (Optional)
        </label>
        <textarea
          id="special-instructions"
          value={specialInstructions}
          onChange={(e) => onSpecialInstructionsChange(e.target.value)}
          className="form-input h-20 resize-none"
          placeholder="Any special handling requirements, delivery instructions, or notes for the driver..."
          maxLength={500}
        />
        <div className="text-xs text-text-secondary mt-1">
          {specialInstructions.length}/500 characters
        </div>
      </div>
    </div>
  );
});