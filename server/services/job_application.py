import requests
import os
import numpy as np
from cv_analysis import analyze_cv
from job_clustering import fetch_jobs, cluster_jobs
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv

load_dotenv()
class JobApplication:
    def __init__(self, user_id, cv_text, preferences):
        self.user_id = user_id
        self.cv_text = cv_text
        self.preferences = preferences

    def apply_to_jobs(self, api_key):
        try:
            # Analyze the CV text for skills, entities, and other features
            analysis_result = analyze_cv(self.cv_text)
            skills = analysis_result['extracted_skills']

            # Fetch and cluster jobs based on preferences
            jobs = fetch_jobs(self.preferences)
            clustered_jobs = self.enhanced_cluster_jobs(jobs, skills)

            # Apply to jobs using an external API
            response = self.apply_to_jobs_api(clustered_jobs, api_key)
            return response
        except Exception as e:
            raise Exception(f"Error in apply_to_jobs: {e}")

    def enhanced_cluster_jobs(self, jobs, skills):
        try:
            # Adding the extracted skills to the CV text for better matching
            combined_cv_text = f"{self.cv_text} {' '.join(skills)}"
            job_descriptions = [job['description'] for job in jobs]

            # Convert job descriptions to TF-IDF vectors
            tfidf_matrix = self.vectorize_text([combined_cv_text] + job_descriptions)
            similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])

            # Sort jobs by similarity and return in descending order
            sorted_indices = np.argsort(similarities.flatten())[::-1]
            clustered_jobs = [jobs[i] for i in sorted_indices]

            return clustered_jobs
        except Exception as e:
            raise Exception(f"Error in enhanced_cluster_jobs: {e}")

    @staticmethod
    def vectorize_text(text_list):
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
            tfidf_matrix = vectorizer.fit_transform(text_list)
            return tfidf_matrix
        except Exception as e:
            raise Exception(f"Error in vectorize_text: {e}")

    def apply_to_jobs_api(self, clustered_jobs, api_key):
        try:
            response = requests.post(
                "http://localhost:5000/api/apply-jobs",
                json={"userId": self.user_id, "jobs": clustered_jobs},
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
            )
            response.raise_for_status()  # Ensure any request errors are raised
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Error applying to jobs via API: {e}")
