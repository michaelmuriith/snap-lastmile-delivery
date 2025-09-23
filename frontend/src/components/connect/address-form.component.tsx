import React, { useRef, useEffect } from 'react';

interface AddressFormProps {
  pickupAddress: string;
  deliveryAddress: string;
  onPickupAddressChange: (address: string) => void;
  onDeliveryAddressChange: (address: string) => void;
  onUseCurrentLocation?: () => void;
  onUseSavedAddress?: () => void;
}

export const AddressForm: React.FC<AddressFormProps> = React.memo(({
  pickupAddress,
  deliveryAddress,
  onPickupAddressChange,
  onDeliveryAddressChange,
  onUseCurrentLocation,
  onUseSavedAddress
}) => {
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const deliveryInputRef = useRef<HTMLInputElement>(null);
  const pickupAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const deliveryAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!pickupInputRef.current || !deliveryInputRef.current) return;



    let initialized = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    const ready = () =>
      typeof window !== 'undefined' &&
      (window as any).google &&
      google.maps &&
      google.maps.places &&
      typeof google.maps.places.Autocomplete !== 'undefined';

    const init = () => {
      if (initialized || !ready()) return false;

      try {
        // Try to use the new PlaceAutocompleteElement (recommended)
        if (google.maps.places.PlaceAutocompleteElement) {
          // Create containers for the new autocomplete elements
          const pickupContainer = document.createElement('div');
          const deliveryContainer = document.createElement('div');

          // Insert containers after the inputs
          pickupInputRef.current!.parentNode!.insertBefore(pickupContainer, pickupInputRef.current!.nextSibling);
          deliveryInputRef.current!.parentNode!.insertBefore(deliveryContainer, deliveryInputRef.current!.nextSibling);

          // Create new PlaceAutocompleteElement instances
          const pickupAutocomplete = new google.maps.places.PlaceAutocompleteElement({
            componentRestrictions: { country: 'ke' },
            locationRestriction: new google.maps.LatLngBounds(
              new google.maps.LatLng(-1.5, 36.5),
              new google.maps.LatLng(-1.0, 37.0)
            )
          });

          const deliveryAutocomplete = new google.maps.places.PlaceAutocompleteElement({
            componentRestrictions: { country: 'ke' },
            locationRestriction: new google.maps.LatLngBounds(
              new google.maps.LatLng(-1.5, 36.5),
              new google.maps.LatLng(-1.0, 37.0)
            )
          });

          // Add event listeners
          pickupAutocomplete.addEventListener('gmp-placeselect', (event: any) => {
            const place = event.place;
            const label = place.displayName || place.formattedAddress || '';
            if (label) onPickupAddressChange(label);
          });

          deliveryAutocomplete.addEventListener('gmp-placeselect', (event: any) => {
            const place = event.place;
            const label = place.displayName || place.formattedAddress || '';
            if (label) onDeliveryAddressChange(label);
          });

          // Append to containers
          pickupContainer.appendChild(pickupAutocomplete);
          deliveryContainer.appendChild(deliveryAutocomplete);

          // Hide original inputs and show new autocomplete elements
          pickupInputRef.current!.style.display = 'none';
          deliveryInputRef.current!.style.display = 'none';

          pickupContainer.style.marginTop = '0.5rem';
          deliveryContainer.style.marginTop = '0.5rem';

          initialized = true;
          return true;
        } else {
          // Fallback to legacy Autocomplete (deprecated but still works)
          console.warn('Using deprecated Autocomplete - consider upgrading to PlaceAutocompleteElement');

          const commonOptions: google.maps.places.AutocompleteOptions = {
            componentRestrictions: { country: 'ke' },
            fields: ['formatted_address', 'geometry', 'place_id', 'name', 'types'],
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(-1.5, 36.5),
              new google.maps.LatLng(-1.0, 37.0)
            ),
            strictBounds: false
          };

          pickupAutocompleteRef.current = new google.maps.places.Autocomplete(
            pickupInputRef.current!,
            commonOptions
          );

          deliveryAutocompleteRef.current = new google.maps.places.Autocomplete(
            deliveryInputRef.current!,
            commonOptions
          );

          pickupAutocompleteRef.current.addListener('place_changed', () => {
            const place = pickupAutocompleteRef.current!.getPlace();
            const label = place.name || place.formatted_address || '';
            if (label) onPickupAddressChange(label);
          });

          deliveryAutocompleteRef.current.addListener('place_changed', () => {
            const place = deliveryAutocompleteRef.current!.getPlace();
            const label = place.name || place.formatted_address || '';
            if (label) onDeliveryAddressChange(label);
          });

          initialized = true;
          return true;
        }
      } catch (error) {
        console.error('Error initializing autocomplete:', error);
        return false;
      }
    };

    // Try immediately; otherwise poll briefly while the script finishes loading.
    if (!init()) {
      let attempts = 0;
      interval = setInterval(() => {
        attempts++;
        if (init() || attempts > 60) {
          if (interval) clearInterval(interval);
        }
      }, 300);
    }

    // Prevent Enter key from submitting parent forms too early
    const preventSubmit = (e: KeyboardEvent) => {
      if (e.key === 'Enter') e.preventDefault();
    };
    pickupInputRef.current.addEventListener('keydown', preventSubmit);
    deliveryInputRef.current.addEventListener('keydown', preventSubmit);

    return () => {
      if (interval) clearInterval(interval);
      if (pickupAutocompleteRef.current) {
        google.maps.event.clearInstanceListeners(pickupAutocompleteRef.current);
      }
      if (deliveryAutocompleteRef.current) {
        google.maps.event.clearInstanceListeners(deliveryAutocompleteRef.current);
      }
      pickupInputRef.current?.removeEventListener('keydown', preventSubmit);
      deliveryInputRef.current?.removeEventListener('keydown', preventSubmit);
    };
  }, [onPickupAddressChange, onDeliveryAddressChange]);

  // Keep input values in sync without triggering place_changed
  useEffect(() => {
    if (pickupInputRef.current && pickupInputRef.current.value !== pickupAddress) {
      pickupInputRef.current.value = pickupAddress;
    }
  }, [pickupAddress]);

  useEffect(() => {
    if (deliveryInputRef.current && deliveryInputRef.current.value !== deliveryAddress) {
      deliveryInputRef.current.value = deliveryAddress;
    }
  }, [deliveryAddress]);

  return (
    <div className="bg-surface rounded-xl p-6 shadow-base">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Pickup & Delivery Addresses</h3>

      {/* Pickup Address */}
      <div className="mb-6">
        <label htmlFor="pickup-address" className="block text-sm font-medium text-text-primary mb-2">
          <svg className="w-4 h-4 inline mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Pickup Address or Business
        </label>
        <div className="relative">
          <input
            ref={pickupInputRef}
            id="pickup-address"
            type="text"
            placeholder="Search a place or address in Nairobi (e.g., Sarit Centre)"
            defaultValue={pickupAddress}
            className="form-input pr-12"
            required
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onUseCurrentLocation}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label="Use current location for pickup"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
        </div>
        <p className="text-xs text-text-secondary mt-1">
          <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Try business names too (e.g., “The Junction Mall”, “Java House ABC”)
        </p>
      </div>

      {/* Delivery Address */}
      <div className="mb-6">
        <label htmlFor="delivery-address" className="block text-sm font-medium text-text-primary mb-2">
          <svg className="w-4 h-4 inline mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4"/>
          </svg>
          Delivery Address or Business
        </label>
        <input
          ref={deliveryInputRef}
          id="delivery-address"
          type="text"
          placeholder="Enter delivery address or place"
          defaultValue={deliveryAddress}
          className="form-input"
          required
          autoComplete="off"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2 mb-4">
        <button
          type="button"
          onClick={onUseCurrentLocation}
          className="text-xs bg-primary-50 text-primary px-3 py-1 rounded-full hover:bg-primary-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Use Current Location
        </button>
        <button
          type="button"
          onClick={onUseSavedAddress}
          className="text-xs bg-secondary-50 text-secondary px-3 py-1 rounded-full hover:bg-secondary-100 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          Saved Addresses
        </button>
      </div>
    </div>
  );
});
