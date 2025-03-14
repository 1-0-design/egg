# Egg Browser UI

A browser-based UI implementation for the Egg project.

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open your browser and visit: http://localhost:3000

## Deployment on Render

This project is configured to deploy on Render.com:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Plan**: Free

Alternatively, you can use the Render Dashboard to deploy directly from GitHub:

1. Go to the Render Dashboard
2. Click "New +"
3. Select "Web Service"
4. Connect your GitHub repository
5. Render will automatically detect the configuration and deploy the app

## Project Structure

- `server.js`: Express server to serve the application
- `browser.html`: Main HTML file that loads the UI
- `src/styles/egg/`: CSS files for the UI components
- `src/components/`: React component files
- `src/icons/`: Icon components

## Features

- Expandable bottom sheet UI
- Weather and music egg components
- Message thread with different message types
- Drag and click interactions for the bottom sheet