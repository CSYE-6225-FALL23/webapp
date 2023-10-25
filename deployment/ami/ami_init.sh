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