import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingLayout } from '../../components/layout/layout';
import { Stepper } from '../../components/connect/stepper.component';
import { AddressForm } from '../../components/connect/address-form.component';
import { PackageDetails } from '../../components/connect/package-details.component';
import { PricingSummary } from '../../components/connect/pricing-summary.component';
import { RouteMap } from '../../components/connect/route-map.component';
import { DriverList } from '../../components/connect/driver-list.component';
import { CONNECT_CONTENT } from '../../constants/connect.constants';

interface DeliveryFormData {
  pickupAddress: string;
  deliveryAddress: string;
  packageSize: string;
  deliverySpeed: string;
  specialInstructions: string;
}

export const ConnectPage: React.FC = React.memo(() => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<DeliveryFormData>({
    pickupAddress: '123 Business Plaza, Downtown',
    deliveryAddress: '',
    packageSize: 'small',
    deliverySpeed: 'express',
    specialInstructions: ''
  });

  const [calculatedDistance, setCalculatedDistance] = useState(20);
  const [calculatedDuration, setCalculatedDuration] = useState('15 mins');

  const steps = [
    {
      id: 'package-details',
      title: 'Package Details',
      description: 'Enter addresses and package info'
    },
    {
      id: 'select-driver',
      title: 'Select Driver',
      description: 'Choose your preferred driver'
    },
    {
      id: 'confirm-booking',
      title: 'Confirm Booking',
      description: 'Review and complete booking'
    }
  ];

  const updateFormData = useCallback((field: keyof DeliveryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePickupAddressChange = useCallback((address: string) => {
    updateFormData('pickupAddress', address);
  }, [updateFormData]);

  const handleDeliveryAddressChange = useCallback((address: string) => {
    updateFormData('deliveryAddress', address);
  }, [updateFormData]);

  const handlePackageSizeChange = useCallback((size: string) => {
    updateFormData('packageSize', size);
  }, [updateFormData]);

  const handleDeliverySpeedChange = useCallback((speed: string) => {
    updateFormData('deliverySpeed', speed);
  }, [updateFormData]);

  const handleSpecialInstructionsChange = useCallback((instructions: string) => {
    updateFormData('specialInstructions', instructions);
  }, [updateFormData]);

  const handleUseCurrentLocation = useCallback(() => {
    // TODO: Implement geolocation
    console.log('Using current location');
  }, []);

  const handleUseSavedAddress = useCallback(() => {
    // TODO: Implement saved addresses
    console.log('Using saved addresses');
  }, []);

  // Check if package details are complete
  const isPackageDetailsComplete = useMemo(() => {
    return formData.pickupAddress &&
           formData.deliveryAddress &&
           formData.packageSize &&
           formData.deliverySpeed;
  }, [formData.pickupAddress, formData.deliveryAddress, formData.packageSize, formData.deliverySpeed]);

  const canProceedToStep = useCallback((stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Package Details - always accessible
        return true;
      case 1: // Select Driver - requires package details
        return Boolean(isPackageDetailsComplete);
      case 2: // Confirm Booking - requires driver selection (future implementation)
        return Boolean(isPackageDetailsComplete); // For now, just require package details
      default:
        return false;
    }
  }, [isPackageDetailsComplete]);

  const handleContinueToPayment = useCallback(() => {
    // TODO: Navigate to payment page with form data
    console.log('Continuing to payment with data:', formData);
    navigate('/payment', { state: { deliveryData: formData } });
  }, [formData, navigate]);

  const handleStepChange = useCallback((stepIndex: number) => {
    if (canProceedToStep(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  }, [canProceedToStep]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1 && canProceedToStep(currentStep + 1)) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length, canProceedToStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleDistanceChange = useCallback((distance: number, duration: string) => {
    setCalculatedDistance(distance);
    setCalculatedDuration(duration);
  }, []);


  return (
    <LandingLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}


        {/* Dual Pane Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Panel - Booking Form */}
          <section className="space-y-6" aria-labelledby="booking-form">
                    <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-2">
            {CONNECT_CONTENT.pageTitle}
          </h1>
          <p className="text-lg text-text-secondary">
            {CONNECT_CONTENT.pageSubtitle}
          </p>
        </header>
            <h2 id="booking-form" className="sr-only">Delivery Booking Form</h2>

            <Stepper
              steps={steps}
              currentStep={currentStep}
              onStepChange={handleStepChange}
              canProceedToStep={canProceedToStep}
              onNext={handleNext}
              onBack={handleBack}
            />

            {currentStep === 0 && (
              <>
                <AddressForm
                  pickupAddress={formData.pickupAddress}
                  deliveryAddress={formData.deliveryAddress}
                  onPickupAddressChange={handlePickupAddressChange}
                  onDeliveryAddressChange={handleDeliveryAddressChange}
                  onUseCurrentLocation={handleUseCurrentLocation}
                  onUseSavedAddress={handleUseSavedAddress}
                />

                <PackageDetails
                  selectedPackageSize={formData.packageSize}
                  selectedDeliverySpeed={formData.deliverySpeed}
                  specialInstructions={formData.specialInstructions}
                  onPackageSizeChange={handlePackageSizeChange}
                  onDeliverySpeedChange={handleDeliverySpeedChange}
                  onSpecialInstructionsChange={handleSpecialInstructionsChange}
                />

                <PricingSummary
                  selectedDeliverySpeed={formData.deliverySpeed}
                  distance={calculatedDistance}
                  packageSize={formData.packageSize}
                  onContinueToPayment={handleContinueToPayment}
                />
              </>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-surface rounded-xl p-6 shadow-base">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Select Your Driver</h3>
                  <DriverList />
                </div>

                <div className="bg-surface rounded-xl p-6 shadow-base">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Booking Summary</h3>
                  <PricingSummary
                    selectedDeliverySpeed={formData.deliverySpeed}
                    distance={calculatedDistance}
                    packageSize={formData.packageSize}
                    onContinueToPayment={handleContinueToPayment}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-surface rounded-xl p-6 shadow-base">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Confirm Your Booking</h3>
                <p className="text-text-secondary mb-6">
                  Please review your booking details and confirm to proceed to payment.
                </p>
                {/* Future: Add booking confirmation details */}
                <button
                  onClick={handleContinueToPayment}
                  className="btn-primary w-full"
                >
                  Proceed to Payment
                </button>
              </div>
            )}
          </section>

          {/* Right Panel - Interactive Map */}
          <aside className="lg:sticky lg:top-24 lg:h-fit" aria-labelledby="route-preview">
            <h2 id="route-preview" className="sr-only">Route Preview and Driver Information</h2>

            <RouteMap
              pickupAddress={formData.pickupAddress}
              deliveryAddress={formData.deliveryAddress}
              distance={`${calculatedDistance.toFixed(1)} km`}
              duration={calculatedDuration}
              availableDrivers={CONNECT_CONTENT.availableDrivers}
              onDistanceChange={handleDistanceChange}
            />

            {currentStep === 0 && !isPackageDetailsComplete && (
              <div className="mt-6 bg-surface rounded-xl p-6 shadow-base">
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-text-secondary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Complete Package Details</h3>
                  <p className="text-text-secondary">Fill in your pickup address, delivery address, package size, and delivery speed to proceed to driver selection.</p>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="mt-6">
                <DriverList />
              </div>
            )}

            {currentStep === 2 && (
              <div className="mt-6 bg-surface rounded-xl p-6 shadow-base">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Booking Confirmation</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Pickup:</span>
                    <span className="font-medium">{formData.pickupAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Delivery:</span>
                    <span className="font-medium">{formData.deliveryAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Package Size:</span>
                    <span className="font-medium capitalize">{formData.packageSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Delivery Speed:</span>
                    <span className="font-medium capitalize">{formData.deliverySpeed}</span>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </LandingLayout>
  );
});