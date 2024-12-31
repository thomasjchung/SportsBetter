import requests
import json
from decouple import config

API_KEY = config("API_KEY")

sports_url = "https://api.the-odds-api.com/v4/sports"
sports_params = {
    "apiKey": API_KEY
}
sports_file = "sports_data.json"

def getSports():
    try:
        response = requests.get(sports_url, params = sports_params)

        print("Quota Information:")
        print(f"x-requests-remaining: {response.headers.get('x-requests-remaining', 'Not Available')}")
        print(f"x-requests-used: {response.headers.get('x-requests-used', 'Not Available')}")
        print(f"x-requests-last: {response.headers.get('x-requests-last', 'Not Available')}\n")

        if response.status_code == 200:
            sports_data = response.json()

            # Save the JSON data to a file
            with open(sports_file, "w") as file:
                json.dump(sports_data, file, indent=4)

            print("Available Sports:")
            for sport in sports_data:
                print(f"Sport: {sport['title']} Description: {sport['description']}\n")
        else:
            print(f"Failed to fetch sports. HTTP Status Code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print("An error occurred while making the API request:", e)


odds_file = "odds_data.json"
odds_url = "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds"
odds_params = {
    "apiKey": API_KEY,
    "regions": "us",
    "markets": "h2h",
}

def getOdds():
    try:
        # Make the API request
        response = requests.get(odds_url, params=odds_params)
        
        # Print quota information
        print("Quota Information:")
        print(f"x-requests-remaining: {response.headers.get('x-requests-remaining', 'Not Available')}")
        print(f"x-requests-used: {response.headers.get('x-requests-used', 'Not Available')}")
        print(f"x-requests-last: {response.headers.get('x-requests-last', 'Not Available')}\n")
        
        # Check for a successful response
        if response.status_code == 200:
            odds_data = response.json()
            
            # Save the JSON data to a file
            with open(odds_file, "w") as file:
                json.dump(odds_data, file, indent=4)
            
            # Iterate through the games in the odds data
            for game in odds_data:
                # Iterate through the bookmakers for this game
                for bookmaker in game.get('bookmakers', []):
                    print(f"  Title: {bookmaker['title']}")
                    print(f"  Last Update: {bookmaker['last_update']}")
                    
                    # Iterate through the markets for this bookmaker
                    for market in bookmaker.get('markets', []):
                        print(f"    Market: {market['key']}")
                        
                        # Iterate through the outcomes for this market
                        for outcome in market.get('outcomes', []):
                            print(f"      Name: {outcome['name']}")
                            print(f"      Price: {outcome['price']}")
                            # Check if 'point' exists and print it
                            if 'point' in outcome:
                                print(f"      Point: {outcome['point']}")
                    print()  # Add a blank line after each bookmaker
                print("-" * 40)  # Separator for games
        else:
            print(f"Failed to fetch odds. HTTP Status Code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print("An error occurred while making the API request:", e)

def find_best_odds():
    with open("odds_data.json", "r") as file:
        data = json.load(file)

    best_odds = {}

    for game in data:
        for bookmaker in game['bookmakers']:
            for market in bookmaker['markets']:
                for outcome in market['outcomes']:
                    name = outcome['name']
                    price = outcome['price']

                    if name not in best_odds or price > best_odds[name]:
                        best_odds[name] = price

    return best_odds

def calculate_arbitrage(best_odds, investment):
    with open("odds_data.json", "r") as file:
        data = json.load(file)

    for game in data:
        implied_probabilities = []

        home_team = game['home_team']
        away_team = game['away_team']

        implied_probabilities.append(1 / best_odds[home_team])
        implied_probabilities.append(1 / best_odds[away_team])
        
        total_implied_probability = sum(implied_probabilities)

        if (total_implied_probability < 1):
            print(f"Arbitrage Opportunity Found between {home_team} and {away_team}!")
            profit = (investment/total_implied_probability) - investment
            print(f"    Total profit = {profit}")
            home_team_stake = (investment * (1/best_odds[home_team])) / total_implied_probability
            away_team_stake = (investment * (1/best_odds[away_team])) / total_implied_probability
            print(f"    Bet for Home Team: {home_team_stake}")
            print(f"    Bet for Home Team: {away_team_stake}")
    
# best_odds = dictionary for best odds for every team 
best_odds = find_best_odds()
calculate_arbitrage(best_odds, 100)
