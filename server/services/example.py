import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Path to your Brave browser
brave_path = "/path/to/brave/browser"

# Path to your Chromedriver
chrome_options.binary_location = "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe"  # Path to Brave

chrome_options = Options()
chrome_options.binary_location = brave_path  # Point to Brave Browser

chrome_options.add_argument("--headless")  # Run headless if you don't need a browser UI
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")  # This may be needed if running on a Linux server
chrome_options.add_argument("--disable-dev-shm-usage")  # This may be needed if running on a Linux server

service = Service(chromedriver_path)
driver = webdriver.Chrome(service=service, options=chrome_options)

# Example of visiting a website
driver.get("https://wazzafny.com")

# Perform your scraping tasks...
