#!/bin/bash

# Update the package list and upgrade the system
sudo apt update
sudo apt upgrade -y

sudo apt-get -y remove git
sudo apt-get -y autoremove

# Install PostgreSQL
# sudo apt install unzip postgresql postgresql-contrib -y

# Install Node.js and npm
sudo apt install unzip nodejs npm -y

# Verify Node.js and npm installation
node -v
npm -v

APP_USER=csye6225
APP_USER_PASSWORD=csye6225
APP_GROUP=csye6225
APP_DIR="/var/www/webapp"

# Create the destination directory and copy files
sudo mkdir -p /var/www/
sudo cp -rf /home/admin/webapp.zip /var/www/

cd /var/www
sudo unzip -o webapp.zip -d $APP_DIR

# Create the user
sudo useradd -m $APP_USER
sudo groupadd $APP_GROUP

# Change user password
echo "$APP_USER:$APP_USER_PASSWORD" | sudo chpasswd

# Add the user to the group
sudo usermod -aG $APP_GROUP $APP_USER

# Set directory permissions
sudo chown -R $APP_USER:$APP_GROUP $APP_DIR
sudo find $APP_DIR -type d -exec chmod 750 {} \\;
sudo find $APP_DIR -type f -exec chmod 640 {} \\;
sudo chmod 650 $APP_DIR/server/index.js

# Systemd file
sudo cp $APP_DIR/deployment/webapp.service /lib/systemd/system
sudo chown $APP_USER:$APP_GROUP /lib/systemd/system/webapp.service
sudo chmod 550 /lib/systemd/system/webapp.service

systemctl daemon-reload
sudo systemctl enable webapp.service
sudo systemctl start webapp.service