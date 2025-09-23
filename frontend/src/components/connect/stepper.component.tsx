import React from 'react';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  canProceedToStep: (step: number) => boolean;
  onNext?: () => void;
  onBack?: () => void;
  showNavigation?: boolean;
}

export const Stepper: React.FC<StepperProps> = React.memo(({
  steps,
  currentStep,
  onStepChange,
  canProceedToStep,
  onNext,
  onBack,
  showNavigation = true
}) => {
  const handleStepClick = (stepIndex: number) => {
    if (canProceedToStep(stepIndex)) {
      onStepChange(stepIndex);
    }
  };

  const canGoNext = currentStep < steps.length - 1 && canProceedToStep(currentStep + 1);
  const canGoBack = currentStep > 0;

  return (
    <div className="bg-surface rounded-xl p-6 shadow-base mb-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isAccessible = canProceedToStep(index);
          const isClickable = isAccessible || isCompleted;

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => isClickable && handleStepClick(index)}
                disabled={!isClickable}
                className={`flex flex-col items-center relative ${
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 transition-colors ${
                    isCompleted
                      ? 'bg-success text-white'
                      : isCurrent
                      ? 'bg-primary text-white'
                      : isAccessible
                      ? 'bg-primary-100 text-primary border-2 border-primary'
                      : 'bg-border text-text-secondary'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium ${
                    isCurrent ? 'text-primary' : isCompleted ? 'text-success' : 'text-text-secondary'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-text-secondary hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 mt-[-20px] ${
                    index < currentStep ? 'bg-success' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      {showNavigation && (
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            disabled={!canGoBack}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              canGoBack
                ? 'bg-surface border border-border text-text-primary hover:bg-primary-50'
                : 'bg-surface border border-border text-text-secondary cursor-not-allowed'
            }`}
          >
            Back
          </button>

          <div className="text-sm text-text-secondary">
            Step {currentStep + 1} of {steps.length}
          </div>

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              canGoNext
                ? 'bg-primary text-white hover:bg-primary-700'
                : 'bg-border text-text-secondary cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
});