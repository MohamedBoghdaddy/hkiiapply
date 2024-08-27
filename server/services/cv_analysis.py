import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk import pos_tag, ne_chunk
from nltk.probability import FreqDist
import spacy

# Load the spaCy model for NER and NLP
nlp = spacy.load('en_core_web_md')

# Ensure required NLTK resources are downloaded
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')
nltk.download('stopwords')

# Predefined comprehensive list of skills and keywords
expanded_skills = set([
    "Python", "Java", "JavaScript", "C++", "C#", "SQL", "NoSQL", "HTML", "CSS", 
    "React", "Angular", "Vue", "Node.js", "Express.js", "Django", "Flask", "Ruby on Rails",
    "Machine Learning", "Deep Learning", "Artificial Intelligence", "Data Science", 
    "Data Analysis", "Big Data", "Hadoop", "Spark", "TensorFlow", "Keras", "PyTorch",
    "NLP", "Natural Language Processing", "Computer Vision", "Project Management",
    "Agile", "Scrum", "Communication", "Leadership", "Team Work", "FANG", "AI",
    "Software", "Programming", "Cloud Computing", "AWS", "Azure", "GCP", "DevOps", 
    "CI/CD", "Docker", "Kubernetes", "GPA", "Fluent", "Data Mining", "Blockchain",
    "Cybersecurity", "Penetration Testing", "SaaS", "PaaS", "IaaS", "Microservices", 
    "REST", "GraphQL", "UI/UX", "User Experience", "Design Thinking"
])

def analyze_cv(cv_text):
    # Tokenization
    tokens = word_tokenize(cv_text)

    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word.lower() not in stop_words]

    # POS tagging
    pos_tags = pos_tag(tokens)

    # Named Entity Recognition (NER) using NLTK
    named_entities_nltk = ne_chunk(pos_tags)
    nltk_entities = []
    for chunk in named_entities_nltk:
        if hasattr(chunk, 'label'):
            entity = " ".join(c[0] for c in chunk)
            entity_label = chunk.label()
            nltk_entities.append((entity, entity_label))

    # Use spaCy for advanced NER and additional NLP features
    spacy_doc = nlp(cv_text)
    spacy_entities = [(ent.text, ent.label_) for ent in spacy_doc.ents]

    # Refine the extraction of skills based on the expanded list
    extracted_skills = [token for token in tokens if token in expanded_skills]

    # Frequency Distribution for the most common words (to identify key terms)
    freq_dist = FreqDist(tokens)
    most_common_terms = freq_dist.most_common(10)  # Top 10 most common terms

    # Extract noun phrases and key phrases using spaCy
    noun_chunks = [chunk.text for chunk in spacy_doc.noun_chunks]

    # Compile the analysis result
    analysis_result = {
        "tokens": tokens,
        "pos_tags": pos_tags,
        "nltk_named_entities": nltk_entities,
        "spacy_entities": spacy_entities,
        "extracted_skills": extracted_skills,
        "most_common_terms": most_common_terms,
        "noun_chunks": noun_chunks,  # Useful for extracting key phrases
    }

    return analysis_result

# Example usage
cv_text = """
John Doe is a senior software engineer with over 5 years of experience in Python, Java, and Machine Learning.
He has worked at Google, Microsoft, and Amazon. He holds a degree in Computer Science from MIT.
"""
analysis_result = analyze_cv(cv_text)
print(analysis_result)
