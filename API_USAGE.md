# AI Hedge Fund API

This document provides instructions on how to use the AI Hedge Fund as a RESTful API with a Next.js frontend.

## Backend Setup

1. Install the required dependencies:

```bash
poetry install
```

2. Set up your environment variables in a `.env` file:

```
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GROQ_API_KEY=your_groq_api_key
FINANCIAL_DATASETS_API_KEY=your_financial_datasets_api_key
```

3. Run the setup script to install the package in development mode (this ensures the imports work correctly):

```bash
python setup_dev.py
```

4. Start the FastAPI server:

```bash
# Navigate to the project root directory
cd /path/to/ai-hedge-fund

# Method 1: Use the run_api.py script (recommended)
python run_api.py

# Method 2: Run the module directly
python -m src.api
```

The API will be available at `http://localhost:8000`. You can access the auto-generated Swagger documentation at `http://localhost:8000/docs`.

## API Endpoints

### 1. Run Hedge Fund Analysis

**Endpoint:** `POST /hedge-fund`

**Request Body:**
```json
{
  "tickers": ["AAPL", "MSFT", "GOOGL"],
  "start_date": "2023-01-01",
  "end_date": "2023-04-01",
  "portfolio": {
    "cash": 100000.0,
    "margin_requirement": 0.0,
    "positions": {
      "AAPL": {
        "long": 0,
        "short": 0,
        "long_cost_basis": 0.0,
        "short_cost_basis": 0.0
      },
      "MSFT": {
        "long": 0,
        "short": 0,
        "long_cost_basis": 0.0,
        "short_cost_basis": 0.0
      },
      "GOOGL": {
        "long": 0,
        "short": 0,
        "long_cost_basis": 0.0,
        "short_cost_basis": 0.0
      }
    }
  },
  "show_reasoning": true,
  "selected_analysts": ["warren_buffett", "ben_graham", "fundamentals", "technicals"],
  "model_name": "gpt-4o",
  "model_provider": "OpenAI"
}
```

**Response:**
```json
{
  "decisions": {
    "portfolio_value": 100000.0,
    "trades": {
      "AAPL": {
        "action": "BUY",
        "shares": 10,
        "price": 182.52
      },
      "MSFT": {
        "action": "HOLD",
        "shares": 0,
        "price": 415.33
      }
    }
  },
  "analyst_signals": {
    "AAPL": {
      "warren_buffett": {
        "signal": "BUY",
        "confidence": 0.8,
        "reasoning": "Stable cash flow, strong brand value, and consistent dividend growth."
      },
      "fundamentals": {
        "signal": "BUY",
        "confidence": 0.75,
        "reasoning": "Strong financial metrics and healthy balance sheet."
      }
    },
    "MSFT": {
      "warren_buffett": {
        "signal": "HOLD",
        "confidence": 0.6,
        "reasoning": "Currently fairly valued but with good long-term prospects."
      }
    }
  }
}
```

### 2. Get Available Analysts

**Endpoint:** `GET /analysts`

**Response:**
```json
{
  "analysts": [
    { "name": "Warren Buffett", "value": "warren_buffett" },
    { "name": "Ben Graham", "value": "ben_graham" },
    { "name": "Fundamentals Analyst", "value": "fundamentals" },
    { "name": "Technical Analyst", "value": "technicals" }
  ]
}
```

### 3. Get Available LLM Models

**Endpoint:** `GET /models`

**Response:**
```json
{
  "models": [
    { "display": "GPT-4o (OpenAI)", "value": "gpt-4o" },
    { "display": "Claude 3.5 Sonnet (Anthropic)", "value": "claude-3-5-sonnet-20240620" }
  ]
}
```

## Next.js Integration

1. Create a new Next.js project (if you don't have one already):

```bash
npx create-next-app@latest my-hedge-fund-app
cd my-hedge-fund-app
```

2. Copy the Next.js component from `nextjs-example.js` to your Next.js project, for example to `components/AIHedgeFundComponent.jsx` or `app/hedge-fund/page.tsx`.

3. Install any required dependencies:

```bash
npm install axios
```

4. Import and use the component in your application:

```jsx
// app/page.tsx or pages/index.js
import AIHedgeFundComponent from '../components/AIHedgeFundComponent';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">AI Hedge Fund Dashboard</h1>
      <AIHedgeFundComponent />
    </main>
  );
}
```

5. Start your Next.js development server:

```bash
npm run dev
```

6. Access your application at `http://localhost:3000`

## Production Deployment

For production, you should:

1. Deploy the FastAPI backend to a server with proper authentication
2. Configure CORS in the FastAPI app to allow specific origins
3. Set up environment variables securely
4. Deploy the Next.js frontend to a platform like Vercel or Netlify

### Configure CORS for Production

For production deployment, update the FastAPI app to include CORS configuration:

```python
from fastapi.middleware.cors import CORSMiddleware

# Add this after creating your FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-nextjs-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### API Security

For production, implement proper authentication and authorization:

1. Add JWT authentication or API key validation
2. Use HTTPS for all API communication
3. Consider rate limiting to prevent abuse