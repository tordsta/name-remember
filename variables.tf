variable "project_id" {
  description = "GCP project ID"
  type        = string
}
variable "region" {
  description = "GCP region for all resources"
  type        = string
  default     = "us-central1"
}
variable "github_repo" {
  description = "GitHub repository (owner/name) allowed to deploy through Workload Identity Federation"
  type        = string
  default     = "tordsta/name-remember"
}
variable "domain" {
  description = "Custom domain mapped to Cloud Run. Empty serves the app on its run.app URL."
  type        = string
  default     = ""
}

# App secrets. Empty values leave the integration mocked or disabled, see
# next-client/src/lib/integrations.ts. NEXT_PUBLIC_* values other than the
# Slack ID are build-time only and live in GitHub repo variables instead.
variable "GITHUB_ID" {
  description = "Github OAuth ID"
  type        = string
  default     = ""
  sensitive   = true
}
variable "GITHUB_SECRET" {
  description = "Github OAuth Secret"
  type        = string
  default     = ""
  sensitive   = true
}
variable "GOOGLE_ID" {
  description = "Google OAuth ID"
  type        = string
  default     = ""
  sensitive   = true
}
variable "GOOGLE_SECRET" {
  description = "Google OAuth Secret"
  type        = string
  default     = ""
  sensitive   = true
}
variable "FACEBOOK_ID" {
  description = "Facebook OAuth ID"
  type        = string
  default     = ""
  sensitive   = true
}
variable "FACEBOOK_SECRET" {
  description = "Facebook OAuth Secret"
  type        = string
  default     = ""
  sensitive   = true
}
variable "NEXT_PUBLIC_SLACK_ID" {
  description = "Slack OAuth ID (also a build arg; set the same value as a GitHub repo variable)"
  type        = string
  default     = ""
}
variable "SLACK_SECRET" {
  description = "Slack OAuth Secret"
  type        = string
  default     = ""
  sensitive   = true
}
variable "POSTMARK_API_KEY" {
  description = "Postmark API Key"
  type        = string
  default     = ""
  sensitive   = true
}
variable "ADMIN_EMAIL" {
  description = "Admin Email, receives user feedback"
  type        = string
  default     = ""
}
variable "STRIPE_SECRET_KEY" {
  description = "Stripe Secret Key (use a test-mode key)"
  type        = string
  default     = ""
  sensitive   = true
}
variable "STRIPE_WEBHOOK_SECRET" {
  description = "Stripe Webhook Secret"
  type        = string
  default     = ""
  sensitive   = true
}
variable "STRIPE_PREMIUM_PRODUCT_ID" {
  description = "Stripe Premium Product ID"
  type        = string
  default     = ""
}
