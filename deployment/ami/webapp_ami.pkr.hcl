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
  default = ""
}

variable "aws_secret_access_key" {
  type    = string
  default = ""
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

variable "zip_file_path" {
  type    = string
  default = "../../webapp.zip"
}

variable "instanceType" {
  type    = string
  default = "t2.micro"
}

variable "ami_users" {
  type    = list(string)
  default = ["273429938290"]
}

variable "ami_regions" {
  type    = list(string)
  default = ["us-east-1"]
}

variable "ebsVolumeSize" {
  type    = number
  default = 25
}

variable "ebsVolumeType" {
  type    = string
  default = "gp2"
}

variable "startupScript" {
  type    = string
  default = "./ami_init.sh"
}

variable "webappDestinationFolder" {
  type    = string
  default = "/home/admin/webapp.zip"
}

variable "postgresDB" {
  type    = string
  default = "csye6225"
}

source "amazon-ebs" "webapp-ami" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_access_key

  region          = var.ami_region
  ami_name        = "${var.ami_prefix}-${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "CSYE 6225 Webapp AMI"
  ami_regions     = var.ami_regions

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  instance_type = var.instanceType
  source_ami    = var.source_ami
  ssh_username  = var.ssh_username
  ami_users     = var.ami_users

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = var.ebsVolumeSize
    volume_type           = var.ebsVolumeType
  }
}

build {
  sources = [
    "source.amazon-ebs.webapp-ami"
  ]
  provisioner "shell" {
    environment_vars = [
      "POSTGRES_DB=${var.postgresDB}",
    ]
    script = var.startupScript
  }
  provisioner "file" {
    source      = var.zip_file_path
    destination = var.webappDestinationFolder
  }
}
