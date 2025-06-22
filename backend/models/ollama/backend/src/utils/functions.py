import datetime

def timestamped_filename() -> str:
    """
    Generate a timestamped filename based on the current date and time.

    Args:
        base_name (str): The base name for the file.
        extension (str): The file extension, default is ".txt".

    Returns:
        str: A string representing the timestamped filename.
    """
    ct = datetime.datetime.now()
    timestamp = ct.strftime("%Y_%m_%d_%H%M%S")
    return f"{timestamp}_"

def remove_special_chars(text: str) -> str:
    """
    Remove colons, semicolons, and underscores from a string.

    Args:
        text (str): The input string to clean.

    Returns:
        str: The cleaned string without :;_
    """
    chars_to_remove = ':;_'
    noChars = timestamped_filename() + "_"+''.join(char for char in text if char not in chars_to_remove)
    
    return noChars

