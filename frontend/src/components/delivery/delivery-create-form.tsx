import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useDeliveryStore } from '../../stores/delivery.store';
import { useAuthStore } from '../../stores/auth.store';

const deliverySchema = z.object({
  type: z.enum(['send', 'receive', 'store_pickup']),
  pickupAddress: z.string().min(10, 'Pickup address must be at least 10 characters'),
  pickupLatitude: z.number().optional(),
  pickupLongitude: z.number().optional(),
  deliveryAddress: z.string().min(10, 'Delivery address must be at least 10 characters'),
  deliveryLatitude: z.number().optional(),
  deliveryLongitude: z.number().optional(),
  packageDescription: z.string().min(5, 'Package description must be at least 5 characters'),
  packageValue: z.number().min(0, 'Package value must be positive').optional(),
  recipientName: z.string().min(2, 'Recipient name must be at least 2 characters').optional(),
  recipientPhone: z.string().min(10, 'Please enter a valid phone number').optional(),
});

type DeliveryForm = z.infer<typeof deliverySchema>;

interface DeliveryCreateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const DeliveryCreateForm: React.FC<DeliveryCreateFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createDelivery = useDeliveryStore((state) => state.createDelivery);
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<DeliveryForm>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      type: 'send',
    },
  });

  const selectedType = watch('type');

  const onSubmit = async (data: DeliveryForm) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      await createDelivery({
        customerId: user.id,
        ...data,
      });

      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create delivery. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAddressSuggestions = async (address: string) => {
    // This would integrate with a geocoding service like Google Maps API
    // For now, we'll just simulate some suggestions
    if (address.length < 3) return [];

    // Mock suggestions - in real app, this would call geocoding API
    return [
      `${address} Street, City`,
      `${address} Avenue, Town`,
      `${address} Road, District`,
    ];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Delivery</CardTitle>
        <CardDescription>
          Fill in the details for your delivery request
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Delivery Type */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Delivery Type</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'send', label: 'Send Package', icon: '📦' },
                { value: 'receive', label: 'Receive Package', icon: '📥' },
                { value: 'store_pickup', label: 'Store Pickup', icon: '🏪' },
              ].map((type) => (
                <label
                  key={type.value}
                  className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedType === type.value
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    value={type.value}
                    {...register('type')}
                    className="sr-only"
                  />
                  <span className="text-2xl mb-2">{type.icon}</span>
                  <span className="text-sm font-medium text-center">{type.label}</span>
                </label>
              ))}
            </div>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Pickup Address */}
          <div className="space-y-2">
            <label htmlFor="pickupAddress" className="text-sm font-medium">
              Pickup Address
            </label>
            <Input
              id="pickupAddress"
              placeholder="Enter pickup address"
              {...register('pickupAddress')}
              className={errors.pickupAddress ? 'border-destructive' : ''}
            />
            {errors.pickupAddress && (
              <p className="text-sm text-destructive">{errors.pickupAddress.message}</p>
            )}
          </div>

          {/* Delivery Address */}
          <div className="space-y-2">
            <label htmlFor="deliveryAddress" className="text-sm font-medium">
              Delivery Address
            </label>
            <Input
              id="deliveryAddress"
              placeholder="Enter delivery address"
              {...register('deliveryAddress')}
              className={errors.deliveryAddress ? 'border-destructive' : ''}
            />
            {errors.deliveryAddress && (
              <p className="text-sm text-destructive">{errors.deliveryAddress.message}</p>
            )}
          </div>

          {/* Package Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Package Details</h3>

            <div className="space-y-2">
              <label htmlFor="packageDescription" className="text-sm font-medium">
                Package Description
              </label>
              <Input
                id="packageDescription"
                placeholder="Describe the package contents"
                {...register('packageDescription')}
                className={errors.packageDescription ? 'border-destructive' : ''}
              />
              {errors.packageDescription && (
                <p className="text-sm text-destructive">{errors.packageDescription.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="packageValue" className="text-sm font-medium">
                  Package Value (USD)
                </label>
                <Input
                  id="packageValue"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('packageValue', { valueAsNumber: true })}
                  className={errors.packageValue ? 'border-destructive' : ''}
                />
                {errors.packageValue && (
                  <p className="text-sm text-destructive">{errors.packageValue.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="recipientName" className="text-sm font-medium">
                  Recipient Name
                </label>
                <Input
                  id="recipientName"
                  placeholder="Recipient's full name"
                  {...register('recipientName')}
                  className={errors.recipientName ? 'border-destructive' : ''}
                />
                {errors.recipientName && (
                  <p className="text-sm text-destructive">{errors.recipientName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="recipientPhone" className="text-sm font-medium">
                Recipient Phone
              </label>
              <Input
                id="recipientPhone"
                type="tel"
                placeholder="Recipient's phone number"
                {...register('recipientPhone')}
                className={errors.recipientPhone ? 'border-destructive' : ''}
              />
              {errors.recipientPhone && (
                <p className="text-sm text-destructive">{errors.recipientPhone.message}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Creating...' : 'Create Delivery'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};