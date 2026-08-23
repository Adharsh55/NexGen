import io
import re
from PIL import Image, UnidentifiedImageError


def process_uploaded_image(file_object):
    """
    Safely opens an uploaded image file using Pillow (PIL), verifies it is a JPG or PNG,
    converts it to RGB (stripping alpha channels), and returns the PIL Image object.
    
    If the file cannot be identified or is invalid, catches UnidentifiedImageError
    and returns a clean error message string.
    
    Args:
        file_object: A file path, file-like object, or bytes buffer representing the image.
        
    Returns:
        PIL.Image.Image: The processed RGB image object on success.
        str: A clean error message if the file is invalid or unsupported.
    """
    try:
        image = Image.open(file_object)
        
        # Verify image format (Pillow represents JPEG as 'JPEG' and PNG as 'PNG')
        if image.format not in ('JPEG', 'PNG'):
            return f"Invalid image format: '{image.format}'. Only JPG and PNG are supported."
        
        # Convert to RGB mode to strip alpha channels and standardize format
        rgb_image = image.convert('RGB')
        return rgb_image

    except UnidentifiedImageError:
        return "Invalid image file: The provided file could not be identified as an image."
    except Exception as e:
        return f"Error processing image: {str(e)}"


def extract_urls(text):
    """
    Extracts and returns a list of all URLs starting with http, https, or www from a string.
    
    Args:
        text (str): The input text to search for URLs.
        
    Returns:
        list[str]: A list of matched URL strings.
    """
    if not text or not isinstance(text, str):
        return []
    
    # Regex pattern matching URLs starting with http://, https://, or www.
    url_pattern = r'(?:https?://|www\.)[^\s<>"\'`()]+(?:\([^\s<>"\'`()]+\)|[^\s<>"\'`!?:;.,])'
    
    return re.findall(url_pattern, text)


if __name__ == '__main__':
    print("=" * 60)
    print("TESTING image_utils.py")
    print("=" * 60)

    # -------------------------------------------------------------
    # 1. Test process_uploaded_image with dummy images
    # -------------------------------------------------------------
    print("\n--- 1. Testing process_uploaded_image ---")

    # A. Valid PNG (RGBA mode with transparency)
    png_buffer = io.BytesIO()
    dummy_png = Image.new('RGBA', (100, 100), color=(255, 0, 0, 128))
    dummy_png.save(png_buffer, format='PNG')
    png_buffer.seek(0)

    result_png = process_uploaded_image(png_buffer)
    print(f"Valid PNG (RGBA -> RGB) Result: {result_png}")
    if isinstance(result_png, Image.Image):
        print(f"  -> Format/Mode: {result_png.mode}, Size: {result_png.size}")

    # B. Valid JPEG
    jpg_buffer = io.BytesIO()
    dummy_jpg = Image.new('RGB', (120, 80), color=(0, 255, 0))
    dummy_jpg.save(jpg_buffer, format='JPEG')
    jpg_buffer.seek(0)

    result_jpg = process_uploaded_image(jpg_buffer)
    print(f"Valid JPEG Result: {result_jpg}")
    if isinstance(result_jpg, Image.Image):
        print(f"  -> Mode: {result_jpg.mode}, Size: {result_jpg.size}")

    # C. Unsupported format (GIF)
    gif_buffer = io.BytesIO()
    dummy_gif = Image.new('RGB', (50, 50), color=(0, 0, 255))
    dummy_gif.save(gif_buffer, format='GIF')
    gif_buffer.seek(0)

    result_gif = process_uploaded_image(gif_buffer)
    print(f"Unsupported GIF Result: {result_gif}")

    # D. Invalid file data (triggers UnidentifiedImageError)
    invalid_buffer = io.BytesIO(b"This is not a real image file content.")
    result_invalid = process_uploaded_image(invalid_buffer)
    print(f"Invalid Data Result: {result_invalid}")

    # -------------------------------------------------------------
    # 2. Test extract_urls
    # -------------------------------------------------------------
    print("\n--- 2. Testing extract_urls ---")
    sample_text = (
        "Hello! Check out our website at https://www.example.com/home and read the documentation "
        "at http://docs.example.org/api?v=2&lang=en. You can also visit www.github.com/profile. "
        "Feel free to contact us or browse https://subdomain.test.co.uk:8080/path/file.html."
    )
    
    extracted = extract_urls(sample_text)
    print(f"Sample Text:\n\"{sample_text}\"\n")
    print(f"Extracted URLs ({len(extracted)} found):")
    for idx, url in enumerate(extracted, 1):
        print(f"  {idx}. {url}")
    print("=" * 60)
