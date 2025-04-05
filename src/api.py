from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException, APIRouter, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import uvicorn
import json
import os
import sys
from pathlib import Path
from sqlalchemy.orm import Session
import uuid
from .models.analysis import Analysis
from .utils.database import get_db

# Add the project root to Python path to make imports work
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

# Use our wrapper instead of importing directly from main
from src.api_wrapper import run_hedge_fund
from src.data.models import Portfolio

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Hedge Fund API",
    description="API for interacting with the AI Hedge Fund trading system",
    version="0.1.0",
)

# Configure CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - in production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PositionData(BaseModel):
    long: int = 0
    short: int = 0
    long_cost_basis: float = 0.0
    short_cost_basis: float = 0.0

class PortfolioRequest(BaseModel):
    cash: float = 100000.0
    margin_requirement: float = 0.0
    positions: Dict[str, PositionData] = {}
    realized_gains: Optional[Dict[str, Dict[str, float]]] = None

class HedgeFundRequest(BaseModel):
    tickers: List[str]
    start_date: str
    end_date: str
    portfolio: PortfolioRequest
    show_reasoning: bool = False
    selected_analysts: List[str] = []
    model_name: str = "gpt-4o"
    model_provider: str = "OpenAI"

class HedgeFundResponse(BaseModel):
    decisions: Optional[dict] = None
    analyst_signals: Optional[dict] = None
    ticker_signals: Optional[dict] = None
    error: Optional[str] = None

router = APIRouter()

@router.post("/analyses")
async def create_analysis(
    title: str,
    description: str,
    parameters: dict,
    db: Session = Depends(get_db)
):
    analysis = Analysis(
        id=str(uuid.uuid4()),
        title=title,
        description=description,
        parameters=parameters,
        status="in_progress"
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis.to_dict()

@router.get("/analyses")
async def list_analyses(db: Session = Depends(get_db)):
    analyses = db.query(Analysis).order_by(Analysis.created_at.desc()).all()
    return [analysis.to_dict() for analysis in analyses]

@router.get("/analyses/{analysis_id}")
async def get_analysis(analysis_id: str, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis.to_dict()

@router.delete("/analyses/{analysis_id}")
async def delete_analysis(analysis_id: str, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    db.delete(analysis)
    db.commit()
    return {"message": "Analysis deleted successfully"}

@router.put("/analyses/{analysis_id}")
async def update_analysis(
    analysis_id: str,
    results: dict,
    status: str,
    error_message: str = None,
    db: Session = Depends(get_db)
):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    analysis.results = results
    analysis.status = status
    analysis.error_message = error_message
    
    db.commit()
    db.refresh(analysis)
    return analysis.to_dict()

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Hedge Fund API"}

@app.post("/hedge-fund", response_model=HedgeFundResponse)
async def hedge_fund_endpoint(request: HedgeFundRequest):
    try:
        # Convert portfolio from request format to the format expected by run_hedge_fund
        portfolio = {
            "cash": request.portfolio.cash,
            "margin_requirement": request.portfolio.margin_requirement,
            "positions": {
                ticker: {
                    "long": pos.long,
                    "short": pos.short,
                    "long_cost_basis": pos.long_cost_basis,
                    "short_cost_basis": pos.short_cost_basis,
                } for ticker, pos in request.portfolio.positions.items()
            },
            "realized_gains": request.portfolio.realized_gains or {
                ticker: {
                    "long": 0.0,
                    "short": 0.0,
                } for ticker in request.tickers
            }
        }
        
        # Ensure all tickers are in the positions dictionary
        for ticker in request.tickers:
            if ticker not in portfolio["positions"]:
                portfolio["positions"][ticker] = {
                    "long": 0,
                    "short": 0,
                    "long_cost_basis": 0.0,
                    "short_cost_basis": 0.0,
                }
            if ticker not in portfolio["realized_gains"]:
                portfolio["realized_gains"][ticker] = {
                    "long": 0.0,
                    "short": 0.0,
                }

        # Run the hedge fund
        result = run_hedge_fund(
            tickers=request.tickers,
            start_date=request.start_date,
            end_date=request.end_date,
            portfolio=portfolio,
            show_reasoning=request.show_reasoning,
            selected_analysts=request.selected_analysts,
            model_name=request.model_name,
            model_provider=request.model_provider,
        )
        
        # Get the original analyst signals
        analyst_signals = result["analyst_signals"]
        
        # Create both types of organization:
        # 1. ticker_signals: Grouped primarily by ticker
        # 2. analyst_signals: The original format (preserve for backward compatibility)
        
        # Initialize ticker_signals structure
        ticker_signals = {}
        
        # Iterate through analyst_signals which might be mixed format
        # and organize signals by ticker
        for ticker_or_analyst, data in analyst_signals.items():
            # Check if this key contains nested analyst data
            if isinstance(data, dict) and all(isinstance(v, dict) for v in data.values()):
                # This is already in ticker -> analyst format
                if ticker_or_analyst not in ticker_signals:
                    ticker_signals[ticker_or_analyst] = {}
                
                for analyst, signal_data in data.items():
                    ticker_signals[ticker_or_analyst][analyst] = signal_data
            else:
                # This might be in old analyst -> ticker format which we skip
                continue
        
        # Ensure all tickers from request are included
        for ticker in request.tickers:
            if ticker not in ticker_signals:
                ticker_signals[ticker] = {}
        
        return HedgeFundResponse(
            decisions=result["decisions"],
            analyst_signals=analyst_signals,  # Original format
            ticker_signals=ticker_signals     # New format explicitly grouped by ticker
        )
    except Exception as e:
        # Log the error (in a production environment, you'd want to use a proper logger)
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analysts")
async def get_analysts():
    """Return the list of available analysts"""
    from src.utils.analysts import ANALYST_ORDER
    return {"analysts": [{"name": name, "value": value} for name, value in ANALYST_ORDER]}

@app.get("/models")
async def get_models():
    """Return the list of available LLM models"""
    from src.llm.models import LLM_ORDER
    return {"models": [{"display": display, "value": value} for display, value, _ in LLM_ORDER]}

if __name__ == "__main__":
    # Get port from environment variable or use default
    port = int(os.environ.get("PORT", 8000))
    # Use the correct module path
    uvicorn.run("src.api:app", host="0.0.0.0", port=port, reload=True)