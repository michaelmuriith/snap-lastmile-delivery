import React, { useEffect, useRef, useState } from 'react';
import { Input } from './input';
import { cn } from '../../utils/cn';

interface AddressAutocompleteProps {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onPlaceSelect,
  placeholder,
  className,
  disabled,
  required,
  error,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Wait for Google Maps to load
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsLoaded(true);
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };
    checkGoogleMaps();
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    // Initialize Google Places Autocomplete
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      fields: ['formatted_address', 'geometry', 'place_id', 'address_components'],
      componentRestrictions: { country: [] }, // Allow all countries
    });

    // Add place_changed listener
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (place.formatted_address) {
        // Create a synthetic event for react-hook-form compatibility
        const syntheticEvent = {
          target: { value: place.formatted_address, name: (props as any).name },
          type: 'change',
          currentTarget: inputRef.current
        } as React.ChangeEvent<HTMLInputElement>;

        onChange?.(syntheticEvent);
      }

      onPlaceSelect?.(place);
    });

    autocompleteRef.current = autocomplete;

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onChange, onPlaceSelect]);

  // Update input value when prop changes
  useEffect(() => {
    if (inputRef.current && value !== undefined) {
      inputRef.current.value = value;
    }
  }, [value]);

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder={placeholder || "Start typing to search for address"}
      className={cn(error && "border-destructive", className)}
      disabled={disabled || !isLoaded}
      required={required}
      {...props}
    />
  );
};