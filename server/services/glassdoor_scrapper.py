import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pymongo
import os
import time

# Get MongoDB connection string from environment variables
MONGO_URL = os.getenv('MONGO_URL')
client = pymongo.MongoClient(MONGO_URL)
db = client['job_scraping']
collection = db['glassdoor_jobs']

def scrape_glassdoor_jobs(search_query, location):
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode (no browser UI)
    chrome_options.add_argument("--disable-gpu")  # Disable GPU hardware acceleration
    chrome_options.binary_location = "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe"  # Use Brave browser

    # Path to your chromedriver executable
    service = Service('C:/Users/Moham/Downloads/chromedriver-win64/chromedriver.exe')

    # Initialize the WebDriver
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    url = f"https://www.glassdoor.com/Job/jobs.htm?sc.keyword={search_query}&locT=C&locId={location}"
    driver.get(url)

    try:
        # Wait until the job results are loaded, increase the wait time if necessary
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'jobContainer'))
        )
    except Exception as e:
        print(f"CAPTCHA encountered or page not loading: {e}")
        driver.quit()
        return []

    # Wait for dynamic content to load
    time.sleep(3)

    # Parse the page source with BeautifulSoup
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    driver.quit()

    jobs = []
    for job in soup.find_all('div', class_='jobContainer'):
        job_title = job.find('a', class_='jobLink').text.strip()
        company = job.find('div', class_='jobInfoItem jobEmpolyerName').text.strip()
        location = job.find('span', class_='subtle loc').text.strip()
        link = "https://www.glassdoor.com" + job.find('a', class_='jobLink')['href']
        jobs.append({"title": job_title, "company": company, "location": location, "link": link})

    # Insert job data into MongoDB
    if jobs:
        collection.insert_many(jobs)
        print(f"Inserted {len(jobs)} jobs into MongoDB.")
    else:
        print("No jobs found or failed to scrape.")
        
    return jobs

if __name__ == "__main__":
    # Example usage of the scrape_glassdoor_jobs function
    jobs = scrape_glassdoor_jobs("Software Engineer", "San Francisco, CA")
    print(jobs)
