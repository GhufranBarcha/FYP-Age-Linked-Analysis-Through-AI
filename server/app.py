from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from werkzeug.utils import secure_filename
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests

# Directory to save uploaded files and spectrograms temporarily
UPLOAD_FOLDER = 'uploads'
SPECTROGRAM_FOLDER = 'spectrograms'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(SPECTROGRAM_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SPECTROGRAM_FOLDER'] = SPECTROGRAM_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Set max upload size to 16 MB

# Allowed file extensions
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'm4a', 'aac', 'flac', 'ogg'}

# Load your trained model here
model = tf.keras.models.load_model('final_model.h5')  # Update this path
class_names = ['fs', 'nt', 'se', 'tf']  # Update class names if needed

class_to_number = {
    'fs': "B",
    'nt': "D",
    'se': "C",
    'tf': "A"
}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def audio_to_spectrogram(audio_path, save_path):
    # Load the audio file
    y, sr = librosa.load(audio_path, sr=None)

    # Generate Mel spectrogram
    S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128, fmax=8000)
    S_dB = librosa.power_to_db(S, ref=np.max)

    # Plot and save the spectrogram
    plt.figure(figsize=(10, 4))
    librosa.display.specshow(S_dB, sr=sr, x_axis='time', y_axis='mel', fmax=8000)
    plt.colorbar(format='%+2.0f dB')
    plt.title('Mel-frequency spectrogram')
    plt.axis('off')
    plt.savefig(save_path, bbox_inches='tight', pad_inches=0)
    plt.close()

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No file selected for uploading"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        audio_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(audio_path)

        # Create a unique name for the spectrogram image
        spectrogram_image_name = f"{uuid.uuid4()}.png"
        spectrogram_path = os.path.join(app.config['SPECTROGRAM_FOLDER'], spectrogram_image_name)

        # Convert audio to spectrogram and save as an image
        audio_to_spectrogram(audio_path, spectrogram_path)

        # Load the spectrogram image for prediction
        img = tf.keras.utils.load_img(spectrogram_path, target_size=(200, 200))
        img_array = tf.keras.utils.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0)  # Create a batch

        # Make prediction using the loaded model
        predictions = model.predict(img_array)
        score = tf.nn.softmax(predictions[0])
        predicted_class = class_names[np.argmax(score)]
        confidence = float(100 * np.max(score))  # Convert to a Python float

        # Clean up the uploaded audio file and the spectrogram image
        os.remove(audio_path)
        os.remove(spectrogram_path)

        result = class_to_number[predicted_class]

        # Return the prediction result as JSON
        return jsonify({
            "predicted_age": result,
            "confidence": confidence
        }), 200

    return jsonify({"error": "Invalid file type. Only audio files are allowed."}), 400

if __name__ == '__main__':
    app.run(debug=True)
