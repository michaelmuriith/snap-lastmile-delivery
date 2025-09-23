import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  steps?: string[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = React.memo(({
  currentStep,
  totalSteps = 3,
  steps = ['Delivery Details', 'Payment', 'Confirmation']
}) => {
  return (
    <div className="bg-surface rounded-xl p-6 shadow-base">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
            {currentStep}
          </div>
          <span className="font-semibold text-text-primary">{steps[currentStep - 1]}</span>
        </div>
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index < currentStep ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});