variable "NEXT_AUTH" {
    description = "Next Auth Secret"
    type        = string
}
variable "NEXTAUTH_URL" {
    description = "Next Auth URL"
    type        = string
}

variable "GITHUB_ID" {
    description = "Github OAuth ID"
    type        = string
}
variable "GITHUB_SECRET" {
    description = "Github OAuth Secret"
    type        = string
}
variable "GOOGLE_ID" {
    description = "Google OAuth ID"
    type        = string
}
variable "GOOGLE_SECRET" {
    description = "Google OAuth Secret"
    type        = string
}
variable "FACEBOOK_ID" {
    description = "Facebook OAuth ID"
    type        = string
}
variable "FACEBOOK_SECRET" {
    description = "Facebook OAuth Secret"
    type        = string
}
variable "SLACK_ID" {
    description = "Slack OAuth ID"
    type        = string
}
variable "SLACK_SECRET" {
    description = "Slack OAuth Secret"
    type        = string
}

variable "POSTMARK_API_KEY" {
    description = "Postmark API Key"
    type        = string
}

variable "NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID" {
    description = "Google Tag Manager ID"
    type        = string
}
variable "NEXT_PUBLIC_AMPLITUDE_API_KEY" {
    description = "Amplitude API Key"
    type        = string
}