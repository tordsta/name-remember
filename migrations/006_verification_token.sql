DROP TABLE IF EXISTS verification_tokens;
CREATE TABLE IF NOT EXISTS verification_tokens (
    email VARCHAR(255) NOT NULL REFERENCES users (email) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    consumed_at TIMESTAMP WITH TIME ZONE,
    constraint verification_tokens_pkey PRIMARY KEY (email, token)
);