import os
import sys
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from tensorflow.keras.preprocessing import image


app = Flask(__name__)
CORS(app)  # Enable cross-origin requests

# Try multiple loading approaches
def load_model_with_fallbacks():
    try:
        print("Attempting to load model.h5 directly...")
        model = tf.keras.models.load_model('model.h5', compile=False)
        print("Successfully loaded model from H5!")
        return model
    except Exception as e:
        print(f"Direct H5 loading failed: {e}")

# Load model using the fallback approaches
model = load_model_with_fallbacks()

# Class names
class_names = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)_Powdery_mildew',
    'Cherry_(including_sour)_healthy',
    'Corn_(maize)_Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)Common_rust',
    'Corn_(maize)_Northern_Leaf_Blight',
    'Corn_(maize)_healthy',
    'Grape___Black_rot',
    'Grape__Esca(Black_Measles)',
    'Grape__Leaf_blight(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange__Haunglongbing(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,bell__Bacterial_spot',
    'Pepper,bell__healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Preprocess the image
            img = image.load_img(filepath, target_size=(224, 224))
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)
            img_array = img_array / 255.0  # Normalize
            
            # Make prediction
            predictions = model.predict(img_array)
            predicted_class_index = np.argmax(predictions[0])
            predicted_class = class_names[predicted_class_index]
            confidence = float(predictions[0][predicted_class_index])
            
            return jsonify({
                'class': predicted_class,
                'confidence': confidence,
                'all_probabilities': {class_names[i]: float(predictions[0][i]) for i in range(len(class_names))}
            })
        except Exception as e:
            return jsonify({'error': f'Prediction failed: {str(e)}'})
    
    return jsonify({'error': 'File type not allowed'})

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok', 
        'model_loaded': model is not None,
        'tensorflow_version': tf._version_
    })

@app.route('/', methods=['GET'])
def welcome():
    return jsonify({
        'message': 'Plant Disease Detection API is running',
        'endpoints': {
            '/predict': 'POST - Upload an image for prediction',
            '/health': 'GET - Check API health status'
        }
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)