import pandas as pd
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import torch
from torchvision import transforms
from PIL import Image
import io
from .model import CNN

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Device and Model Setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load Disease Info CSVs
try:
    disease_info = pd.read_csv("backend/data/disease_info.csv", encoding="utf-8")
    supplement_info = pd.read_csv("backend/data/supplement_info.csv", encoding="utf-8")
    
    # Validate CSV columns
    required_disease_columns = ['disease_name', 'description', 'possible steps', 'image_url']
    required_supplement_columns = ['disease_name', 'supplement_name', 'supplement image']
    
    for col in required_disease_columns:
        if col not in disease_info.columns:
            raise ValueError(f"Missing column '{col}' in disease_info.csv")
    
    for col in required_supplement_columns:
        if col not in supplement_info.columns:
            raise ValueError(f"Missing column '{col}' in supplement_info.csv")
    
    # Create class names from CSV
    class_names = disease_info["disease_name"].tolist()
    
    # Log class information
    print(f"Total Classes: {len(class_names)}")
    print("First 5 Classes:", class_names[:5])

except Exception as csv_error:
    print(f"CSV Loading Error: {csv_error}")
    class_names = []

# Model Setup
try:
    model = CNN(K=len(class_names))
    model.load_state_dict(torch.load("backend/models/plant_disease_model_1.pt", map_location=device , weights_only=True))
    model.eval()
except Exception as model_error:
    print(f"Model Loading Error: {model_error}")
    model = None

# Preprocessing function
def preprocess_image(image: UploadFile):
    img = Image.open(io.BytesIO(image.file.read()))
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    img = transform(img).unsqueeze(0).to(device)
    return img

@app.post("/api/predict")
async def predict(image: UploadFile = File(...)):
    try:
        # Validate model and class names
        if model is None or len(class_names) == 0:
            return JSONResponse(
                status_code=500, 
                content={"message": "Model or disease data not properly loaded"}
            )

        # Preprocess image
        img = preprocess_image(image)

        # Prediction
        with torch.no_grad():
            output = model(img)
            probabilities = torch.softmax(output, dim=1)
            top_prob, predicted_class = torch.max(probabilities, 1)

        # Get Disease Name
        predicted_disease_index = predicted_class.item()
        if predicted_disease_index < 0 or predicted_disease_index >= len(class_names):
            return JSONResponse(
                status_code=400, 
                content={"message": "Invalid prediction index"}
            )

        predicted_disease = class_names[predicted_disease_index]
        top_probability = top_prob.item() * 100

        # Fetch Disease Details
        disease_details = disease_info[disease_info['disease_name'] == predicted_disease]
        if disease_details.empty:
            return JSONResponse(
                status_code=404, 
                content={"message": f"No details found for {predicted_disease}"}
            )

        disease_details = disease_details.iloc[0]
        
        # Fetch Supplements
        supplements = supplement_info[supplement_info['disease_name'] == predicted_disease]
        supplement_data = supplements.apply(
            lambda row: {
                'supplement_name': row['supplement_name'],
                'supplement_image': row['supplement image']
            }, 
            axis=1
        ).tolist()

        return JSONResponse(content={
            "prediction": predicted_disease,
            "confidence": round(top_probability, 2),
            "description": disease_details['description'],
            "possible_steps": disease_details['possible steps'],
            "image_url": disease_details['image_url'],
            "supplements": supplement_data
        })

    except Exception as e:
        print(f"Prediction Error: {e}")
        return JSONResponse(
            status_code=500, 
            content={"message": f"Prediction failed: {str(e)}"}
        )