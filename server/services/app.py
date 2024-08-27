import requests
import logging
import traceback
from flask import Flask, request, jsonify
from job_application import JobApplication
from text_extraction import extract_text
from cv_analysis import analyze_cv
from job_clustering import fetch_jobs, cluster_jobs
from profile_matching import match_profile_to_job

# Initialize logging
logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file:
        file_path = f"./uploads/{file.filename}"
        file.save(file_path)
        cv_text = extract_text(file_path)
        return jsonify({"message": "File uploaded successfully", "cv_text": cv_text})
    return jsonify({"error": "No file uploaded"}), 400

@app.route('/api/apply-jobs', methods=['POST'])
def apply_jobs():
    try:
        data = request.json
        user_id = data.get('user_id')
        cv_text = data.get('cv_text')
        preferences = data.get('preferences', {})
        
        # Perform a preliminary check
        if not user_id or not cv_text:
            return jsonify({"error": "user_id and cv_text are required"}), 400
        
        job_application = JobApplication(user_id, cv_text, preferences)
        results = job_application.apply_to_jobs()
        
        return jsonify(results)
    except requests.exceptions.HTTPError as http_err:
        logging.error(f"HTTP error occurred: {http_err}")
        return jsonify({"error": f"HTTP error occurred: {str(http_err)}"}), 500
    except Exception as e:
        logging.error(f"Error in apply_jobs: {e}")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze-cv', methods=['POST'])
def analyze_cv_endpoint():
    data = request.json
    cv_text = data.get('cv_text')

    if not cv_text:
        return jsonify({"error": "No CV text provided"}), 400

    analysis_result = analyze_cv(cv_text)
    return jsonify(analysis_result)

@app.route('/api/fetch-jobs', methods=['POST'])
def fetch_jobs_endpoint():
    try:
        preferences = request.json.get('preferences', {})
        jobs = fetch_jobs(preferences)
        return jsonify({"jobs": jobs})
    except Exception as e:
        logging.error(f"Error in fetch_jobs: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/cluster-jobs', methods=['POST'])
def cluster_jobs_endpoint():
    try:
        jobs = request.json.get('jobs', [])
        num_clusters = request.json.get('num_clusters', 5)
        clusters = cluster_jobs(jobs, num_clusters)
        return jsonify({"clusters": clusters})
    except Exception as e:
        logging.error(f"Error in cluster_jobs: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/match-profile', methods=['POST'])
def match_profile_endpoint():
    try:
        profile = request.json.get('profile')
        job_description = request.json.get('job_description')

        if not profile or not job_description:
            return jsonify({"error": "Profile and job description are required"}), 400

        similarity_score = match_profile_to_job(profile, job_description)
        return jsonify({"similarity_score": similarity_score})
    except Exception as e:
        logging.error(f"Error in match_profile: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
