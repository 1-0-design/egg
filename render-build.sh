#!/usr/bin/env bash
# Build script for Render

# Exit on error
set -o errexit

# Install dependencies
yarn install

# Output important information for debugging
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Create start script that will be run by Render
cat > start.sh << 'EOL'
#!/usr/bin/env bash
echo "Starting app with: node server.js"
exec node server.js
EOL

# Make it executable
chmod +x start.sh