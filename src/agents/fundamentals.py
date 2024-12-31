from langchain_core.messages import HumanMessage

from agents.state import AgentState, show_agent_reasoning

import json

##### Fundamental Agent #####
def fundamentals_agent(state: AgentState):
    """Analyzes fundamental data and generates trading signals."""
    show_reasoning = state["metadata"]["show_reasoning"]
    data = state["data"]
    metrics = data["financial_metrics"][0]

    # Initialize signals list for different fundamental aspects
    signals = []
    reasoning = {}
    
    # 1. Profitability Analysis
    profitability_score = 0
    if metrics["return_on_equity"] and metrics["return_on_equity"] > 0.15:  # Strong ROE above 15%
        profitability_score += 1
    if metrics["net_margin"] and metrics["net_margin"] > 0.20:  # Healthy profit margins
        profitability_score += 1
    if metrics["operating_margin"] and metrics["operating_margin"] > 0.15:  # Strong operating efficiency
        profitability_score += 1
        
    signals.append('bullish' if profitability_score >= 2 else 'bearish' if profitability_score == 0 else 'neutral')
    reasoning["profitability_signal"] = {
        "signal": signals[0],
        "details": (
            f"ROE: {metrics['return_on_equity']:.2%}" if metrics["return_on_equity"] else "ROE: N/A"
        ) + ", " + (
            f"Net Margin: {metrics['net_margin']:.2%}" if metrics["net_margin"] else "Net Margin: N/A"
        ) + ", " + (
            f"Op Margin: {metrics['operating_margin']:.2%}" if metrics["operating_margin"] else "Op Margin: N/A"
        )
    }
    
    # 2. Growth Analysis
    growth_score = 0
    if metrics["revenue_growth"] and metrics["revenue_growth"] > 0.10:  # 10% revenue growth
        growth_score += 1
    if metrics["earnings_growth"] and metrics["earnings_growth"] > 0.10:  # 10% earnings growth
        growth_score += 1
    if metrics["book_value_growth"] and metrics["book_value_growth"] > 0.10:  # 10% book value growth
        growth_score += 1
        
    signals.append('bullish' if growth_score >= 2 else 'bearish' if growth_score == 0 else 'neutral')
    reasoning["growth_signal"] = {
        "signal": signals[1],
        "details": (
            f"Revenue Growth: {metrics['revenue_growth']:.2%}" if metrics["revenue_growth"] else "Revenue Growth: N/A"
        ) + ", " + (
            f"Earnings Growth: {metrics['earnings_growth']:.2%}" if metrics["earnings_growth"] else "Earnings Growth: N/A"
        )
    }
    
    # 3. Financial Health
    health_score = 0
    if metrics["current_ratio"] and metrics["current_ratio"] > 1.5:  # Strong liquidity
        health_score += 1
    if metrics["debt_to_equity"] and metrics["debt_to_equity"] < 0.5:  # Conservative debt levels
        health_score += 1
    if (metrics["free_cash_flow_per_share"] and metrics["earnings_per_share"] and
            metrics["free_cash_flow_per_share"] > metrics["earnings_per_share"] * 0.8):  # Strong FCF conversion
        health_score += 1
        
    signals.append('bullish' if health_score >= 2 else 'bearish' if health_score == 0 else 'neutral')
    reasoning["financial_health_signal"] = {
        "signal": signals[2],
        "details": (
            f"Current Ratio: {metrics['current_ratio']:.2f}" if metrics["current_ratio"] else "Current Ratio: N/A"
        ) + ", " + (
            f"D/E: {metrics['debt_to_equity']:.2f}" if metrics["debt_to_equity"] else "D/E: N/A"
        )
    }
    
    # 4. Price to X ratios
    pe_ratio = metrics.get("price_to_earnings_ratio", None)
    pb_ratio = metrics.get("price_to_book_ratio", None)
    ps_ratio = metrics.get("price_to_sales_ratio", None)
    
    price_ratio_score = 0
    if pe_ratio and pe_ratio < 25:  # Reasonable P/E ratio
        price_ratio_score += 1
    if pb_ratio and pb_ratio < 3:  # Reasonable P/B ratio
        price_ratio_score += 1
    if ps_ratio and ps_ratio < 5:  # Reasonable P/S ratio
        price_ratio_score += 1
        
    signals.append('bullish' if price_ratio_score >= 2 else 'bearish' if price_ratio_score == 0 else 'neutral')
    reasoning["price_ratios_signal"] = {
        "signal": signals[3],
        "details": (
            f"P/E: {pe_ratio:.2f}" if pe_ratio else "P/E: N/A"
        ) + ", " + (
            f"P/B: {pb_ratio:.2f}" if pb_ratio else "P/B: N/A"
        ) + ", " + (
            f"P/S: {ps_ratio:.2f}" if ps_ratio else "P/S: N/A"
        )
    }
    
    # Determine overall signal
    bullish_signals = signals.count('bullish')
    bearish_signals = signals.count('bearish')
    
    if bullish_signals > bearish_signals:
        overall_signal = 'bullish'
    elif bearish_signals > bullish_signals:
        overall_signal = 'bearish'
    else:
        overall_signal = 'neutral'
    
    # Calculate confidence level
    total_signals = len(signals)
    confidence = max(bullish_signals, bearish_signals) / total_signals
    
    message_content = {
        "signal": overall_signal,
        "confidence": f"{round(confidence * 100)}%",
        "reasoning": reasoning
    }
    
    # Create the fundamental analysis message
    message = HumanMessage(
        content=json.dumps(message_content),
        name="fundamentals_agent",
    )
    
    # Print the reasoning if the flag is set
    if show_reasoning:
        show_agent_reasoning(message_content, "Fundamental Analysis Agent")
    
    return {
        "messages": [message],
        "data": data,
    }
