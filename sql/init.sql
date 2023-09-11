
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  email_verified BOOLEAN DEFAULT false,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fname VARCHAR(50) NOT NULL,
  mname VARCHAR(50) NOT NULL,
  lname VARCHAR(50) NOT NULL,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS people_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  owner_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  rrule TEXT,
  rrule_start TIMESTAMP,
  reminder_trigger_time TIMESTAMP, 
  CONSTRAINT unique_owner_id_name UNIQUE (owner_id, name),
     CONSTRAINT fk_owner
      FOREIGN KEY(owner_id) 
	  REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS people_in_lists (
  people_id UUID not null,
  people_list_id UUID not null,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_people
    FOREIGN KEY(people_id) 
	  REFERENCES people(id)
    ON DELETE CASCADE
  ,
  CONSTRAINT fk_people_list
    FOREIGN KEY(people_list_id) 
	  REFERENCES people_lists(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  provider_id VARCHAR(255) NOT NULL,
  provider_type VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  token_type VARCHAR(255),
  scope TEXT,
  id_token TEXT,
  session_state TEXT
);

CREATE TABLE IF NOT EXISTS verification_tokens  (
  identifier VARCHAR(255) PRIMARY KEY,
  token TEXT NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_sessions  (
  id SERIAL PRIMARY KEY,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  session_token TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_feedback (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    file TEXT
);

CREATE OR REPLACE FUNCTION delete_person(user_email TEXT, person_id UUID)
RETURNS VOID AS $$
DECLARE
  user_id UUID;
  count INTEGER;
BEGIN
  -- Get the user id
  SELECT id INTO user_id FROM users WHERE email = user_email;

  -- Check if the user owns a list that contains the person
  SELECT COUNT(*) INTO count
  FROM people_lists pl
  JOIN people_in_lists pil ON pil.people_list_id = pl.id
  WHERE pil.people_id = person_id AND pl.owner_id = user_id;

  -- If the count is 0, the user does not have access to delete the person
  IF count = 0 THEN
    RAISE 'User does not have access to delete this person';
  END IF;

  -- Delete the person from people_in_lists and people tables
  DELETE FROM people_in_lists WHERE people_id = person_id;
  DELETE FROM people WHERE id = person_id;
END;
$$ LANGUAGE plpgsql;
