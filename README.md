# Google Maps to Location Telegram Bot

A TypeScript-based Telegram bot built with [Telegraf.js](https://github.com/telegraf/telegraf) for converting Google Maps links into shareable location coordinates. The bot extracts coordinates using the Google Maps API and responds with the location that can be directly shared in Telegram.

## Features

- Converts Google Maps links (including shortened links) to coordinates.
- Supports graceful error handling and bot stability.
- Easy integration with Google Maps APIs (Geocoding and Places APIs).
- Minimal setup for quick deployment.

If you're unfamiliar with the setup or the technical aspects, simply use the [demo bot](https://t.me/locationguybot) to convert Google Maps links to shareable locations directly in Telegram.

## Prerequisites

1. [Node.js](https://nodejs.org/) (v16 or higher).
2. A Telegram bot token from [BotFather](https://core.telegram.org/bots#botfather).
3. A Google Maps API key with the following APIs enabled:
   - Geocoding API
   - Places API

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/itsmrTech/location-guy-telegram-bot
   cd location-guy-telegram-bot
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add the following:
     ```env
     BOT_TOKEN=your-telegram-bot-token
     GOOGLE_MAPS_API_KEY=your-google-maps-api-key
     ```

4. Build the project (optional):

   ```bash
   npm run build
   ```

## Usage

### Demo

Try the demo bot here: [Location Guy Bot](https://t.me/locationguybot)

### Development Mode

To start the bot in development mode (uses `ts-node`):

```bash
npm run dev
```

### Production Mode

To build and start the bot in production mode:

```bash
npm run build
npm run start
```

## Project Structure

```
.
├── src
│   ├── index.ts         # Main entry point of the bot
│   ├── utils
│   │   └── location.utils.ts  # Utility functions for Google Maps APIs
├── .env                # Environment variables
├── package.json        # Project metadata and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Bot Commands

- **/start**: Greets the user with a welcome message.
- **/help**: Provides guidance on using the bot.
- **Any Google Maps link**: Extracts and replies with the location as coordinates.

## Example Usage

1. Send a Google Maps link (e.g., `https://maps.app.goo.gl/J6dgKT4WQ9yWfenQ8`).
2. The bot responds with the extracted coordinates and shares the location type message in Telegram.

##

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License

This project is licensed under the [MIT License](LICENSE).

---

Start sharing locations effortlessly with this Telegram bot!

