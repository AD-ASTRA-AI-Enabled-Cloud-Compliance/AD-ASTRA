resource "aws_s3_bucket_server_side_encryption_configuration" "pci_s3" {
  bucket = '${var.s3_bucket_name}'
  rule = [{'apply_server_side_encryption_by_default': [{'sse_algorithm': 'aws:kms', 'kms_master_key_id': '${aws_kms_key.default.arn}'}]}]
}

resource "aws_vpc" "main" {
  cidr_block = '${var.vpc_cidr}'
}

