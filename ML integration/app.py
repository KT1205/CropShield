from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from io import BytesIO
from PIL import Image
import uvicorn
import os
import random

# Initialize FastAPI app
app = FastAPI(
    title="Plant Disease Detection API",
    description="API for detecting diseases in plant images using a TensorFlow model",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Class names mapping - Exactly as in Kaggle
class_names = {
    "0": "Apple_Applescab", "1": "AppleBlack_rot", "2": "Apple_Cedar_applerust", 
    "3": "Applehealthy", "4": "Blueberryhealthy", 
    "5": "Cherry(includingsour)Powderymildew", "6": "Cherry(including_sour)healthy", 
    "7": "Corn(maize)_Cercospora_leaf_spot Gray_leafspot", "8": "Corn(maize)_Commonrust", 
    "9": "Corn(maize)Northern_LeafBlight", "10": "Corn(maize)healthy", 
    "11": "GrapeBlack_rot", "12": "GrapeEsca(BlackMeasles)", 
    "13": "GrapeLeafblight(Isariopsis_Leaf_Spot)", "14": "Grapehealthy", 
    "15": "OrangeHaunglongbing_(Citrus_greening)", "16": "Peach_Bacterialspot", 
    "17": "Peachhealthy", "18": "Pepper,_bell_Bacterial_spot", 
    "19": "Pepper,bellhealthy", "20": "Potato_Earlyblight", 
    "21": "PotatoLate_blight", "22": "Potatohealthy", 
    "23": "Raspberryhealthy", "24": "Soybeanhealthy", 
    "25": "SquashPowdery_mildew", "26": "Strawberry_Leafscorch", 
    "27": "Strawberryhealthy", "28": "Tomato_Bacterialspot", 
    "29": "TomatoEarly_blight", "30": "Tomato_Lateblight", 
    "31": "TomatoLeaf_Mold", "32": "Tomato_Septoria_leafspot", 
    "33": "TomatoSpider_mites Two-spotted_spider_mite", "34": "Tomato_TargetSpot", 
    "35": "TomatoTomato_Yellow_Leaf_Curl_Virus", "36": "Tomato_Tomato_mosaicvirus", 
    "37": "Tomatohealthy"
}

# Format class names for display exactly as in Kaggle (with underscores)
display_class_names = {
    "0": "Apple___Apple_scab", "1": "Apple___Black_rot", "2": "Apple___Cedar_apple_rust", 
    "3": "Apple___healthy", "4": "Blueberry___healthy", 
    "5": "Cherry_(including_sour)___Powdery_mildew", "6": "Cherry_(including_sour)___healthy", 
    "7": "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "8": "Corn_(maize)___Common_rust", 
    "9": "Corn_(maize)___Northern_Leaf_Blight", "10": "Corn_(maize)___healthy", 
    "11": "Grape___Black_rot", "12": "Grape___Esca_(Black_Measles)", 
    "13": "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "14": "Grape___healthy", 
    "15": "Orange___Haunglongbing_(Citrus_greening)", "16": "Peach___Bacterial_spot", 
    "17": "Peach___healthy", "18": "Pepper,_bell___Bacterial_spot", 
    "19": "Pepper,_bell___healthy", "20": "Potato___Early_blight", 
    "21": "Potato___Late_blight", "22": "Potato___healthy", 
    "23": "Raspberry___healthy", "24": "Soybean___healthy", 
    "25": "Squash___Powdery_mildew", "26": "Strawberry___Leaf_scorch", 
    "27": "Strawberry___healthy", "28": "Tomato___Bacterial_spot", 
    "29": "Tomato___Early_blight", "30": "Tomato___Late_blight", 
    "31": "Tomato___Leaf_Mold", "32": "Tomato___Septoria_leaf_spot", 
    "33": "Tomato___Spider_mites Two-spotted_spider_mite", "34": "Tomato___Target_Spot", 
    "35": "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "36": "Tomato___Tomato_mosaic_virus", 
    "37": "Tomato___healthy"
}

# Configuration
IMG_SIZE = 224
MODEL_PATH = "model.h5"  # Update this path to your model location

# Global variables
model = None
datagen = None

def set_random_seed(seed=42):
    """Set random seeds for reproducibility exactly as in training"""
    os.environ['PYTHONHASHSEED'] = str(seed)
    np.random.seed(seed)
    random.seed(seed)
    tf.random.set_seed(seed)
    os.environ['TF_DETERMINISTIC_OPS'] = '1'
    tf.config.experimental.enable_op_determinism()

# Load model at startup
@app.on_event("startup")
async def load_ml_model():
    global model, datagen
    try:
        # Set the same random seed as in your training code
        set_random_seed(42)
        
        # Set float precision
        tf.keras.backend.set_floatx('float32')
        
        # Load the model
        model = load_model(MODEL_PATH)
        
        # Create the same ImageDataGenerator as in training
        datagen = ImageDataGenerator(
            rescale=1.0 / 255.0,
            rotation_range=15,
            horizontal_flip=True,
            brightness_range=[0.8, 1.2]
        )
        
        print("Model and data generator loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
        raise RuntimeError(f"Failed to load model: {e}")

# Preprocess image function using the same pipeline as in training
def preprocess_image(image):
    # Convert PIL Image to numpy array
    img_array = img_to_array(image)
    
    # Resize to match training size
    img_array = tf.image.resize(img_array, (IMG_SIZE, IMG_SIZE))
    
    # Create a batch
    img_batch = np.expand_dims(img_array, axis=0)
    
    # Apply the same preprocessing as in training
    # The ImageDataGenerator would have applied normalization
    processed_batch = img_batch / 255.0
    
    return processed_batch

@app.get("/")
async def root():
    return {"message": "Welcome to Plant Disease Detection API"}

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    # Check if model is loaded
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Validate file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read image file
        contents = await file.read()
        image = Image.open(BytesIO(contents))
        
        # Handle different image modes
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Use the same preprocessing as in training
        processed_image = preprocess_image(image)
        
        # Make prediction
        predictions = model.predict(processed_image)
        
        # Get predicted class
        predicted_class_index = np.argmax(predictions, axis=1)[0]
        predicted_class_name = display_class_names[str(predicted_class_index)]
        confidence = float(predictions[0][predicted_class_index])
        
        # Get top 3 predictions
        top_indices = predictions[0].argsort()[-3:][::-1]
        top_predictions = [
            {"class": display_class_names[str(i)], "confidence": float(predictions[0][i])}
            for i in top_indices
        ]
        
        # Create a similar output format to the Kaggle output
        console_output = f"""
Predicted Class Index: {predicted_class_index}
Predicted Class Name : {predicted_class_name}
Confidence Score     : {confidence:.4f}

Top 3 Predictions:
{top_predictions[0]["class"]}: {top_predictions[0]["confidence"]:.4f}
{top_predictions[1]["class"]}: {top_predictions[1]["confidence"]:.4f}
{top_predictions[2]["class"]}: {top_predictions[2]["confidence"]:.4f}
"""
        
        return JSONResponse(content={
            "success": True,
            "prediction": {
                "class_index": int(predicted_class_index),
                "class_name": predicted_class_name,
                "confidence": confidence
            },
            "top_predictions": top_predictions,
            "console_output": console_output
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

# Debug endpoint to verify model and class mapping
@app.get("/debug-info")
async def debug_info():
    loaded = model is not None
    return {
        "model_loaded": loaded,
        "model_path": MODEL_PATH,
        "image_size": IMG_SIZE,
        "class_count": len(class_names),
        "sample_class_names": {k: display_class_names[k] for k in list(display_class_names.keys())[:5]}
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    if model is None:
        return {"status": "unhealthy", "message": "Model not loaded"}
    return {"status": "healthy", "message": "Service is running"}

# Run the app
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)