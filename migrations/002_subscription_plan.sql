CREATE TYPE subscription_types AS ENUM ('free', 'basic', 'standard', 'premium', 'professional');

ALTER TABLE users ADD COLUMN subscription_plan subscription_types NOT NULL DEFAULT 'free';

