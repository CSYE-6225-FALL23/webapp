#!/bin/bash

# Update the package list and upgrade the system
sudo apt update
sudo apt upgrade -y

sudo apt-get -y remove git
sudo apt-get -y autoremove

# Install Cloudwatch-Agent
wget https://amazoncloudwatch-agent.s3.amazonaws.com/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Install Node.js and npm
sudo apt install unzip nodejs npm -y

APP_DIR="/var/www/webapp"

# Create the destination directory and copy files
sudo mkdir -p /var/www/
sudo cp -rf /home/admin/webapp.zip /var/www/
sudo unzip -o /var/www/webapp.zip -d $APP_DIR

# ENV file
sudo touch /opt/.env.prod

# Copy systemd file
sudo cp $APP_DIR/deployment/webapp.service /lib/systemd/system

# Copy config and start cloudwatch agent
sudo cp -f $APP_DIR/deployment/config.json /opt/aws/amazon-cloudwatch-agent/bin/config.json