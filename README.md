# DB Health Status Check

A healthz API to check Postgres database health status

## Table of Contents

- [Healthz App](#db-health-status-check)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Configuration](#configuration)
  - [Usage](#usage)
  - [Development](#development)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [License](#license)

## Prerequisites

- Node.js 18.x or higher
- Docker 20.x or higher
- Git

## Getting Started

To get started with Node.js healthz API, follow these steps on bash:

### Installation

```bash
# Clone the repository
git clone https://github.com/CSYE-6225-FALL23/webapp.git
cd webapp

# Install DB dependencies
cd ./database
npm install

# Install server dependencies
cd ./server
npm install
```

### Configuration
Create a .env file in ./server and configure the following environment variables:
```env
SERVER_PORT=8000
```

Create a .env file in ./server and ./database and configure the following environment variables:
```env
POSTGRES_DB='postgres'
POSTGRES_USER='postgres'
POSTGRES_PASSWORD='postgres'
POSTGRES_URI='localhost'
FILEPATH='../deployment/user.csv'
```

## Usage
- Start the development server using the command in ./server dir: 
  ```bash
  npm start
  ```
- Access the API at http://localhost:8000

## Testing
To run tests, use the following command inside a package:
```bash
npm test
```
## Deployment
- Installing prerequisites (latest versions) to deploy on Debian 12 EC2 instance
  ```
  sudo apt-get update
  sudo apt-get install postgresql nodejs npm -y
  ```

- Start postgres and change the password
  ```
  sudo service postgresql start
  sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
  sudo -u postgres psql -c "CREATE DATABASE csye6225;"
  ```

- Change folder permissions required for next step
  ```
  sudo chmod 747 /opt
  ```

- After installing, copy the application files and user.csv onto the machine
  - application - /home/admin/webapp
  - user.csv - /opt/user.csv

- Install dependencies
  ```
  cd /home/admin/webapp/
  cd ./database; npm i
  cd ../server; npm i
  ```

- Change the 'FILEPATH' variable in .env to point to /opt/user.csv
  ```
  FILEPATH='../deployment/user.csv'
  ```

- Start the server
  ```
  cd ./server
  npm start
  ```
## License
This project is licensed under the MIT License. See the [LICENSE](.\LICENSE) file for details.