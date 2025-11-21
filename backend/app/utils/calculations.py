"""
Utility functions for calculating scores and determining levels
"""


def calculate_dimension_score(responses: list) -> float:
    """
    Calculate dimension score from responses
    
    Args:
        responses: List of responses (1-5 scale)
    
    Returns:
        Score on 1-10 scale
    """
    if not responses:
        return 0.0
    
    # Sum all responses and divide by 5 to scale to 1-10
    total = sum(responses)
    score = total / 5
    
    return round(score, 2)


def determine_level(score: float) -> str:
    """
    Determine maturity level based on score
    
    Args:
        score: Score on 1-10 scale
    
    Returns:
        Level name
    """
    if score < 2.0:
        return "Exploración"
    elif score < 4.0:
        return "Fundamentos"
    elif score < 6.0:
        return "Pilotaje"
    elif score < 8.0:
        return "Escalamiento"
    else:
        return "Transformación"
