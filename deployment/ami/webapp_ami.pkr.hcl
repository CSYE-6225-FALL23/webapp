packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_access_key" {
  type    = string
}

variable "aws_secret_access_key" {
  type    = string
}

variable "ami_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}

variable "ami_prefix" {
  type    = string
  default = "webapp-ami"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "subnet_id" {
  type    = string
  default = "subnet-0fe40f73f2d843daa"
}

source "amazon-ebs" "webapp-ami" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_access_key

  region          = var.ami_region
  ami_name        = "${var.ami_prefix}-${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "CSYE 6225 Webapp AMI"

  ami_regions = [
    "us-east-1",
  ]

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  instance_type = "t2.micro"
  source_ami    = var.source_ami
  ssh_username  = var.ssh_username
  ami_users     = ["273429938290"]

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = [
    "source.amazon-ebs.webapp-ami"
  ]
  provisioner "shell" {
    script = "./ami_init.sh"
  }
  provisioner "file" {
    source      = "../../webapp.zip"
    destination = "/home/admin/webapp.zip"
  }
}
