terraform {
  required_version = ">= 1.6"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 8.4"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.9"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
  }

  # State lives in a GCS bucket so it survives this machine. Pass the bucket at
  # init: terraform init -backend-config="bucket=<project-id>-tfstate"
  backend "gcs" {
    prefix = "name-remember"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
