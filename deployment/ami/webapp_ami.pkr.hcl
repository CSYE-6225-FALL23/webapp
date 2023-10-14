packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "ami_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-071175b60c818694f "
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
  default = "subnet-09f3f04b72721d7eb"
}

source "amazon-ebs" "webapp-ami" {
  region          = "${var.ami_region}"
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
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  ami_users     = ["099720109477"]

  launch_block_device_mappings {
      delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 8
    volume_type           = "gp2"
  }

  source_ami_filter {
    owners = ["009"]
  }
}

build {
  sources = [
    "source.amazon-ebs.webapp-ami"
  ]
  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get upgrade",
    ]
  }
}
