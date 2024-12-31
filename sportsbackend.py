import requests
import json
from decouple import config
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

API_KEY = config("API_KEY")
sports_url = "https://api.the-odds-api.com/v4/sports"
odds_url_template = "https://api.the-odds-api.com/v4/sports/{sport}/odds"

sports_file = "sports_data.json"
odds_file = "odds_data.json"

@app.route('/api/sports', methods=['GET'])
def getSports():
    try:
        response = requests.get(sports_url, params = {"apiKey": API_KEY})

        # print("Quota Information:")
        # print(f"x-requests-remaining: {response.headers.get('x-requests-remaining', 'Not Available')}")
        # print(f"x-requests-used: {response.headers.get('x-requests-used', 'Not Available')}")
        # print(f"x-requests-last: {response.headers.get('x-requests-last', 'Not Available')}\n")

        if response.status_code == 200:
            sports_data = response.json()

            # Save the JSON data to a file
            with open(sports_file, "w") as file:
                json.dump(sports_data, file, indent=4)

            return jsonify({
                "quota_info": {
                    "x-requests-remaining": response.headers.get('x-requests-remaining', 'Not Available'),
                    "x-requests-used": response.headers.get('x-requests-used', 'Not Available'),
                    "x-requests-last": response.headers.get('x-requests-last', 'Not Available')
                },
                "sports": sports_data
            })

            # print("Available Sports:")
            # for sport in sports_data:
            #     print(f"Sport: {sport['title']} Description: {sport['description']}\n")
        else:
            return jsonify({"error": "Failed to fetch sports", "status_code": response.status_code}), 400
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

def find_best_odds(stake):
    with open("odds_data.json", "r") as file:
        data = json.load(file)

    best_odds = {}

    home_arbitrage = []
    away_arbitrage = []

    home_bets = []
    away_bets = []

    best_bookmakers = {}

    home_bookmaker = []
    away_bookmaker = []

    total_profit = []

    for game in data:
        home_team = game['home_team']
        away_team = game['away_team']

        for bookmaker in game['bookmakers']:
            for market in bookmaker['markets']:
                for outcome in market['outcomes']:
                    name = outcome['name']
                    price = outcome['price']

                    if name not in best_odds or price > best_odds[name]:
                        best_odds[name] = price
                        best_bookmakers[name] = bookmaker['title']
        
        # Skip games without odds for either team
        if home_team not in best_odds or away_team not in best_odds:
            print(f"Skipping game: {home_team} vs {away_team} (no odds available)")
            continue

        total_implied_probability = (1 / best_odds[home_team]) + (1/best_odds[away_team])

        if (total_implied_probability < 1):
            home_arbitrage.append(home_team)
            away_arbitrage.append(away_team)

            home_bookmaker.append(best_bookmakers[home_team])
            away_bookmaker.append(best_bookmakers[away_team])

            total_profit.append((stake/total_implied_probability) - stake)

            home_bets.append((stake * (1/best_odds[home_team])) / total_implied_probability)
            away_bets.append((stake * (1/best_odds[away_team])) / total_implied_probability)

        best_odds[home_team] = 0
        best_odds[away_team] = 0

    return home_arbitrage, away_arbitrage, home_bets, away_bets, total_profit, home_bookmaker, away_bookmaker


@app.route('/api/odds', methods=['GET'])
def getOdds():
    sport = request.args.get('sport', 'basketball_nba')
    regions = request.args.get('regions', 'us')
    markets = request.args.get('markets', 'h2h')
    stake = int(request.args.get('stake', '0'))

    odds_url = odds_url_template.format(sport=sport)
    params = {
        "apiKey": API_KEY,
        "regions": regions,
        "markets": markets
    }

    try:
        # Make the API request
        response = requests.get(odds_url, params=params)
        
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
            
            home_arbitrage, away_arbitrage, home_bets, away_bets, total_profit, home_bookmaker, away_bookmaker = find_best_odds(stake)

            if home_arbitrage:
                return jsonify({
                    "home_teams": home_arbitrage,
                    "away_teams": away_arbitrage,
                    "home_bets": home_bets,
                    "away_bets": away_bets,
                    "total_profit": total_profit,
                    "home_bookmakers": home_bookmaker,
                    "away_bookmakers": away_bookmaker
                })
            else:
                return jsonify({
                    "message": "No arbitrage opportunities found."
                })
        else:
            return jsonify({"error": "Failed to fetch odds", "status_code": response.status_code}), 400
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)