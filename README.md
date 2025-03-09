# AI Hedge Fund

This is built on top of [![Twitter Follow](https://img.shields.io/twitter/follow/virattt?style=social)](https://twitter.com/virattt)'s [AI Hedge Fund](https://github.com/virattt/ai-hedge-fund?tab=readme-ov-file)

![AI Hedge Fund Screenshot](https://github.com/user-attachments/assets/16509cc2-4b64-4c67-8de6-00d224893d58)

**Note**: This system simulates trading decisions and does not perform actual trades.


## Features

- **Multi-Agent Analysis**: Leverages diverse financial perspectives using famous investor personas
- **Interactive Web UI**: Modern, responsive interface with dark mode support
- **Real-time Analysis**: Generates financial insights on selected stocks
- **Comprehensive Reporting**: Detailed trading recommendations with reasoning
- **Expert AI Analysts**: Multiple AI agents analyzing different aspects of stocks
  1. **Famous Investors**: Ben Graham, Bill Ackman, Cathie Wood, Warren Buffett, Charlie Munger
  2. **Technical Analysts**: Fundamentals, Technicals, Valuation, Sentiment, Risk Manager, Portfolio Manager

## Disclaimer

This project is for **educational and research purposes only**.

- Not intended for real trading or investment
- No warranties or guarantees provided
- Past performance does not indicate future results
- Creator assumes no liability for financial losses
- Consult a financial advisor for investment decisions

By using this software, you agree to use it solely for learning purposes.

## Table of Contents
- [Setup](#setup)
  - [Backend Setup](#backend-setup)
  - [UI Setup](#ui-setup)
- [Usage](#usage)
  - [Using the Web Interface](#using-the-web-interface)
  - [Using the API](#using-the-api)
  - [Running the CLI](#running-the-cli)
  - [Running the Backtester](#running-the-backtester)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Feature Requests](#feature-requests)
- [License](#license)

## Setup

Clone the repository:
```bash
git clone https://github.com/sritampatnaik/ai-hedge-fund-ui.git
cd ai-hedge-fund
```

### Backend Setup

1. Install Poetry (if not already installed):
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

2. Install dependencies:
```bash
poetry install
```

3. Set up your environment variables:
```bash
# Create .env file for your API keys
cp .env.example .env
```

4. Set your API keys in the .env file:
```
# For LLM access (required, choose at least one)
OPENAI_API_KEY=your-openai-api-key
GROQ_API_KEY=your-groq-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# For financial data (optional for common stocks)
FINANCIAL_DATASETS_API_KEY=your-financial-datasets-api-key
```

### UI Setup

The project has two UI options:

#### Option 1: Using the frontend directory (recommended)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

#### Option 2: Using the legacy UI

1. Navigate to the UI directory:
```bash
cd ai-hedge-fund-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The UI will be available at http://localhost:3000

## Usage

### Using the Web Interface

1. Start the API server:
```bash
python run_api.py
```

2. In a separate terminal, start the UI (choose one option):
```bash
# Option 1: Using the frontend directory (recommended)
cd frontend
npm run dev

# Option 2: Using the legacy UI
cd ai-hedge-fund-ui
npm run dev
```

3. Open http://localhost:3000 in your browser
4. Enter stock symbols, select analysts, and generate analysis

### Using the API

The system provides a RESTful API for integration with other applications:

```bash
# Start the API server
python run_api.py
```

Example API request:
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"tickers": ["AAPL", "MSFT"], "start_date": "2024-01-01", "end_date": "2024-03-01", "show_reasoning": true}'
```

See API_USAGE.md for detailed API documentation.

### Running the CLI

For command-line usage:

```bash
# Basic usage
poetry run python src/main.py --ticker AAPL,MSFT,NVDA

# With reasoning
poetry run python src/main.py --ticker AAPL,MSFT,NVDA --show-reasoning

# Specific time period
poetry run python src/main.py --ticker AAPL,MSFT,NVDA --start-date 2024-01-01 --end-date 2024-03-01
```

### Running the Backtester

Test trading strategies against historical data:

```bash
poetry run python src/backtester.py --ticker AAPL,MSFT,NVDA

# Specific time period
poetry run python src/backtester.py --ticker AAPL,MSFT,NVDA --start-date 2024-01-01 --end-date 2024-03-01
```

## Project Structure

```
ai-hedge-fund/
├── frontend/               # Main Next.js frontend (recommended)
│   ├── app/                # Next.js app directory
│   ├── components/         # UI components
│   ├── lib/                # UI utilities
│   └── types/              # TypeScript type definitions
├── ai-hedge-fund-ui/       # Legacy React-based frontend
│   ├── app/                # Next.js app directory
│   ├── components/         # UI components
│   ├── lib/                # UI utilities
│   └── types/              # TypeScript type definitions
├── src/
│   ├── agents/             # AI Analyst implementation
│   │   ├── ben_graham.py
│   │   ├── bill_ackman.py
│   │   ├── cathie_wood.py
│   │   ├── charlie_munger.py
│   │   ├── fundamentals.py
│   │   ├── portfolio_manager.py
│   │   ├── risk_manager.py
│   │   ├── sentiment.py
│   │   ├── technicals.py
│   │   ├── valuation.py
│   │   └── warren_buffett.py
│   ├── data/               # Data handling modules
│   ├── graph/              # Graph generation
│   ├── llm/                # LLM integration
│   ├── tools/              # Agent tools
│   ├── utils/              # Utility functions
│   ├── api.py              # API implementation
│   ├── api_wrapper.py      # API client wrapper
│   ├── backtester.py       # Backtesting tools
│   └── main.py             # CLI entry point
├── API_USAGE.md            # API documentation
├── .env.example            # Environment variable template
├── pyproject.toml          # Python dependencies
├── run_api.py              # API server runner
└── setup_dev.py            # Development setup script
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

**Important**: Please keep your pull requests small and focused for easier review and merging.

## Feature Requests

If you have a feature request, please open an [issue](https://github.com/virattt/ai-hedge-fund/issues) and tag it with `enhancement`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
