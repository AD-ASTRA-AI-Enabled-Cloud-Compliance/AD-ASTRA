// ✅ FULL AWS PCI-DSS Terraform Baseline (Refactored with variables)

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  required_version = ">= 1.1.0"
}

provider "aws" {
  region = var.aws_region
}

###########################
# DATA PROTECTION
###########################
resource "aws_kms_key" "default" {
  description         = "KMS for default encryption"
  enable_key_rotation = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "pci_s3" {
  bucket = var.s3_bucket_name
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.default.arn
    }
  }
}

resource "aws_ebs_encryption_by_default" "ebs_encryption" {
  enabled = true
}

resource "aws_db_instance" "rds_encrypted" {
  identifier             = var.db_identifier
  engine                 = var.db_engine
  instance_class         = var.db_instance_class
  allocated_storage      = var.db_allocated_storage
  storage_encrypted      = true
  kms_key_id             = aws_kms_key.default.arn
  skip_final_snapshot    = true
}

resource "aws_lb_listener" "elb_tls" {
  load_balancer_arn = var.elb_arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = var.ssl_policy
  certificate_arn   = var.certificate_arn

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "PCI HTTPS"
      status_code  = "200"
    }
  }
}

###########################
# IDENTITY & ACCESS MGMT
###########################
resource "aws_iam_policy" "least_privilege" {
  name = "LeastPrivilege"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Action = ["s3:GetObject"],
      Resource = "*"
    }]
  })
}

resource "aws_iam_account_password_policy" "strict_policy" {
  minimum_password_length        = 14
  require_lowercase_characters  = true
  require_numbers                = true
  require_symbols                = true
  require_uppercase_characters  = true
  allow_users_to_change_password = true
}

###########################
# NETWORK SECURITY
###########################
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
}

resource "aws_security_group" "https_only" {
  name        = "https-only"
  description = "Only allow HTTPS"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_network_acl" "pci_acl" {
  vpc_id = aws_vpc.main.id
  egress {
    protocol   = "tcp"
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 443
    to_port    = 443
  }
}

###########################
# MONITORING & AUDIT
###########################
resource "aws_cloudtrail" "audit" {
  name                          = "pci-audit-trail"
  s3_bucket_name                = var.audit_s3_bucket
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_log_file_validation    = true
}

resource "aws_config_configuration_recorder" "recorder" {
  name     = "config-recorder"
  role_arn = var.config_role_arn
}

resource "aws_config_delivery_channel" "channel" {
  name           = "config-channel"
  s3_bucket_name = var.config_s3_bucket
}

resource "aws_guardduty_detector" "main" {
  enable = true
}

resource "aws_securityhub_account" "main" {}

###########################
# VULNERABILITY MANAGEMENT
###########################
resource "aws_inspector2_enabler" "default" {
  account_ids     = ["self"]
  resource_types  = ["EC2", "ECR", "LAMBDA"]
}

###########################
# INCIDENT RESPONSE
###########################
resource "aws_sns_topic" "alerts" {
  name = var.sns_topic_name
}

###########################
# DISASTER RECOVERY
###########################
resource "aws_backup_vault" "vault" {
  name = var.backup_vault_name
}

resource "aws_backup_plan" "plan" {
  name = var.backup_plan_name

  rule {
    rule_name         = "daily-backup"
    target_vault_name = aws_backup_vault.vault.name
    schedule          = var.backup_schedule
    lifecycle {
      delete_after = var.backup_retention_days
    }
  }
}

###########################
# SYSTEM CONFIGURATION
###########################
resource "aws_config_config_rule" "no_default_passwords" {
  name = "no-default-passwords"
  source {
    owner             = "AWS"
    source_identifier = "IAM_PASSWORD_POLICY"
  }
}


###########################
# LOGGING RETENTION
###########################
resource "aws_cloudwatch_log_group" "compliance_logs" {
  name              = "/pci/compliance"
  retention_in_days = var.log_retention_days
}

###########################
# MFA ENFORCEMENT (IAM)
###########################
resource "aws_iam_account_summary" "mfa_summary" {}

resource "aws_config_config_rule" "mfa_enabled" {
  name = "mfa-enabled"
  source {
    owner             = "AWS"
    source_identifier = "MFA_ENABLED_FOR_IAM_CONSOLE_ACCESS"
  }
}

###########################
# LOGGING RETENTION
###########################
resource "aws_cloudwatch_log_group" "compliance_logs" {
  name              = "/pci/compliance"
  retention_in_days = var.log_retention_days
}

###########################
# MFA ENFORCEMENT (IAM)
###########################
resource "aws_config_config_rule" "mfa_enabled" {
  name = "mfa-enabled"
  source {
    owner             = "AWS"
    source_identifier = "MFA_ENABLED_FOR_IAM_CONSOLE_ACCESS"
  }
}