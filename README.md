# name-remember

Web App for remembering names from face images.

## Dev setup

### DB connection

Run the cloud sql proxy locally to connect to the DB in GCP.

1. generate the password file for the service account with "terraform apply"
2. follow this guide https://cloud.google.com/sql/docs/postgres/connect-auth-proxy
3. ./cloud-sql-proxy --port 5432 name-remember-23:us-central1:name-remember-db
4. Connect with to Database on localhost:5432 using the name in the main.tf and the password in file.
5. Apply migrations if needed. For example: "psql "postgres://postgres:${password}@localhost:5432/userdata" -f migrations/001_init.sql"

## Terraform

### Terraform setup

1. Run terraform apply (errors on cloud run is expected due to image not being built yet)
2. Update the github action workload_identity_provider with the correct pool_id
3. Trigger the github actions to build image (deploy to cloud run will fail)
4. Run terraform apply to create final resources
5. Apply database migrations

### Terraform destroy

1. Set deletion_protection to false on resource "google_sql_database_instance" "default"
2. Run terraform destroy
