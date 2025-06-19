from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import shutil
import os

app = FastAPI()

#  CORS middleware for mobile app access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#  Load the trained model once at startup
MODEL_PATH = r"C:\Users\lesli\Documents\best_eye_model.keras"
try:
    model = load_model(MODEL_PATH)
    print(" Model loaded successfully.")
except Exception as e:
    raise RuntimeError(f" Failed to load model: {e}")

class_names = ['Cataract', 'Glaucoma', 'Normal', 'Not An Eye']
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        #  Save uploaded file
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        #  Load and preprocess the image
        img = image.load_img(file_path, target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        #  Perform prediction
        predictions = model.predict(img_array)
        pred_index = np.argmax(predictions)
        pred_class = class_names[pred_index]
        confidence = round(float(np.max(predictions)) * 100, 2)

        #  Clean up
        os.remove(file_path)

        return {
            "prediction": pred_class,
            "confidence": confidence
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
