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

log = getLogger(__name__)
log.info("Something interesting happened")

URL = "https://www.fridaystarters.com/college-baseball-probable-pitchers-week-7/"
page = requests.get(URL)


soup = BeautifulSoup(page.content, "html.parser")

tables = soup.findChildren('table')

data = []

def goodRecord(wins, totalGames):
    """
    Determine if a pitcher has a good record based on wins and total games played.
    """
    if (int(totalGames) > 0):
        winPercent = float(int(wins) / int(totalGames))
        if (winPercent >= .624 and totalGames > 3):
            return True
    return False

def betOrNah(pitcher1, pitcher2, stats1, stats2, game):
    """
    Check if betting is recommended based on pitcher statistics.
    """
    pitcher2ERA = 1000
    pitcher2Record = False
    pitcher1ERA = 1000
    pitcher1Record = False

    if "TBA" not in pitcher1 :
        split_record1 = stats1.split(",")[0].split("-")
        if len(split_record1) != 1:
            wins1 = int(split_record1[0])
            loss1 = int(split_record1[-1])
            totgames1 = wins1 + loss1

            pitcher1ERA = float(stats1.split(",")[2].split(" ")[1])
            pitcher1Record = goodRecord(wins1,totgames1) if int(totgames1) > 0 else False
        else:
            print("No data on" + str(pitcher1))

    if "TBA" not in pitcher2 :
        split_record2 = stats2.split(",")[0].split("-")
        if len(split_record2) != 1:
            wins2 = split_record2[0]
            loss2 = split_record2[-1]
            totgames2 = int(wins2) + int(loss2)
            pitcher2Record = goodRecord(wins2,totgames2) if totgames2 > 0 else False
            pitcher2ERA = float(stats2.split(",")[2].split(" ")[1])
        else:
            print("No data on " + str(pitcher2))   

    if (pitcher1ERA < 3 and pitcher1Record and not pitcher2Record and pitcher2ERA > 3):
        return 1
    elif (pitcher2Record and pitcher2ERA < 3 and not pitcher1Record and pitcher1ERA > 3):
        return 2
    else:
        return 0
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
            pitcher1 = str(row[0].split("  ")[0].split(" •")[0])
            pitcher2 = str(row[1].split("  ")[0].split(" •")[0])
            
            stats1 = str(row[0].split(" •")[-1].split("  ")[-1])
            stats2 = str(row[1].split(" •")[-1].split("  ")[-1])
            print("\n" + str(stats1) + "\n\n")
            bet = betOrNah(pitcher1, pitcher2, stats1, stats2, str(gameNum))
            gameNum =  gameNum + 1

            data.append({
                "team1": team1,
                "team2": team2,
                "pitcher1": pitcher1,
                "pitcher2": pitcher2,
                "stats1": stats1,
                "stats2": stats2,
                "bet": bet,
                "game": gameNum
                })


    return JsonResponse(data, safe=False)
























