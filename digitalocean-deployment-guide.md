# Digital Ocean Deployment Guide

This guide covers the step-by-step process for deploying your application on Digital Ocean droplets. It includes configuration for NGINX, Git, Node.js, and optional configurations for Docker and process management.

## Initial Server Setup

### Connect to Your Droplet

```bash
ssh root@your_droplet_ip
```

### Update the System

```bash
sudo apt update && sudo apt upgrade -y
```

## Installing and Configuring NGINX

### Install NGINX

```bash
sudo apt install nginx -y
```

### Start and Enable NGINX

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Verify the Installation

```bash
sudo systemctl status nginx
```

You can also open your web browser and navigate to:

```
http://your_droplet_ip
```

### Configure Firewall for NGINX

```bash
sudo apt install ufw -y
sudo ufw allow 'Nginx Full'
```

### Test and Reload NGINX Configuration

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Setting Up Git

### Install Git

```bash
sudo apt install git -y
git --version
```

### Configure Git

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Clone Your Repository

```bash
cd /home/ubuntu
git clone https://github.com/username/repository.git
```

## Node.js Environment Setup

### Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

### Verify Node.js Installation

```bash
node -v
npm -v
```

### Install PNPM

```bash
npm install -g pnpm
pnpm -v
```

## Network Configuration

### Install Net Tools

```bash
sudo apt install net-tools -y
netstat --version
```

### Configure Firewall for Your Application

```bash
sudo ufw allow ssh  # or sudo ufw allow 22/tcp
sudo ufw allow 3000/tcp  # Adjust port as needed for your application
sudo ufw reload
sudo ufw enable
sudo ufw status
```

## Process Management with PM2

### Install PM2

```bash
sudo npm install -g pm2
```

### Set Up PM2 to Start on Boot (Optional)

```bash
pm2 startup systemd
pm2 save
```

### Start Your Application with PM2

```bash
pm2 start "pnpm dev" --name your-app-name
```

### Basic PM2 Commands

```bash
# Restart application
pm2 restart your-app-name

# Stop application
pm2 stop your-app-name

# Delete application from PM2
pm2 delete your-app-name

# View running applications
pm2 list

# Monitor application
pm2 monit
```

## Docker Setup (Optional)

### Install Docker

```bash
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
```

### Install Docker Compose

```bash
sudo apt install docker-compose -y
```

### Deploy with Docker Compose

```bash
# Navigate to your project directory
cd /path/to/your/project

# Create or modify docker-compose.yml file
# Run your containers
docker-compose up --build -d

# Stop and remove containers
docker-compose down
```

### Deploy with Docker Directly

```bash
# Build your Docker image
docker build -t image_name .

# Run your container
docker run -d --name container_name -p host_port:container_port image_name

# Stop and remove container
docker stop container_name
docker rm container_name
```

## Specific Application Example

For a specific application like `bridge-agent-example`:

```bash
cd /home/ubuntu/brain-examples/apps/bridge-agent-example

# Start with PM2
pm2 start "pnpm dev" --name bridge-agent-example

# Manage the application
pm2 restart bridge-agent-example
pm2 stop bridge-agent-example
pm2 delete bridge-agent-example
```

## SSL Configuration (Optional)

### Install Certbot for Let's Encrypt SSL

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Obtain SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Troubleshooting

### Check NGINX Logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Check Application Logs with PM2

```bash
pm2 logs your-app-name
```

### Check System Resources

```bash
htop  # Install with: sudo apt install htop
```

## Backup and Restore

### Create Database Backup (if applicable)

```bash
# For MongoDB
mongodump --out=/path/to/backup/folder

# For PostgreSQL
pg_dump -U username database_name > backup.sql

# For MySQL/MariaDB
mysqldump -u username -p database_name > backup.sql
```

---

This README provides a comprehensive guide to deploying applications on Digital Ocean. Adjust the commands and configurations according to your specific application requirements.
