#!/bin/bash

APP_USER=csye6225
APP_USER_PASSWORD=csye6225
APP_GROUP=csye6225
APP_DIR="/var/www/webapp"

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

# Create the destination directory and copy files
sudo mkdir -p /var/www/
sudo cp -rf /home/admin/webapp.zip /var/www/
sudo unzip -o /var/www/webapp.zip -d $APP_DIR

# Copy systemd file
sudo cp $APP_DIR/deployment/webapp.service /lib/systemd/system

# Copy config and start cloudwatch agent
sudo cp -f $APP_DIR/deployment/config.json /opt/aws/amazon-cloudwatch-agent/bin/config.json

# Create the user
sudo useradd -m $APP_USER
sudo groupadd $APP_GROUP

# Change user password
echo "$APP_USER:$APP_USER_PASSWORD" | sudo chpasswd

# Add the user to the group
sudo usermod -aG $APP_GROUP $APP_USER

# Change directory owner and permissions
sudo chown -R $APP_USER:$APP_GROUP $APP_DIR
sudo find $APP_DIR -type d -exec chmod 750 {} \\;
sudo find $APP_DIR -type f -exec chmod 640 {} \\;
sudo chmod 650 $APP_DIR/server/index.js

# Permission for systemd file
sudo chown $APP_USER:$APP_GROUP /lib/systemd/system/webapp.service
sudo chmod 550 /lib/systemd/system/webapp.service

# Permission for log file
sudo touch /var/log/webapp.log
sudo chown $APP_USER:$APP_GROUP /var/log/webapp.log
sudo chmod 660 /var/log/webapp.log

# Start systemd service
sudo systemctl daemon-reload
sudo systemctl enable webapp.service
sudo systemctl start webapp.service