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

# Create the user
sudo useradd -m $APP_USER
sudo groupadd $APP_GROUP

# Change user password
echo "$APP_USER:$APP_USER_PASSWORD" | sudo chpasswd

# Add the user to the group
sudo usermod -aG $APP_GROUP $APP_USER