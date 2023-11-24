ALTER TABLE accounts ADD CONSTRAINT accounts_prevent_duplicate UNIQUE (user_id, provider_id, token_type);
CREATE TABLE IF NOT EXISTS slack_workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_name VARCHAR(255) NOT NULL,
    workspace_id VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL,
    enterprise BOOLEAN,
    is_enterprise_install BOOLEAN, 
    provider_id VARCHAR(255) NOT NULL, 
    provider_type VARCHAR(255) NOT NULL, 
    provider_account_id VARCHAR(255) NOT NULL, 
    refresh_token TEXT,
    access_token TEXT NOT NULL, 
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    token_type VARCHAR(255) NOT NULL, 
    scope TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT slack_workspaces_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT slack_workspaces_unique UNIQUE (workspace_id, user_id, token_type)
);
ALTER TABLE people ADD COLUMN image_url TEXT;
ALTER TABLE people ALTER COLUMN mname DROP NOT NULL;
ALTER TABLE people ALTER COLUMN lname DROP NOT NULL;
