#!/bin/bash

# Update the package list and upgrade the system
sudo apt update
sudo apt upgrade -y

# Access to copy user.csv
sudo chmod 747 /opt

# Install PostgreSQL
sudo apt install unzip postgresql postgresql-contrib -y

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Node.js and npm
sudo apt install nodejs npm -y

# Verify Node.js and npm installation
node -v
npm -v

# Create a PostgreSQL user and database
sudo -u postgres psql -c "CREATE DATABASE ${} OWNER postgres;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"

# Restart PostgreSQL to apply the changes
sudo systemctl restart postgresql
