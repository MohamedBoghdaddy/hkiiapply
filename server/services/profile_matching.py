import spacy
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load the Spacy model
nlp = spacy.load('en_core_web_md')

def match_profile_to_job(profile, job_description):
    profile_doc = nlp(profile)
    job_doc = nlp(job_description)
    spacy_similarity = profile_doc.similarity(job_doc)
    return spacy_similarity
def match_jobs(cv_text, job_descriptions):
    # Vectorize the job descriptions and the CV text using TF-IDF
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([cv_text] + job_descriptions)
    
    # Calculate TF-IDF similarities
    tfidf_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    
    # Ensure tfidf_similarities is a NumPy array
    tfidf_similarities = np.array(tfidf_similarities)

    # Calculate Spacy similarities
    spacy_similarities = np.array([match_profile_to_job(cv_text, desc) for desc in job_descriptions])

    # Combine TF-IDF similarities with Spacy similarities
    weight_tfidf = 0.6
    weight_spacy = 0.4
    combined_similarities = (weight_tfidf * tfidf_similarities) + (weight_spacy * spacy_similarities)

    return combined_similarities

# Example usage
cv_text = "John Doe, a software engineer with expertise in Python, Java, and machine learning."
job_descriptions = [
    "Looking for a Python developer with experience in machine learning.",
    "Seeking a Java developer with experience in web development.",
    "We need a software engineer proficient in C++ and embedded systems."
]

similarities = match_jobs(cv_text, job_descriptions)
print(similarities)
