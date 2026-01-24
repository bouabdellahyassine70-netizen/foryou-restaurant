# Install PostgreSQL on macOS

## Option 1: Install Homebrew + PostgreSQL (Recommended)

### Step 1: Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the prompts. This may take a few minutes.

### Step 2: Install PostgreSQL

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify it's running
brew services list
```

You should see `postgresql@15` with status `started`.

### Step 3: Add PostgreSQL to PATH (if needed)

```bash
# Add to your shell profile
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc

# Reload shell
source ~/.zshrc

# Verify installation
psql --version
```

## Option 2: PostgreSQL.app (Easier, GUI-based)

1. Download from: https://postgresapp.com/
2. Install the .dmg file
3. Open PostgreSQL.app
4. Click "Initialize" to create a new server
5. The app will add `psql` to your PATH automatically

## Option 3: Official PostgreSQL Installer

1. Download from: https://www.postgresql.org/download/macosx/
2. Run the installer
3. Follow the installation wizard
4. Remember the password you set for the `postgres` user

## After Installation

### Verify PostgreSQL is Running

```bash
# Check if PostgreSQL is running
psql --version

# Try to connect (using your macOS username)
psql postgres
```

If it connects, you're ready! Type `\q` to exit.

### Create Database for For You Restaurant

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE foryou_restaurant;

# Exit
\q
```

Or use command line:
```bash
createdb foryou_restaurant
```

## Next Steps

After PostgreSQL is installed, follow `POSTGRESQL_SETUP.md` to configure the project.

