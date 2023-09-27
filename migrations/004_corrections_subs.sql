DROP TABLE IF EXISTS stripe_subscription;

CREATE TABLE stripe_subscriptions(
    product_id VARCHAR(255) NOT NULL,
    subscription_id VARCHAR(255) NOT NULL,
    customer_id VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (customer_id, subscription_id, product_id),
    CONSTRAINT fk_customer_id
      FOREIGN KEY(customer_id) 
    	REFERENCES users(stripe_customer_id)
);