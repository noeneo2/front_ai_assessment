"""
Validation utilities
"""


def validate_excel_file(filename: str) -> bool:
    """
    Validate that file is an Excel file
    
    Args:
        filename: Name of the file
    
    Returns:
        True if valid Excel file
    """
    valid_extensions = ['.xlsx', '.xls']
    return any(filename.lower().endswith(ext) for ext in valid_extensions)


def validate_file_size(file_size: int, max_size_mb: int = 50) -> bool:
    """
    Validate file size
    
    Args:
        file_size: Size of file in bytes
        max_size_mb: Maximum allowed size in MB
    
    Returns:
        True if file size is valid
    """
    max_size_bytes = max_size_mb * 1024 * 1024
    return file_size <= max_size_bytes
