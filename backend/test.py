from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from bs4 import BeautifulSoup
import pandas as pd
from selenium.webdriver.chrome.options import Options
import requests
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options

try:

    # List of strings
    # string_list = ["bitcoin", "ethereum", "bnb", "xrp", "solana"]

    #coin = request.query_params.get('coin', 'bitcoin')  # Default to 'bitcoin' if no coin parameter is provided
    coin = 'bitcoin'
    # Update the URL to include the specified coin
    url = f"https://coinmarketcap.com/currencies/{coin}/historical-data/"
    # Send a GET request to the URL
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content of the page using BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find the div with class "history"
        history_div = soup.find('div', class_='main-content')

        options = Options()
        # options.add_argument("--headless")
        service = Service('C:\Projets\Tools\edgedriver_win64\msedgedriver.exe')
        browser = webdriver.Edge(service=service, options=options)
        browser.get(url)

        # Define a custom condition to check if data has loaded
        def data_loaded(driver):
            return "Loading data..." not in driver.page_source

        # Wait for the custom condition to be met
        wait = WebDriverWait(browser, 30)
        wait.until(data_loaded)
        #button_class = "sc-f70bb44c-0 iQEJet BaseButton_base__aMbeB BaseButton_t-default__fZuC3 BaseButton_size-md__jbSJR BaseButton_v-tertiary___qgax BaseButton_vd__2Cn0v"
        button = browser.find_element(By.XPATH, "//*[@id='__next']/div[2]/div[1]/div[2]/div/div/div/div[2]/div/div[1]/div[1]/button[1]")

        try:
            button.click()
            print("Button clicked successfully.")
            wait = WebDriverWait(browser, 30)
            # Find and click the "li" element by full xpath: /html/body/div[1]/div[2]/div[1]/div[2]/div/div/div/div[2]/div/div[1]/div[2]/div/div[1]/div/div/div[1]/div[2]/ul/li[5]
            li_element = WebDriverWait(browser, 30).until(
                EC.element_to_be_clickable((By.XPATH, '/html/body/div[1]/div[2]/div[1]/div[2]/div/div/div/div[2]/div/div[1]/div[2]/div/div[1]/div/div/div[1]/div[2]/ul/li[5]'))
            )
            
            # try:
            #     reject_cookies_button = browser.find_element(By.ID, "onetrust-reject-all-handler")
            #     reject_cookies_button.click()
            #     print("Dismissed cookie settings.")
            # except Exception as e:
            #     print("Error dismissing cookie settings:", str(e))


            try:
                # li_element.click()
                browser.execute_script("arguments[0].click();", li_element)
                print("365 Days clicked successfully.")

                # Find and click the "Continue" button
                # continue_button = browser.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[1]/div[2]/div/div/div/div[2]/div/div[1]/div[2]/div/div[1]/div/div/div[1]/div[2]/ul/li[5]')
                continue_button = browser.find_element(By.XPATH, "//button[contains(@class, 'bcCCXI')]")


                try:

                    # continue_button = browser.find_element(By.XPATH, '/html/body/div[7]/div/div[2]/div/div[2]/span/button')
                    continue_button.click()
                    
                    print("Continue button clicked successfully.")
                    
                    wait.until(data_loaded)

                    # Find the table inside the div with class "cmc-table"
                    table = browser.find_element(By.XPATH, "//table[contains(@class, 'cmc-table')]")

                    # Extract table data into a DataFrame
                    df = pd.read_html(table.get_attribute('outerHTML'))[0]

                    # # Reverse the DataFrame order
                    # df = df.iloc[::-1]

                    # # Save the DataFrame to a CSV file
                    # df.to_csv('test_price_history.csv', index=False)
                    # print("Data has been successfully scraped and saved to 'ethereum_price_history.csv'.")

                    df = df.rename(columns={"Open*": "Open", "Close**": "Close", "Market Cap": "MarketCap" })  # Renaming "Open*" to "open"
                    import pandas as pd
                    df_to_csv = df.to_csv('test_price_history.csv', index=False)
                    list_of_dicts = df.to_dict(orient="records")
                    print(list_of_dicts)

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
