ALTER TABLE users ADD COLUMN cookie_consent TEXT;
ALTER TABLE users ADD COLUMN cookie_consent_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN terms_and_conditions_consent boolean NOT NULL DEFAULT false;