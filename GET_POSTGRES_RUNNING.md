# Get PostgreSQL Running

Since PostgreSQL is downloaded but not accessible, let's get it working:

## Option 1: If you downloaded PostgreSQL.app

1. **Open the app**: Go to `/Applications` and open `Postgres.app`
2. **Initialize**: If it's the first time, click "Initialize" to start the server
3. **Check PATH**: The app should automatically add `psql` to your PATH
4. **Test**: Open a new terminal and run:
   ```bash
   psql postgres
   ```

## Option 2: If you downloaded the official PostgreSQL installer

1. **Run the installer**: Double-click the downloaded `.dmg` file
2. **Complete installation**: Follow the installation wizard
3. **Remember the password**: You'll set a password for the `postgres` user
4. **Add to PATH**: After installation, add PostgreSQL to your PATH:
   ```bash
   # For Apple Silicon Macs
   echo 'export PATH="/Library/PostgreSQL/15/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   
   # Or for Intel Macs
   echo 'export PATH="/usr/local/pgsql/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

## Option 3: If you have Homebrew installed

```bash
# Install PostgreSQL via Homebrew
brew install postgresql@15

# Start the service
brew services start postgresql@15

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## After PostgreSQL is Running

Once `psql` command works, create the database:

```bash
# Create database
createdb foryou_restaurant

# Or if you need to specify user:
createdb -U postgres foryou_restaurant

# Test connection
psql foryou_restaurant -c "SELECT 1;"
```

## Then Continue Setup

After PostgreSQL is working, follow these steps:

```bash
cd /Users/ilyasmoktary/Documents/foryou-restaurant/backend

# Create .env file
cat > .env << 'EOF'
DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/foryou_restaurant?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
EOF

# Replace YOUR_USERNAME with your macOS username (run: whoami to find it)
# Or if you set a password: postgresql://postgres:YOUR_PASSWORD@localhost:5432/foryou_restaurant?schema=public

# Install and setup
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run start:dev
```

## Quick Check

Run this to see what you have:

```bash
# Check if PostgreSQL.app exists
ls -la /Applications/ | grep -i postgres

# Check if Homebrew PostgreSQL is installed
brew list | grep postgresql

# Check your username (for DATABASE_URL)
whoami
```

Let me know which method you used to download PostgreSQL, and I can help you get it running!

