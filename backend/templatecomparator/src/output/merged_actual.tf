provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.small"

  tags = {
    Name = "WebServerV2"
    Env  = "Production"
  }
}

# --- Patch from PCI Compliance ---
resource "aws_kms_key" "default" {
  description = "KMS for default encryption"
  enable_key_rotation = true
}

resource "aws_vpc" "main" {
  cidr_block = "${var.vpc_cidr}"
}

resource "aws_cloudtrail" "audit" {
  name = "pci-audit-trail"
  s3_bucket_name = "${var.audit_s3_bucket}"
  include_global_service_events = true
  is_multi_region_trail = true
  enable_log_file_validation = true
}

resource "aws_iam_account_summary" "mfa_summary" {
}

