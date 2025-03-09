#!/usr/bin/env python3
import uvicorn
import os

if __name__ == "__main__":
    # Get port from environment variable or use default
    port = int(os.environ.get("PORT", 8000))
    
    # Run the API
    uvicorn.run("src.api:app", host="0.0.0.0", port=port, reload=True)