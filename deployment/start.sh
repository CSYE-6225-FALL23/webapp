sudo apt-get update
sudo apt-get install postgresql
sudo apt install nodejs npm -y

sudo service postgresql start
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
sudo -u postgres psql -c "CREATE DATABASE csye6225;"

sudo chmod 747 /opt