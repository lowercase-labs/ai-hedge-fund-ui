"""
Wrapper module that provides the run_hedge_fund function with proper imports
for use in the API. This avoids modifying the original main.py file.
"""

import sys
from pathlib import Path

# Add the project root to Python path to make imports work
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))
sys.path.append(str(project_root / "src"))

# Import the original function
from src.main import run_hedge_fund as original_run_hedge_fund

# Provides the run_hedge_fund function with the same signature as the original
run_hedge_fund = original_run_hedge_fund