provider "google" {
  project     = "name-remember-23"
  region      = "us-central1"
}

# Cloud SQL Database
resource "google_sql_database_instance" "default" {
  name             = "name-remember-db"
  database_version = "POSTGRES_13"
  region           = "us-central1"

  settings {
    tier = "db-f1-micro"

    ip_configuration {
      ipv4_enabled    = true
      require_ssl     = true
    }

    database_flags {
      name  = "cloudsql.enable_pgaudit"
      value = "off"
    }
  }
}

# Cloud Run Service
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

resource "google_cloud_run_service_iam_member" "public" {
  service  = google_cloud_run_service.default.name
  location = google_cloud_run_service.default.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}