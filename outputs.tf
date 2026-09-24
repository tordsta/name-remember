output "service_url" {
  description = "Public URL of the web app"
  value       = local.service_url
}

output "sql_connection_name" {
  description = "For cloud-sql-proxy"
  value       = google_sql_database_instance.default.connection_name
}

# Non-secret values the deploy workflow reads from GitHub repo variables:
# terraform output -json github_variables | jq -r 'to_entries[] | "\(.key)=\(.value)"'
output "github_variables" {
  value = {
    GCP_PROJECT_ID   = var.project_id
    GCP_REGION       = var.region
    GCP_SERVICE      = google_cloud_run_v2_service.default.name
    GCP_SERVICE_URL  = local.service_url
    GCP_IMAGE_REPO   = local.image_repo
    GCP_WIF_PROVIDER = google_iam_workload_identity_pool_provider.github.name
    GCP_DEPLOY_SA    = google_service_account.github_deployer.email
  }
}
