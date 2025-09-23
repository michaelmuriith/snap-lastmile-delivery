import React from 'react';
import { SAMPLE_DRIVERS } from '../../constants/connect.constants';
import type { Driver } from '../../constants/connect.constants';

interface DriverListProps {
  drivers?: Driver[];
}

export const DriverList: React.FC<DriverListProps> = React.memo(({
  drivers = SAMPLE_DRIVERS
}) => {
  return (
    <div className="mt-6 bg-surface rounded-xl p-6 shadow-base">
      <h3 className="font-semibold text-text-primary mb-4">Available Drivers</h3>

      <div className="space-y-3">
        {drivers.map((driver) => (
          <article
            key={driver.id}
            className="flex items-center justify-between p-3 border border-border-light rounded-lg hover:border-primary-200 transition-colors"
          >
            <div className="flex items-center">
              <img
                src={driver.avatar}
                alt={`Profile picture of ${driver.name}`}
                className="w-10 h-10 rounded-full object-cover mr-3"
                loading="lazy"
              />
              <div>
                <div className="font-medium text-text-primary">{driver.name}</div>
                <div className="text-xs text-text-secondary">
                  {driver.rating}★ • {driver.distance}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${
                driver.status === 'available' ? 'text-success' : 'text-warning'
              }`}>
                {driver.status === 'available' ? 'Available' : 'Busy'}
              </div>
              <div className="text-xs text-text-secondary">{driver.eta}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
});