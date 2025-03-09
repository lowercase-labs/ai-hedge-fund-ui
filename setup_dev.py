#!/usr/bin/env python3
"""
This script ensures the project is installed in development mode,
which makes imports work correctly regardless of how you run the code.
"""
import subprocess
import sys
from pathlib import Path

def main():
    # Get the project root directory
    project_root = Path(__file__).resolve().parent
    
    # Run pip install -e . to install the package in development mode
    subprocess.run([sys.executable, "-m", "pip", "install", "-e", str(project_root)], check=True)
    
    print("\nSetup complete! The package has been installed in development mode.")
    print("You can now run the API using:")
    print("  python run_api.py")
    print("  or")
    print("  python -m src.api\n")

if __name__ == "__main__":
    main()