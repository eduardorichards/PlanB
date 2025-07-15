# PlanB Game

A web-based game built with Node.js, Express, and Phaser 3.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
project/
├── public/          # Static files (images, styles, etc.)
│   ├── assets/      # Game assets (sprites, sounds, etc.)
│   └── js/          # Client-side JavaScript files
├── src/             # Server-side source files
│   └── server.js    # Express server setup
└── package.json     # Project dependencies and scripts
```

## Scripts

- `npm run dev`: Start the development server with hot-reload
- `npm start`: Start the production server

## Technologies Used

- Node.js
- Express.js
- Phaser 3
- Socket.IO (for multiplayer features, if implemented)

## License

ISC 