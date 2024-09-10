import os
import requests
import logging
import traceback
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from job_application import JobApplication
from text_extraction import extract_text
from cv_analysis import analyze_cv
from job_clustering import fetch_jobs, cluster_jobs
from profile_matching import match_profile_to_job

# Load environment variables from the .env file
load_dotenv()

# Initialize logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Initialize Flask app
app = Flask(__name__)

# Ensure upload directory exists
UPLOAD_FOLDER = './uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Retrieve API key from environment
anthropics_api_key = os.getenv('ANTHROPICS_API_KEY')

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            logging.error("No file part in the request")
            return jsonify({"error": "No file part in the request"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            logging.error("No selected file")
            return jsonify({"error": "No file selected"}), 400

        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            cv_text = extract_text(file_path)
            
            # Remove file after processing (optional for file cleanup)
            os.remove(file_path)

            return jsonify({"message": "File uploaded successfully", "cv_text": cv_text}), 200
    except Exception as e:
        logging.error(f"Error in upload_file: {e}")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/apply-jobs', methods=['POST'])
def apply_jobs():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid JSON data"}), 400

        user_id = data.get('user_id')
        cv_text = data.get('cv_text')
        preferences = data.get('preferences', {})
        
        if not user_id or not cv_text:
            logging.error("user_id and cv_text are required")
            return jsonify({"error": "user_id and cv_text are required"}), 400
        
        job_application = JobApplication(user_id, cv_text, preferences)
        results = job_application.apply_to_jobs(api_key=anthropics_api_key)

        return jsonify(results), 200
    except requests.exceptions.HTTPError as http_err:
        logging.error(f"HTTP error occurred: {http_err}")
        return jsonify({"error": f"HTTP error occurred: {str(http_err)}"}), 500
    except Exception as e:
        logging.error(f"Error in apply_jobs: {e}")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze-cv', methods=['POST'])
def analyze_cv_endpoint():
    try:
        data = request.json
        if not data or 'cv_text' not in data:
            logging.error("No CV text provided")
            return jsonify({"error": "No CV text provided"}), 400

        analysis_result = analyze_cv(data['cv_text'])
        return jsonify(analysis_result), 200
    except Exception as e:
        logging.error(f"Error in analyze_cv: {e}")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/fetch-jobs', methods=['POST'])
def fetch_jobs_endpoint():
    try:
        preferences = request.json.get('preferences', {})
        jobs = fetch_jobs(preferences)
        return jsonify({"jobs": jobs}), 200
    except Exception as e:
        logging.error(f"Error in fetch_jobs: {e}")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/cluster-jobs', methods=['POST'])
def cluster_jobs_endpoint():
    try:
        jobs = request.json.get('jobs', [])
        num_clusters = request.json.get('num_clusters', 5)
        clusters = cluster_jobs(jobs, num_clusters)
        return jsonify({"clusters": clusters}), 200
    except Exception as e:
        logging.error(f"Error in cluster_jobs: {e}")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/match-profile', methods=['POST'])
def match_profile_endpoint():
    try:
        profile = request.json.get('profile')
        job_description = request.json.get('job_description')

        if not profile or not job_description:
            logging.error("Profile and job description are required")
            return jsonify({"error": "Profile and job description are required"}), 400

        similarity_score = match_profile_to_job(profile, job_description)
        return jsonify({"similarity_score": similarity_score}), 200
    except Exception as e:
        logging.error(f"Error in match_profile: {e}")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=False)  # Disable debug mode
