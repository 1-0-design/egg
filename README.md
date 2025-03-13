# Egg - AI Assistant

An elegant AI assistant UI inspired by Vision OS, where tasks appear as "eggs" that wobble while processing and show completion status.

![Egg UI Concept](https://via.placeholder.com/800x450/ffffff/000000?text=Egg+UI+Concept)

## Features

- **Egg UI**: Requests appear as eggs at the top of screen
- **Processing Animation**: Eggs wobble during processing
- **Status Indicators**: Checkmarks appear when tasks complete
- **App/Website Preview**: Window showing what the AI is interacting with
- **Logo Integration**: Favicon of the app/website being used
- **Detailed View**: Tap/click eggs to see full-screen results
- **Sharing**: Copy links to share results
- **Control Options**: Pause/delete prompts in progress
- **Goose Integration**: Powered by Goose by Block with Anthropic API support
- **Responsive Design**: Works on desktop, iPad, iPhone, Android
- **Vision OS Aesthetic**: Monochrome design with blur effects

## Technical Stack

- **Frontend**: HTML/CSS/JavaScript for prototype, React for production
- **Backend**: Node.js with Express
- **API Integration**: Anthropic Claude API
- **Styling**: Custom CSS with Vision OS-inspired design
- **Hosting**: Deployed via Render
- **Version Control**: GitHub

## Setup & Installation

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Anthropic API key (for Claude integration)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/1-0-design/egg.git
   cd egg
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file and add your Anthropic API key.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Deployment to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add the environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `ANTHROPIC_API_KEY`: Your Anthropic API key

## Usage Guide

1. **Enter Prompt**: Type your request in the input area or use voice input
2. **Request Processing**: Your request appears as an egg at the top of the screen
3. **View Progress**: Watch as the egg wobbles during processing
4. **Access Results**: Click on a completed egg (with checkmark) to view full results
5. **Share Results**: Use the share button to generate a shareable link

## Project Status

Currently in prototype phase. Basic functionality is in place, with ongoing work to:
- Improve the user interface
- Enhance API integration with Claude and Goose
- Add voice input functionality
- Optimize for mobile devices

## Contribution

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT