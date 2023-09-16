# name-remember

Web App for remembering names from face images.

## Dev setup

TODO
Make test environment in GCP & Terraform.
CI/CD pipeline to Google container registry from github actions.
Add GCP GCR to terraform.

### DB connection

Run the cloud sql proxy locally to connect to the DB in GCP.

1. generate the password file for the service account with "terraform apply"
2. follow this guide https://cloud.google.com/sql/docs/postgres/connect-auth-proxy
3. ./cloud-sql-proxy --port 5432 name-remember-23:us-central1:name-remember-db
4. Connect with to Database on localhost:5432 using the name in the main.tf and the password in file.
5. Apply migrations if needed. For example: "psql "postgres://postgres:${password}@localhost:5432/userdata" -f migrations/001_init.sql"
