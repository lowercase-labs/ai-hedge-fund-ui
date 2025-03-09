# AI Hedge Fund UI

A modern Next.js frontend for the AI Hedge Fund API.

## Features

- Clean, responsive UI built with Next.js, TypeScript, and Tailwind CSS
- Interactive form for stock analysis with multiple AI analysts
- Real-time displays of trading decisions and analyst signals
- Detailed reasoning visualization from AI analysts
- Full TypeScript support

## Prerequisites

- Node.js 16.8 or later
- npm or yarn
- AI Hedge Fund API running locally (on port 8000 by default)

## Getting Started

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Start the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Configuration

By default, the UI connects to the AI Hedge Fund API at `http://localhost:8000`. To change this, edit `lib/api.ts` and update the `API_BASE_URL` constant.

## Project Structure

- `/app` - Next.js App Router pages
- `/components` - React components
- `/lib` - Utility functions and API service
- `/types` - TypeScript type definitions
- `/public` - Static assets

## Building for Production

```bash
npm run build
# or
yarn build
```

Then start the production server:

```bash
npm run start
# or
yarn start
```

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Axios for API requests
- date-fns for date manipulation