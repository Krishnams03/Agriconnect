import requests

# Define the API endpoint
url = "http://127.0.0.1:8000/api/predict"

# Specify the image file to upload
files = {'file': open('C:/Users/krish/Documents/Apple_scab.JPG', 'rb')}

try:
    # Send a POST request to the API
    response = requests.post(url, files=files)
    
    # Raise an exception for HTTP errors
    response.raise_for_status()
    
    # Parse and print the response JSON
    response_data = response.json()
    print("Response:", response_data)
    
    # Extract specific prediction details if available
    prediction = response_data.get('prediction')
    confidence = response_data.get('confidence')
    
    if prediction and confidence:
        print(f"Prediction: {prediction}, Confidence: {confidence:.2f}%")
    else:
        print("Detailed prediction information is missing in the response.")

except requests.exceptions.RequestException as e:
    # Handle any errors that occur during the request
    print(f"An error occurred: {e}")
