provider "google" {
  project     = "name-remember-23"
  region      = "us-central1"
}

#Cloud Run Service for web app
resource "google_cloud_run_v2_service" "default" {
  name     = "name-remember-web-service"
  location = "us-central1"
  traffic {
    type = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
  template {
    scaling {
      max_instance_count = 2
    }
    vpc_access {
      connector = google_vpc_access_connector.webapp.id
      egress = "ALL_TRAFFIC"
    }
    containers {
      image = "${google_artifact_registry_repository.repository.location}-docker.pkg.dev/name-remember-23/${google_artifact_registry_repository.repository.name}/name-remember:latest"
      env {
        name="DB_USER"
        value=google_sql_user.default.name
      }
      env {
        name="DB_PASSWORD"
        value=random_password.pwd.result
      }
      env {
        name="DB_HOST"
        value=google_sql_database_instance.default.private_ip_address
      }
      env {
        name="DB_PORT"
        value="5432"
      }
      env {
        name="DB_DATABASE"
        value=google_sql_database.default.name
      }
      env {
        name = "NEXTAUTH_URL"
        value = var.NEXTAUTH_URL
      }
      env {
        name = "NEXT_AUTH"
        value = var.NEXT_AUTH
      }
      env {
        name = "GITHUB_ID"
        value = var.GITHUB_ID
      }
      env {
        name = "GITHUB_SECRET"
        value = var.GITHUB_SECRET
      }
      env {
        name = "GOOGLE_ID"
        value = var.GOOGLE_ID
      }
      env {
        name = "GOOGLE_SECRET"
        value = var.GOOGLE_SECRET
      }
      env {
        name = "FACEBOOK_ID"
        value = var.FACEBOOK_ID
      }
      env {
        name = "FACEBOOK_SECRET"
        value = var.FACEBOOK_SECRET
      }
      env {
        name = "SLACK_ID"
        value = var.SLACK_ID
      }
      env {
        name = "SLACK_SECRET"
        value = var.SLACK_SECRET
      }
      env {
        name = "POSTMARK_API_KEY"
        value = var.POSTMARK_API_KEY
      }
      env {
        name = "NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID"
        value = var.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
      }
      env {
        name = "NEXT_PUBLIC_AMPLITUDE_API_KEY"
        value = var.NEXT_PUBLIC_AMPLITUDE_API_KEY
      }
      env {
        name = "STRIPE_SECRET_KEY"
        value = var.STRIPE_SECRET_KEY
      }
      env {
        name = "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
        value = var.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      }
      env {
        name = "NEXT_PUBLIC_STRIPE_RETURN_URL"
        value = var.NEXT_PUBLIC_STRIPE_RETURN_URL
      }
      env {
        name = "STRIPE_WEBHOOK_SECRET"
        value = var.STRIPE_WEBHOOK_SECRET
      }
      env {
        name = "STRIPE_PREMIUM_PRODUCT_ID"
        value = var.STRIPE_PREMIUM_PRODUCT_ID
      }
    }
  }
}

# Make Cloud Run Service (web app) public
resource "google_cloud_run_service_iam_member" "public" {
  service  = google_cloud_run_v2_service.default.name
  location = google_cloud_run_v2_service.default.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Domains setup 
resource "google_cloud_run_domain_mapping" "apex_domain" {
  location    = "us-central1"
  name        = "nameremember.com" 

  metadata {
    namespace = "name-remember-23"
  }

  spec {
    route_name = google_cloud_run_v2_service.default.name
  }
}
resource "google_cloud_run_domain_mapping" "www_domain" {
  location    = "us-central1"
  name        = "www.nameremember.com" 

  metadata {
    namespace = "name-remember-23"
  }

  spec {
    route_name = google_cloud_run_v2_service.default.name
  }
}

# Container registry for web app
resource "google_artifact_registry_repository" "repository" {
  repository_id = "webapp-name-remember"
  format        = "DOCKER"
  location      = "us-central1"
}
resource "random_integer" "id" {
  min = 100000
  max = 999999
}

# Set up Service account for Github Actions to access Container Registry
module "workload-identity-federation-multi-provider" {
  source  = "SudharsaneSivamany/workload-identity-federation-multi-provider/google"
  version = "1.1.0"
  project_id = "name-remember-23"
  pool_id = "github-actions-pool-${random_integer.id.result}"
  wif_providers = [{ 
    provider_id = "github-actions"
    select_provider = "oidc"
    provider_config = {
      issuer_uri = "https://token.actions.githubusercontent.com"
      allowed_audiences = "https://iam.googleapis.com/projects/471648801973/locations/global/workloadIdentityPools/github-actions-pool-${random_integer.id.result}/providers/github-actions" 
    }
    disabled = false
    attribute_mapping    = {
      "attribute.actor"      = "assertion.actor"
      "attribute.repository" = "assertion.repository"
      "google.subject"       = "assertion.sub"
    } 
  }]
  service_accounts = [
    {
      name           = "ga-push-to-registry"
      attribute      = "attribute.repository/tordsta/name-remember"
      all_identities = true
      roles          = ["roles/storage.admin", "roles/artifactregistry.admin"]
    },
    {
      name           = "ga-deploy-to-cloud-run"
      attribute      = "attribute.repository/tordsta/name-remember"
      all_identities = true
      roles          = ["roles/run.admin", "roles/iam.serviceAccountUser"]
    } 
 
  ]
}

resource "google_cloud_scheduler_job" "send_out_reminders" {
  name             = "send-out-reminders"
  description      = "Send out reminder emails to users via Postmark"
  schedule         = "0 * * * *"
  time_zone        = "Europe/Oslo"
  attempt_deadline = "320s"

  retry_config {
    retry_count = 1
  }

  http_target {
    http_method = "POST"
    uri         = "https://nameremember.com/api/cron/hourlyMailSender"
    body        = base64encode("")
    headers = {
      "Content-Type" = "application/json"
    }
  }
}



# Cloud SQL Database Service
resource "google_sql_database_instance" "default" {
  name             = "name-remember-db"
  database_version = "POSTGRES_13"
  region           = "us-central1"
  deletion_protection = false
  depends_on = [google_service_networking_connection.default]


  settings {
    tier = "db-f1-micro"

    ip_configuration {
      ipv4_enabled    = true
      require_ssl     = false
      private_network = google_compute_network.nameremember-vpc.id
    }

    backup_configuration {
      enabled = true
      point_in_time_recovery_enabled = true
      backup_retention_settings {
        retained_backups = 50
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

# Set up Cloud SQL Proxy
resource "google_service_account" "sql_proxy" {
  account_id   = "sql-proxy"
  display_name = "Service Account for Cloud SQL Proxy"
}
resource "google_project_iam_member" "sql_proxy_iam" {
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.sql_proxy.email}"
  project = "name-remember-23"
}
resource "google_service_account_key" "sql_proxy_key" {
  service_account_id = google_service_account.sql_proxy.name
}


# VPC Networking
resource "google_compute_network" "nameremember-vpc" {
  name                    = "nameremember-vpc"
  auto_create_subnetworks = "false"
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
resource "google_vpc_access_connector" "webapp" {
  name               = "webapp-connector"
  network            = google_compute_network.nameremember-vpc.id
  ip_cidr_range      = "10.8.0.0/28"
  region             = "us-central1"
}  

resource "google_compute_router" "public_router" {
  name    = "public-router"
  region  = "us-central1"
  network = google_compute_network.nameremember-vpc.id

  bgp {
    asn = 64514
  }
}

resource "google_compute_router_nat" "public_cloud_nat" {
  name                               = "public-cloud-nat"
  router                             = google_compute_router.public_router.name
  region                             = google_compute_router.public_router.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}