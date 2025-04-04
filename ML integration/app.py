from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json
import os
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the saved model
MODEL_PATH = 'model.h5'
CLASS_INDICES_PATH = 'class_indices.json'

# Check if model exists
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Please train and save the model first.")

# Check if class indices exist
if not os.path.exists(CLASS_INDICES_PATH):
    raise FileNotFoundError(f"Class indices file not found at {CLASS_INDICES_PATH}.")

# Load the model
model = tf.keras.models.load_model(MODEL_PATH, compile=False)
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Load class indices
with open(CLASS_INDICES_PATH, 'r') as f:
    class_names = json.load(f)

def preprocess_image(image_bytes):
    """Preprocess the image for model prediction"""
    img = Image.open(io.BytesIO(image_bytes))
    img = img.resize((224, 224))  # Same size as during training
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = img_array / 255.0  # Rescale as in training
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    try:
        image_file = request.files['image']
        image_bytes = image_file.read()
        processed_image = preprocess_image(image_bytes)
        
        # Make prediction
        predictions = model.predict(processed_image)
        predicted_class_idx = np.argmax(predictions[0])
        
        # Get the class name
        if str(predicted_class_idx) in class_names:
            predicted_class = class_names[str(predicted_class_idx)]
        else:
            predicted_class = f"Unknown (Class {predicted_class_idx})"
        
        # Get the confidence score
        confidence = float(predictions[0][predicted_class_idx])
        
        # Get top 3 predictions
        top_indices = np.argsort(predictions[0])[-3:][::-1]
        top_predictions = [
            {
                'class': class_names[str(idx)] if str(idx) in class_names else f"Unknown (Class {idx})",
                'confidence': float(predictions[0][idx])
            }
            for idx in top_indices
        ]
        
        return jsonify({
            'prediction': predicted_class,
            'confidence': confidence,
            'top_predictions': top_predictions
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict_base64', methods=['POST'])
def predict_base64():
    data = request.get_json()
    
    if 'image' not in data:
        return jsonify({'error': 'No image data provided'}), 400
    
    try:
        # Decode base64 image
        image_data = data['image']
        if image_data.startswith('data:image'):
            # Remove data URI header if present
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        processed_image = preprocess_image(image_bytes)
        
        # Make prediction
        predictions = model.predict(processed_image)
        predicted_class_idx = np.argmax(predictions[0])
        
        # Get the class name
        if str(predicted_class_idx) in class_names:
            predicted_class = class_names[str(predicted_class_idx)]
        else:
            predicted_class = f"Unknown (Class {predicted_class_idx})"
        
        # Get the confidence score
        confidence = float(predictions[0][predicted_class_idx])
        
        # Get top 3 predictions
        top_indices = np.argsort(predictions[0])[-3:][::-1]
        top_predictions = [
            {
                'class': class_names[str(idx)] if str(idx) in class_names else f"Unknown (Class {idx})",
                'confidence': float(predictions[0][idx])
            }
            for idx in top_indices
        ]
        
        # Prepare detailed information about the disease
        disease_info = get_disease_info(predicted_class)
        
        return jsonify({
            'prediction': predicted_class,
            'confidence': confidence,
            'top_predictions': top_predictions,
            'disease_info': disease_info
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_disease_info(disease_name):
    """Get additional information about a plant disease"""
    # This is a placeholder function. In a real application, you would
    # look up information from a database or external API.
    
    # Dictionary with basic information about some common plant diseases
    disease_info_dict = {
        "Apple___Apple_scab": {
            "name": "Apple Scab",
            "description": "A fungal disease that affects apple trees, causing dark, scabby lesions on leaves and fruit.",
            "treatment": "Apply fungicides in early spring, practice good orchard sanitation, choose resistant varieties.",
            "prevention": "Remove and destroy fallen leaves, prune to improve air circulation."
        },
        "Apple___Black_rot": {
            "name": "Apple Black Rot",
            "description": "A fungal disease that causes rotting of fruit and dark lesions on leaves and branches.",
            "treatment": "Remove infected plant parts, apply appropriate fungicides.",
            "prevention": "Prune out dead or diseased wood, maintain tree vigor with proper fertilization."
        },
        # Add more disease information as needed for your specific classes
    }
    
    # Default info if disease not found in dictionary
    default_info = {
        "name": disease_name.replace("___", " - ").replace("_", " "),
        "description": "Information not available for this disease.",
        "treatment": "Consult with a local agricultural extension for specific treatment recommendations.",
        "prevention": "Practice good plant hygiene and crop rotation."
    }
    
    return disease_info_dict.get(disease_name, default_info)

@app.route('/categories', methods=['GET'])
def get_categories():
    """Return all possible plant disease categories"""
    categories = list(class_names.values())
    return jsonify({
        'categories': categories,
        'count': len(categories)
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Plant disease classifier API is running'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)