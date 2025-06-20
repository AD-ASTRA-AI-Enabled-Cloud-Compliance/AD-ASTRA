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
resource "aws_lb_listener" "elb_tls" {
  load_balancer_arn = '${var.elb_arn}'
  port = 443
  protocol = 'HTTPS'
  ssl_policy = '${var.ssl_policy}'
  certificate_arn = '${var.certificate_arn}'
  default_action = [{'type': 'fixed-response', 'fixed_response': [{'content_type': 'text/plain', 'message_body': 'PCI HTTPS', 'status_code': '200'}]}]
}

resource "aws_iam_policy" "least_privilege" {
  name = 'LeastPrivilege'
  policy = '${jsonencode({"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": ["s3:GetObject"], "Resource": "*"}]})}'
}

