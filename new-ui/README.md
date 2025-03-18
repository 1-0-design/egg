# Egg - AI Assistant UI

This project implements a modern UI for the Egg AI Assistant platform, featuring:

- Clean, minimalist chat interface
- Expandable "egg tray" at the bottom with weather and music widgets
- Responsive design that works on desktop and mobile

## Project Structure

```
egg-ui/
├── public/            # Static files
│   └── assets/        # Images and other media
├── src/               # Source code
│   ├── components/    # React components
│   ├── icons/         # SVG icon components
│   └── styles/        # CSS files
└── server.js          # Express server for production
```

## Available Scripts

- `npm start` - Run the development server
- `npm build` - Build for production
- `npm test` - Run tests
- `node server.js` - Start the production server

## Development

1. Install dependencies: `npm install`
2. Start the development server: `npm start`
3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment

This project is configured to deploy to Render.com. The `render.yaml` file contains the configuration needed for deployment.