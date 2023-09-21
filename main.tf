provider "google" {
  project     = "name-remember-23"
  region      = "us-central1"
}

# Cloud Run Service for web app
resource "google_cloud_run_service" "default" {
  name     = "name-remember-service"
  location = "us-central1"
  
  template {
    spec {
      containers {
        image = "${google_artifact_registry_repository.repository.location}-docker.pkg.dev/name-remember-23/${google_artifact_registry_repository.repository.name}/name-remember:latest"
        env {
          name="DB_USER"
          value="postgres"
        }
        env {
          name="DB_PASSWORD"
          value=random_password.pwd.result
        }
        env {
          name="DB_HOST"
          value=google_sql_database_instance.default.public_ip_address
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
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Make Cloud Run Service (web app) public
resource "google_cloud_run_service_iam_member" "public" {
  service  = google_cloud_run_service.default.name
  location = google_cloud_run_service.default.location
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
    route_name = google_cloud_run_service.default.name
  }
}
resource "google_cloud_run_domain_mapping" "www_domain" {
  location    = "us-central1"
  name        = "www.nameremember.com" 

  metadata {
    namespace = "name-remember-23"
  }

  spec {
    route_name = google_cloud_run_service.default.name
  }
}

# Container registry for web app
resource "google_artifact_registry_repository" "repository" {
  repository_id = "webapp-name-remember"
  format        = "DOCKER"
  location      = "us-central1"
}


# Set up Service account for Github Actions to access Container Registry
module "workload-identity-federation-multi-provider" {
  source  = "SudharsaneSivamany/workload-identity-federation-multi-provider/google"
  version = "1.1.0"
  project_id = "name-remember-23"
  pool_id = "github-actions-pool"
  wif_providers = [{ 
    provider_id = "github-actions"
    select_provider = "oidc"
    provider_config = {
      issuer_uri = "https://token.actions.githubusercontent.com"
      allowed_audiences = "https://iam.googleapis.com/projects/471648801973/locations/global/workloadIdentityPools/github-actions-pool/providers/github-actions" 
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
      roles          = ["roles/storage.admin", "roles/artifactregistry.admin", "roles/run.admin"]
    }
  ]
}




# Cloud SQL Database Service
resource "google_sql_database_instance" "default" {
  name             = "name-remember-db"
  database_version = "POSTGRES_13"
  region           = "us-central1"
  deletion_protection = false #change to true when in production

  settings {
    tier = "db-f1-micro"

    ip_configuration {
      ipv4_enabled    = true
      require_ssl     = true
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