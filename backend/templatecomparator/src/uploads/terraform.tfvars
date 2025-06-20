
# Networking
vpc_cidr         = "10.0.0.0/16"
subnet_cidr      = "10.0.1.0/24"

# TLS & Security
ssl_policy       = "ELBSecurityPolicy-TLS-1-2-Ext-2018-06"
certificate_arn  = "arn:aws:acm:us-east-1:123456789012:certificate/abcde-12345"
elb_arn          = "arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-load-balancer"

# Logging
audit_s3_bucket  = "my-audit-logs-bucket"

# Tags or metadata
project_name     = "pci-project"
environment      = "production"
