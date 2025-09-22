SELECT * FROM users;

/*
INSERT INTO users (name, email, phone, "password", "role", is_verified, created_at, updated_at)
VALUES (
  'Admin User',
  'admin@snap.com',
  '+1234567890',
  '$2b$12$9lDpnNxyqdv.kv.FaReVw.d9OyAngnNLlGYDTXmlPSDlo9C8I5g82',
  'admin',
  TRUE,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

--password

--TRUNCATE users RESTART IDENTITY CASCADE;


*/