variable "elb_arn" {
  description = "ARN of the Load Balancer"
  type        = string
}

variable "ssl_policy" {
  description = "SSL policy name for HTTPS listener"
  type        = string
  default     = "ELBSecurityPolicy-2016-08"
}

variable "certificate_arn" {
  description = "ARN of the SSL/TLS certificate"
  type        = string
}