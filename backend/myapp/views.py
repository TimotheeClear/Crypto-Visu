from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

# pip install langchain --upgrade
# Version: 0.0.164

# !pip install pypdf
# PDF Loaders. If unstructured gives you a hard time, try PyPDFLoader
import os

import re

import openai
import os
import time
import requests

import json
from bs4 import BeautifulSoup

import pandas as pd

from rest_framework import viewsets
from .models import Hero  # import your Hero model
from .serializers import HeroSerializer  # import your HeroSerializer

import requests
from bs4 import BeautifulSoup
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
import random


class HeroViewSet(viewsets.ModelViewSet):
    queryset = Hero.objects.all().order_by('name')
    serializer_class = HeroSerializer

class FetchCoinNews(APIView):
    def get(self, request, *args, **kwargs):
        try:
            coin = request.query_params.get('coin', 'bitcoin')  # Default to 'bitcoin' if no coin parameter is provided

            # Update the URL to include the specified coin
            url = f"https://www.coindesk.com/tag/{coin}/"

            response = requests.get(url)
            news_articles = []

            if response.status_code == 200:

                soup = BeautifulSoup(response.content, "html.parser")

                articles = soup.find_all('div', class_='article-cardstyles__Block-sc-q1x8lc-3 gRBmEU')
                #print(articles)
                for article in articles:
                    
                    category = article.find('h6').text
                    
                    title_element = article.find('a', class_='card-title')
                    title = title_element.text.strip()
                    link = title_element['href'].strip()

                    date = article.find('span', class_='typography__StyledTypography-sc-owin6q-0 hcIsFR').text
                    
                    description = article.find('span', class_='content-text').text.strip()
                    print("ARTICLE")
                    print(category, title, description)

                    article_data = {
                        'category': category,
                        'title': title,
                        'description': description,
                        'link': link,
                        'date': date
                    }

                    # Append the dictionary to the list of news articles
                    news_articles.append(article_data)

                return Response(news_articles)

            else:
                print("Failed to fetch news. Status code:", response.status_code)

        except Exception as e:
            print("Error fetching news:", str(e))

        return Response({"error": "Error fetching news."}, status=400)
    
class FetchCoinPrice(APIView):
    def get(self, request, *args, **kwargs):
        try:
            coin = request.query_params.get('coin', 'bitcoin')  # Default to 'bitcoin' if no coin parameter is provided
            # Update the URL to include the specified coin
            url = f"https://coinmarketcap.com/currencies/{coin}/historical-data/"
            # Send a GET request to the URL
            response = requests.get(url)

            # Check if the request was successful
            if response.status_code == 200:
                # Parse the HTML content of the page using BeautifulSoup
                soup = BeautifulSoup(response.text, 'html.parser')

                options = Options()
                options.add_argument("--headless")
                # service = Service('C:/Users/taouf/Documents/Epitech/T-DAT-901-LYO_6/backend/msedgedriver.exe')
                service = Service('C:/Users/yevtu/Documents/Epitech/T-DAT-901-LYO_6/backend/msedgedriver.exe')
                browser = webdriver.Edge(service=service, options=options)
                browser.get(url)

                # Define a custom condition to check if data has loaded
                def data_loaded(driver):
                    return "Loading data..." not in driver.page_source

                # Wait for the custom condition to be met
                wait = WebDriverWait(browser, 30)
                wait.until(data_loaded)
                button = browser.find_element(By.XPATH, "//*[@id='__next']/div[2]/div[1]/div[2]/div/div/div/div[2]/div/div[1]/div[1]/button[1]")

                try:
                    button.click()
                    print("Button clicked successfully.")
                    wait = WebDriverWait(browser, 30)
                    li_element = WebDriverWait(browser, 30).until(
                        EC.element_to_be_clickable((By.XPATH, '/html/body/div[1]/div[2]/div[1]/div[2]/div/div/div/div[2]/div/div[1]/div[2]/div/div[1]/div/div/div[1]/div[2]/ul/li[5]'))
                    )

                    try:
                        browser.execute_script("arguments[0].click();", li_element)
                        print("365 Days clicked successfully.")


                        # Find and click the "Continue" button
                        continue_button = browser.find_element(By.XPATH, "//button[contains(@class, 'bcCCXI')]")

                        try:
                            # continue_button.click()
                            
                            # Using JavaScript to click an element
                            browser.execute_script("arguments[0].click();", continue_button)

                            print("Continue button clicked successfully.")
                            
                            wait.until(data_loaded)

                            # Find the table inside the div with class "cmc-table"
                            table = browser.find_element(By.XPATH, "//table[contains(@class, 'cmc-table')]")

                            # Extract table data into a DataFrame
                            df = pd.read_html(table.get_attribute('outerHTML'))[0]

                            # # Reverse the DataFrame order
                            # df = df.iloc[::-1]

                            df = df.rename(columns={"Open*": "Open", "Close**": "Close", "Market Cap": "MarketCap" })  # Renaming "Open*" to "open"
                            list_of_dicts = df.to_dict(orient="records")
                            return Response(list_of_dicts)

                        except Exception as e:
                            print("Error clicking the button: ", str(e))

                    except Exception as e:
                        print(f"Error clicking the button: {str(e)}")

                except Exception as e:
                    print(f"Error clicking the button: {str(e)}")
            else:
                print(f"Failed to retrieve the page. Status code: {response.status_code}")   
                
        except Exception as e:
            print("Error fetching data:", str(e))

        return Response({"error": "Error fetching data."}, status=400)