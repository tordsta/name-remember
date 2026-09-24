data "google_project" "this" {}

locals {
  service_name = "name-remember-web-service"
  # Cloud Run's deterministic URL, known before the service exists
  run_url     = "https://${local.service_name}-${data.google_project.this.number}.${var.region}.run.app"
  service_url = var.domain != "" ? "https://${var.domain}" : local.run_url
  image_repo  = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.repository.repository_id}"
}

# APIs used by the resources below
resource "google_project_service" "services" {
  for_each = toset([
    "artifactregistry.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "cloudscheduler.googleapis.com",
    "compute.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "run.googleapis.com",
    "servicenetworking.googleapis.com",
    "sqladmin.googleapis.com",
    "sts.googleapis.com",
  ])
  service            = each.key
  disable_on_destroy = false
}

#Cloud Run Service for web app
resource "google_service_account" "webapp" {
  account_id   = "name-remember-webapp"
  display_name = "Cloud Run runtime for the web app"
  depends_on   = [google_project_service.services]
}

resource "google_cloud_run_v2_service" "default" {
  name                = local.service_name
  location            = var.region
  deletion_protection = false
  depends_on          = [google_project_service.services]

  template {
    service_account = google_service_account.webapp.email
    scaling {
      min_instance_count = 0
      max_instance_count = 2
    }
    # Direct VPC egress reaches Cloud SQL's private IP without a connector.
    # Internet traffic (Stripe, Postmark, OAuth) leaves directly, so no NAT.
    vpc_access {
      network_interfaces {
        network    = google_compute_network.nameremember-vpc.id
        subnetwork = google_compute_subnetwork.webapp.id
      }
      egress = "PRIVATE_RANGES_ONLY"
    }
    containers {
      # Placeholder until CI deploys the app image, see lifecycle below
      image = "us-docker.pkg.dev/cloudrun/container/hello"
      env {
        name  = "DB_USER"
        value = google_sql_user.default.name
      }
      env {
        name  = "DB_PASSWORD"
        value = random_password.pwd.result
      }
      env {
        name  = "DB_HOST"
        value = google_sql_database_instance.default.private_ip_address
      }
      env {
        name  = "DB_PORT"
        value = "5432"
      }
      env {
        name  = "DB_DATABASE"
        value = google_sql_database.default.name
      }
      env {
        name  = "NEXTAUTH_URL"
        value = local.service_url
      }
      env {
        name  = "NEXT_AUTH"
        value = random_password.nextauth_secret.result
      }
      env {
        name  = "CRON_SECRET"
        value = random_password.cron_secret.result
      }
      env {
        name  = "GITHUB_ID"
        value = var.GITHUB_ID
      }
      env {
        name  = "GITHUB_SECRET"
        value = var.GITHUB_SECRET
      }
      env {
        name  = "GOOGLE_ID"
        value = var.GOOGLE_ID
      }
      env {
        name  = "GOOGLE_SECRET"
        value = var.GOOGLE_SECRET
      }
      env {
        name  = "FACEBOOK_ID"
        value = var.FACEBOOK_ID
      }
      env {
        name  = "FACEBOOK_SECRET"
        value = var.FACEBOOK_SECRET
      }
      env {
        name  = "NEXT_PUBLIC_SLACK_ID"
        value = var.NEXT_PUBLIC_SLACK_ID
      }
      env {
        name  = "SLACK_SECRET"
        value = var.SLACK_SECRET
      }
      env {
        name  = "POSTMARK_API_KEY"
        value = var.POSTMARK_API_KEY
      }
      env {
        name  = "ADMIN_EMAIL"
        value = var.ADMIN_EMAIL
      }
      env {
        name  = "STRIPE_SECRET_KEY"
        value = var.STRIPE_SECRET_KEY
      }
      env {
        name  = "STRIPE_WEBHOOK_SECRET"
        value = var.STRIPE_WEBHOOK_SECRET
      }
      env {
        name  = "STRIPE_PREMIUM_PRODUCT_ID"
        value = var.STRIPE_PREMIUM_PRODUCT_ID
      }
    }
  }

  lifecycle {
    # GitHub Actions deploys new images and labels them; don't roll that back
    ignore_changes = [
      template[0].containers[0].image,
      template[0].labels,
      labels,
      client,
      client_version,
    ]
  }
}

resource "random_password" "nextauth_secret" {
  length  = 32
  special = false
}

# Shared secret between Cloud Scheduler and /api/cron/hourly-mail-sender
resource "random_password" "cron_secret" {
  length  = 32
  special = false
}

# Make Cloud Run Service (web app) public
resource "google_cloud_run_v2_service_iam_member" "public" {
  name     = google_cloud_run_v2_service.default.name
  location = google_cloud_run_v2_service.default.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Optional custom domain (set var.domain)
resource "google_cloud_run_domain_mapping" "domain" {
  count    = var.domain == "" ? 0 : 1
  location = var.region
  name     = var.domain

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.default.name
  }
}

# Container registry for web app
resource "google_artifact_registry_repository" "repository" {
  repository_id = "webapp-name-remember"
  format        = "DOCKER"
  location      = var.region
  depends_on    = [google_project_service.services]
}

# GitHub Actions authenticates through Workload Identity Federation (no keys)
resource "random_id" "pool_suffix" {
  byte_length = 3
}

resource "google_iam_workload_identity_pool" "github" {
  # Deleted pool IDs stay reserved for 30 days, hence the suffix
  workload_identity_pool_id = "github-${random_id.pool_suffix.hex}"
  display_name              = "GitHub Actions"
  depends_on                = [google_project_service.services]
}

resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-actions"
  display_name                       = "GitHub Actions OIDC"
  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
  }
  # Only tokens issued to this repository are accepted
  attribute_condition = "assertion.repository == '${var.github_repo}'"
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account" "github_deployer" {
  account_id   = "github-deployer"
  display_name = "GitHub Actions: build and deploy the web app"
  depends_on   = [google_project_service.services]
}

resource "google_service_account_iam_member" "github_deployer_wif" {
  service_account_id = google_service_account.github_deployer.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repo}"
}

resource "google_artifact_registry_repository_iam_member" "github_deployer_push" {
  location   = google_artifact_registry_repository.repository.location
  repository = google_artifact_registry_repository.repository.name
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${google_service_account.github_deployer.email}"
}

resource "google_cloud_run_v2_service_iam_member" "github_deployer_deploy" {
  name     = google_cloud_run_v2_service.default.name
  location = google_cloud_run_v2_service.default.location
  role     = "roles/run.developer"
  member   = "serviceAccount:${google_service_account.github_deployer.email}"
}

# Deploying a revision that runs as the webapp service account
resource "google_service_account_iam_member" "github_deployer_act_as_webapp" {
  service_account_id = google_service_account.webapp.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.github_deployer.email}"
}

resource "google_cloud_scheduler_job" "send_out_reminders" {
  name             = "send-out-reminders"
  description      = "Send out reminder emails to users via Postmark"
  schedule         = "0 * * * *"
  time_zone        = "Europe/Oslo"
  region           = var.region
  attempt_deadline = "320s"
  depends_on       = [google_project_service.services]

  retry_config {
    retry_count = 1
  }

  http_target {
    http_method = "POST"
    uri         = "${local.service_url}/api/cron/hourly-mail-sender"
    body        = base64encode("")
    headers = {
      "Content-Type"  = "application/json"
      "Authorization" = "Bearer ${random_password.cron_secret.result}"
    }
  }
}



# Cloud SQL Database Service
resource "google_sql_database_instance" "default" {
  name                = "name-remember-db"
  database_version    = "POSTGRES_16"
  region              = var.region
  deletion_protection = false
  depends_on          = [google_service_networking_connection.default]

  settings {
    # Shared-core tiers need the Enterprise edition (PG16+ defaults to Enterprise Plus)
    edition = "ENTERPRISE"
    tier    = "db-f1-micro"

    ip_configuration {
      # Public IP only serves the Cloud SQL Auth Proxy (IAM auth, no authorized networks)
      ipv4_enabled    = true
      ssl_mode        = "ALLOW_UNENCRYPTED_AND_ENCRYPTED"
      private_network = google_compute_network.nameremember-vpc.id
    }

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = false
      backup_retention_settings {
        retained_backups = 7
      }
    }

    database_flags {
      name  = "cloudsql.enable_pgaudit"
      value = "off"
    }
    insights_config {
      query_insights_enabled = true
    }
  }
}

# Cloud SQL Database
resource "google_sql_database" "default" {
  name     = "userdata"
  instance = google_sql_database_instance.default.name
}

# Set up user for Cloud SQL Database
resource "random_password" "pwd" {
  length  = 16
  special = false
}
resource "local_file" "sql_database_password" {
  content  = random_password.pwd.result
  filename = "${path.module}/sql_database_password.json"
}
resource "google_sql_user" "default" {
  name     = "postgres"
  instance = google_sql_database_instance.default.name
  password = random_password.pwd.result
}


# VPC Networking
resource "google_compute_network" "nameremember-vpc" {
  name                    = "nameremember-vpc"
  auto_create_subnetworks = "false"
  depends_on              = [google_project_service.services]
}
resource "google_compute_subnetwork" "webapp" {
  name          = "webapp-subnet"
  network       = google_compute_network.nameremember-vpc.id
  region        = var.region
  ip_cidr_range = "10.10.0.0/24"
}
resource "google_compute_global_address" "internal_ip_address" {
  name          = "internal-ip-address"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.nameremember-vpc.id
}
resource "google_service_networking_connection" "default" {
  network                 = google_compute_network.nameremember-vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.internal_ip_address.name]
}
resource "google_compute_network_peering_routes_config" "peering_routes" {
  peering              = google_service_networking_connection.default.peering
  network              = google_compute_network.nameremember-vpc.name
  import_custom_routes = true
  export_custom_routes = true
}
