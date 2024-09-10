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
from dotenv import load_dotenv

load_dotenv()
MONGO_URL = os.getenv('MONGO_URL')
client = pymongo.MongoClient(MONGO_URL)
db = client['job_scraping']
collection = db['wazzafny_jobs']

def scrape_wazzafny_jobs(search_query, location):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.binary_location = "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe"

    service = Service('C:/Users/Moham/Downloads/chromedriver-win64/chromedriver.exe')
    driver = webdriver.Chrome(service=service, options=chrome_options)

    url = f"https://wazzafny.com/job/search?keyword={search_query}&location={location}"
    driver.get(url)

    try:
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'job-result'))
        )
    except Exception as e:
        print(f"CAPTCHA encountered or page not loading: {e}")
        driver.quit()
        return []

    time.sleep(3)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    driver.quit()

    jobs = []
    for job in soup.find_all('div', class_='job-result'):
        job_title = job.find('h2', class_='title').text.strip()
        company = job.find('div', class_='company').text.strip()
        location = job.find('span', class_='location').text.strip()
        link = job.find('a')['href']
        jobs.append({"title": job_title, "company": company, "location": location, "link": link})

    if jobs:
        collection.insert_many(jobs)
        print(f"Inserted {len(jobs)} jobs into MongoDB.")
    else:
        print("No jobs found or failed to scrape.")
        
    return jobs

if __name__ == "__main__":
    jobs = scrape_wazzafny_jobs("Marketing Manager", "Cairo, Egypt")
    print(jobs)
