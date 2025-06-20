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