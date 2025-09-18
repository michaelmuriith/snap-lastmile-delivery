-- Create tracking table for GPS location data
CREATE TABLE IF NOT EXISTS tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(6, 2),
    speed DECIMAL(5, 2),
    heading DECIMAL(5, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tracking_sessions table for session management
CREATE TABLE IF NOT EXISTS tracking_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    total_distance DECIMAL(10, 2),
    average_speed DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tracking_delivery_id ON tracking(delivery_id);
CREATE INDEX IF NOT EXISTS idx_tracking_driver_id ON tracking(driver_id);
CREATE INDEX IF NOT EXISTS idx_tracking_created_at ON tracking(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_status ON tracking(status);

CREATE INDEX IF NOT EXISTS idx_tracking_sessions_delivery_id ON tracking_sessions(delivery_id);
CREATE INDEX IF NOT EXISTS idx_tracking_sessions_driver_id ON tracking_sessions(driver_id);
CREATE INDEX IF NOT EXISTS idx_tracking_sessions_status ON tracking_sessions(status);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_tracking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_tracking_updated_at
    BEFORE UPDATE ON tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_tracking_updated_at();

CREATE TRIGGER trigger_tracking_sessions_updated_at
    BEFORE UPDATE ON tracking_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_tracking_sessions_updated_at();