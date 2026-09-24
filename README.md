# name-remember

Web App for remembering names from face images.

Next.js (pages router) app in `next-client/`, Postgres, and Terraform for GCP (Cloud Run, Cloud SQL, Cloud Scheduler) at the repo root.

## Integrations and mocks

Third-party integrations run **mocked** when their key is not set, so the app works end to end without any accounts (see `next-client/src/lib/integrations.ts`). The server logs `[mock] …` at startup and on every mocked call.

| Integration | Key | When mocked |
|---|---|---|
| Postmark email | `POSTMARK_API_KEY` | Emails are logged, including links (e.g. email verification) |
| Stripe | `STRIPE_SECRET_KEY` | Fake Premium product; subscribe/cancel take effect immediately |
| Slack | `NEXT_PUBLIC_SLACK_ID` | "Demo Workspace" with sample channels and members |
| Analytics (GTM, Amplitude) | `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID`, `NEXT_PUBLIC_AMPLITUDE_API_KEY` | No-op |

OAuth sign-in providers (Google, GitHub, Facebook, Slack) are only shown when configured. Email/password sign-in always works.

## Dev setup

Requirements: Docker, [nvm](https://github.com/nvm-sh/nvm), `brew install libpq` (for `psql`).

```sh
docker compose up -d
DATABASE_URL=postgres://postgres:postgres@localhost:5432/userdata ./scripts/migrate.sh

cd next-client
nvm use && corepack enable && yarn install --frozen-lockfile
cp .env.example .env.local   # then set NEXT_AUTH and CRON_SECRET (openssl rand -base64 32)
yarn dev
```

Sign up with email at http://localhost:3000; the verification link is printed in the `yarn dev` output.

`scripts/migrate.sh` applies every migration in order and is meant for an empty database.

### Stripe test mode (optional)

Set test-mode keys in `.env.local`, create a "Premium" product with USD/EUR/NOK prices and set `STRIPE_PREMIUM_PRODUCT_ID`. Forward webhooks with:

```sh
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Production image

```sh
docker build -t name-remember:local next-client
docker run --env-file next-client/.env.local -e DB_HOST=host.docker.internal -p 3000:3000 name-remember:local
```

## Deploy to GCP

Requirements: `gcloud`, `terraform` (hashicorp/tap), `cloud-sql-proxy`.

1. Create a project and link billing, then enable the APIs Terraform needs to start and create the state bucket:
   ```sh
   gcloud auth login && gcloud auth application-default login
   gcloud projects create <project-id>
   gcloud billing projects link <project-id> --billing-account=<billing-account-id>
   gcloud services enable cloudresourcemanager.googleapis.com serviceusage.googleapis.com --project <project-id>
   gcloud storage buckets create gs://<project-id>-tfstate --location=us-central1 --project <project-id>
   ```
2. `cp secret.auto.tfvars.example secret.auto.tfvars` and set `project_id` (plus any integration keys).
3. Provision everything. Cloud Run starts on a placeholder image; CI deploys the app.
   ```sh
   terraform init -backend-config="bucket=<project-id>-tfstate"
   terraform apply
   ```
4. Give the deploy workflow its settings:
   ```sh
   terraform output -json github_variables | jq -r 'to_entries[] | "\(.key) \(.value)"' |
     while read -r key value; do gh variable set "$key" --body "$value"; done
   ```
   Optionally also set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_SLACK_ID` repo variables.
5. Apply migrations through the Cloud SQL Auth Proxy:
   ```sh
   cloud-sql-proxy "$(terraform output -raw sql_connection_name)" --port 5433 &
   DATABASE_URL="postgres://postgres:$(cat sql_database_password.json)@localhost:5433/userdata" ./scripts/migrate.sh
   ```
6. Push to `main` (or run the "Build and deploy to Cloud Run" workflow). The app is served at `terraform output service_url`.

Callback URLs for real integrations, relative to the service URL:

- OAuth: `/api/auth/callback/<provider>`
- Stripe webhook: `/api/stripe/webhook` (events `customer.subscription.created`, `.updated`, `.deleted`)
- Slack app redirect URLs: `/api/auth/callback/slack`, `/slack-app`, `/dashboard` (user scopes `channels:read,groups:read,users.profile:read`)

### Teardown

```sh
terraform destroy
```
