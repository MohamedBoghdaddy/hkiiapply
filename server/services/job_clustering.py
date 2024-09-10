from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import silhouette_score
from sklearn.decomposition import TruncatedSVD
from dotenv import load_dotenv

load_dotenv()


def fetch_jobs(preferences):
    """
    Fetch jobs based on user preferences.
    This function should be replaced with actual logic to fetch jobs from an API or database.
    """
    jobs = [
        {"description": "Software Engineer with Python experience in web development and cloud technologies."},
        {"description": "Data Scientist with strong knowledge of machine learning algorithms and big data technologies."},
        {"description": "Full Stack Developer proficient in JavaScript, HTML, CSS, and front-end frameworks like React or Angular."},
        {"description": "Backend Developer with expertise in Node.js, REST APIs, and database management systems."},
        {"description": "Frontend Developer experienced in building responsive UI with React and integrating with REST APIs."},
    ]
    return jobs

def optimal_clusters(tfidf_matrix, max_clusters=10):
    best_k = 2
    best_score = -1

    for k in range(2, max_clusters + 1):
        kmeans = KMeans(n_clusters=k, random_state=42)
        labels = kmeans.fit_predict(tfidf_matrix)
        score = silhouette_score(tfidf_matrix, labels)
        if score > best_score:
            best_score = score
            best_k = k

    return best_k

def cluster_jobs(jobs, num_clusters=None):
    descriptions = [job['description'] for job in jobs]

    vectorizer = TfidfVectorizer(
        stop_words='english',
        max_features=5000,
        ngram_range=(1, 2)
    )
    tfidf_matrix = vectorizer.fit_transform(descriptions)

    num_components = min(100, tfidf_matrix.shape[1])
    svd = TruncatedSVD(n_components=num_components)
    reduced_tfidf_matrix = svd.fit_transform(tfidf_matrix)

    if num_clusters is None:
        num_clusters = optimal_clusters(reduced_tfidf_matrix)

    kmeans = KMeans(n_clusters=num_clusters, random_state=42)
    clusters = kmeans.fit_predict(reduced_tfidf_matrix)

    return clusters.tolist()  # Convert ndarray to list

def group_jobs_by_cluster(jobs, clusters):
    grouped_jobs = {}
    for cluster_index, job in zip(clusters, jobs):
        if cluster_index not in grouped_jobs:
            grouped_jobs[cluster_index] = []
        grouped_jobs[cluster_index].append(job['description'])

    return grouped_jobs

# Example usage
if __name__ == "__main__":
    preferences = {"location": "Remote", "experience_level": "Senior"}
    jobs = fetch_jobs(preferences)
    clusters = cluster_jobs(jobs)
    grouped_jobs = group_jobs_by_cluster(jobs, clusters)

    for cluster, job_list in grouped_jobs.items():
        print(f"Cluster {cluster}:")
        for job in job_list:
            print(f" - {job}")

