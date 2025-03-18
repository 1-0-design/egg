#!/bin/bash

# Source NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

# Navigate to the project directory
cd "$(dirname "$0")"

case "$1" in
  start)
    echo "Starting development server..."
    npm start
    ;;
  build)
    echo "Building for production..."
    npm run build
    ;;
  serve)
    echo "Running production server..."
    node server.js
    ;;
  *)
    echo "Egg UI Helper Script"
    echo "Usage: $0 {start|build|serve}"
    echo ""
    echo "  start  - Start the development server"
    echo "  build  - Build the app for production"
    echo "  serve  - Run the production server after building"
    exit 1
esac

exit 0