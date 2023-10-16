# Cloud SQL Database
resource "google_sql_database" "test" {
  name     = "testdata"
  instance = google_sql_database_instance.default.name
}

# Set up user for Cloud SQL Database
resource "random_password" "test_pwd" {
  length  = 16
  special = false
}
resource "local_file" "test_sql_database_password" {
  content  = random_password.test_pwd.result
  filename = "${path.module}/test_sql_database_password.json"
}
resource "google_sql_user" "test_default" {
  name     = "test_postgres"
  instance = google_sql_database_instance.default.name
  password = random_password.test_pwd.result
}
