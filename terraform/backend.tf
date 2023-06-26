terraform {
backend "s3" {
bucket     = "<YOUR-S3-BACKEND-BUCKET>"
key        = "<S3-KEY-PATH>/terraform.tfstate"
region     = var.region
access_key = var.access_key
secret_key = var.secret_key
}
}