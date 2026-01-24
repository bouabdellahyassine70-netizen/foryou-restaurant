#!/bin/bash
# Quick Redis installation script for macOS

echo "Installing Redis..."

# Check if Homebrew is available
if command -v brew &> /dev/null; then
    echo "Using Homebrew to install Redis..."
    brew install redis
    brew services start redis
    echo "✅ Redis installed and started via Homebrew"
    redis-cli ping
    exit 0
fi

# Alternative: Download and compile Redis
echo "Homebrew not found. Downloading Redis source..."
cd /tmp
curl -L https://download.redis.io/releases/redis-7.2.4.tar.gz -o redis.tar.gz
tar xzf redis.tar.gz
cd redis-7.2.4
make
sudo make install

# Start Redis
echo "Starting Redis..."
redis-server --daemonize yes

# Test connection
sleep 2
redis-cli ping

echo "✅ Redis should now be running on port 6379"
echo "To start Redis manually in the future, run: redis-server"
