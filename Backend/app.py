from flask import Flask, jsonify, request
from helpers import RFPHelper
import os
from config import Config
app = Flask(__name__)


@app.route('/')
def hello_world():
    return jsonify(
        {
            "message": "WORKING IN PROGRESS"
        }
    )


from werkzeug.utils import secure_filename

@app.route('/upload', methods=['POST'])
def upload_rfp():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and RFPHelper().allowed_file(file.filename):
        upload_folder = Config().UPLOAD_FOLDER
        os.makedirs(upload_folder, exist_ok=True)  # Ensure folder exists

        # Use the original filename (as-is)
        filepath = os.path.join(upload_folder, file.filename)
        file.save(filepath)

        return jsonify({'message': 'File successfully uploaded', 'filepath': filepath}), 200
    else:
        return jsonify({'error': 'Invalid file format. Only PDF allowed.'}), 400

if __name__ == '__main__':
    app.run()
