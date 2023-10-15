ALTER TABLE people_lists DROP CONSTRAINT fk_owner, ADD CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE; 
ALTER TABLE auth_sessions DROP CONSTRAINT auth_sessions_user_id_fkey, ADD CONSTRAINT auth_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE; 
ALTER TABLE stripe_subscriptions DROP CONSTRAINT fk_customer_id, ADD CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES users(stripe_customer_id) ON DELETE CASCADE; 
ALTER TABLE accounts DROP CONSTRAINT accounts_user_id_fkey, ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE; 
ALTER TABLE people ADD COLUMN list_id UUID REFERENCES people_lists(id) ON DELETE CASCADE;
DROP TABLE IF EXISTS people_in_lists;
DROP FUNCTION IF EXISTS delete_person;

