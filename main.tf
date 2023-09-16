provider "google" {
  project     = "name-remember-23"
  region      = "us-central1"
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

# Cloud Run Service for web app
resource "google_cloud_run_service" "default" {
  name     = "name-remember-service"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "gcr.io/name-remember-23/name-remember:latest"

        env {
          name  = "DATABASE_URL"
          value = "postgresql://USERNAME:PASSWORD@${google_sql_database_instance.default.public_ip_address}/name-remember-db"
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

