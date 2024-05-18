from django.shortcuts import render

# Create your views here.
from cmath import pi
from itertools import count
from operator import contains
from tkinter.font import names
import requests
from bs4 import BeautifulSoup
import re
import pandas as pd
from django.http import JsonResponse
from logging import getLogger
from django.views.decorators.csrf import csrf_exempt
import json
from myapp.utils import *

log = getLogger(__name__)

URL = "https://www.fridaystarters.com/college-baseball-probable-pitchers-week-14/"
page = requests.get(URL)


soup = BeautifulSoup(page.content, "html.parser")

tables = soup.findChildren('table')

data = []

def scrape_pitching_matchups(request):
    for table in tables:

        # Get team names and remove tags
        teamNames = table.findChildren("th")
        team1 = str(teamNames[0]).replace("<th>", "")[:-5]
        team2 = str(teamNames[1]).replace("<th>", "")[:-5]

        # Read the table into a pandas DataFrame
        df = pd.read_html(str(table))[0]
        gameNum = 1
        for index, row in df.iterrows():

            # Lots of string cleaning cause weird formatting
            pitcher1 = str(row[0].split("  ")[0].split(" •")[0])
            pitcher2 = str(row[1].split("  ")[0].split(" •")[0])
            
            stats1 = str(row[0].split(" •")[-1].split("  ")[-1])
            stats2 = str(row[1].split(" •")[-1].split("  ")[-1])
            

            # Split Season stats from recent matchups
            recentMatchups1 = re.split(r'(?=\d{2}vs\.)', stats1)
            stats1 =recentMatchups1[0]
            # Clean up recent matchups
            recentMatchups1 = '\n'.join(recentMatchups1[1:])
            recentMatchups1 = re.sub(r'(\d+)vs\. (.+)', r'Rating: \1 vs. \2', recentMatchups1)

            # Split Season stats from recent matchups
            recentMatchups2 = re.split(r'(?=\d{2}vs\.)', stats2)
            stats2 = recentMatchups2[0]
            # Clean up recent matchups
            recentMatchups2 = '\n'.join(recentMatchups2[1:])
            recentMatchups2 = re.sub(r'(\d+)vs\. (.+)', r'Rating: \1 vs. \2', recentMatchups2)
 
            bet = betOrNah(pitcher1, pitcher2, stats1, stats2, str(gameNum))
            gameNum =  gameNum + 1

            data.append({
                "team1": team1,
                "team2": team2,
                "pitcher1": pitcher1,
                "pitcher2": pitcher2,
                "stats1": stats1,
                "stats2": stats2,
                "recentMatchups1": recentMatchups1,
                "recentMatchups2": recentMatchups2,
                "bet": bet,
                "game": gameNum
                })
            
    return JsonResponse(data, safe=False)



@csrf_exempt
def handle_selected_team(request):
    if request.method == 'POST':
        # Process the POST request data here

        #TO-DO: vs certain team, loading thing
        try:
            data = json.loads(request.body.decode('utf-8'))
            team = data.get('team')
            location = data.get('location')
            arm = data.get('arm')

            Average_URL = "https://www.statmuse.com/mlb/ask/%s-batting-average" % (team)
            Location_URL = "https://www.statmuse.com/mlb/ask/%s-batting-average-%s" % (team, location)
            Opponent_URL = "https://www.statmuse.com/mlb/ask/who-are-the-%s-playing-today" % (team)
            Arm_URL = "https://www.statmuse.com/mlb/ask/%s-batting-average-vs-%s-handed-pitchers" % (team,arm)

            # Get Batting average for the selected team
            page = requests.get(Average_URL)
            soup = BeautifulSoup(page.content, "html.parser")
            batting_average = soup.find("td",{"class":"text-right px-2 py-1"}).string

            # Get Batting average for the selected team home/away
            page = requests.get(Location_URL)
            soup = BeautifulSoup(page.content, "html.parser")
            batting_average_location = soup.find("td",{"class":"text-right px-2 py-1"}).string

            # Get Batting average for the selected team right/left pitcher
            page = requests.get(Arm_URL)
            soup = BeautifulSoup(page.content, "html.parser")
            batting_average_pitcher = soup.find("td",{"class":"text-right px-2 py-1"}).string

            #flex-1 font-semibold
            page = requests.get(Opponent_URL)
            soup = BeautifulSoup(page.content, "html.parser")
            #print(soup)
            opp_team = soup.find("p",{"class":"flex-1 font-semibold"})
            print(opp_team)

            # Example processing: print the selected team
            # Return a success response
            return JsonResponse({'message': team,
                                 'location': location,
                                 'arm': arm,
                                 'batting_average':batting_average,
                                 'batting_average_location':batting_average_location,
                                 'batting_average_pitcher':batting_average_pitcher,
                                 })
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    else:
        # Return a "Method Not Allowed" response for other request methods
        return JsonResponse({'error': 'Method Not Allowed'}, status=405)
























