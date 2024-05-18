import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styling/College.css"; // Import the CSS file

function PitchingMatchupsTable() {
  const [pitchingMatchups, setPitchingMatchups] = useState([]);

  useEffect(() => {
    // Fetch pitching matchups data from Django backend
    axios
      .get("http://localhost:8000/myapp/pitching_matchups/")
      .then((response) => {
        setPitchingMatchups(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Process the data to group by teams and games
  const processedData = {};
  pitchingMatchups.forEach((matchup) => {
    const gameKey = `${matchup.team1}-${matchup.team2}`;
    processedData[gameKey] = processedData[gameKey] || {
      team1: matchup.team1,
      team2: matchup.team2,
      pitchers: [],
    };
    processedData[gameKey].pitchers.push({
      pitcher1: matchup.pitcher1,
      stats1: matchup.stats1,
      recentMatchups1: matchup.recentMatchups1,
      pitcher2: matchup.pitcher2,
      stats2: matchup.stats2,
      recentMatchups2: matchup.recentMatchups2,
      bet: matchup.bet, // Include the 'bet' variable
    });
  });

  // Ensure each game has exactly 3 pitchers for each team
  Object.values(processedData).forEach((game) => {
    if (game.pitchers.length < 3) {
      for (let i = game.pitchers.length; i < 3; i++) {
        game.pitchers.push({
          pitcher1: "Pitcher 1",
          stats1: "Stats 1",
          recentMatchups1: "Recent Matchups 1",
          pitcher2: "Pitcher 2",
          stats2: "Stats 2",
          recentMatchups2: "Recent Matchups 2",
          bet: 0, // Assume no bet for additional pitchers
        });
      }
    }
  });

  return (
    <div>
      <h2>Pitching Matchups</h2>
      <h3>
        Checks if the pitcher has pitched at least 3 games, with under a 3.0 ERA
        and has a winning percentage greater than 66%
      </h3>
      {Object.values(processedData).map((game) => (
        <div key={`${game.team1}-${game.team2}`} className="game-container">
          <h3 className="game-header">
            {game.team1} vs {game.team2}
          </h3>
          <table className="pitching-table">
            <thead>
              <tr>
                <th>Pitcher 1</th>
                <th>Stats 1</th>
                <th>Recent Matchups 1</th>
                <th>Pitcher 2</th>
                <th>Stats 2</th>
                <th>Recent Matchups 2</th>
              </tr>
            </thead>
            <tbody>
              {game.pitchers.slice(0, 3).map((pitcher, index) => (
                <tr key={index}>
                  <td className={pitcher.bet === 1 ? "green" : ""}>
                    {pitcher.pitcher1}
                  </td>
                  <td>{pitcher.stats1}</td>
                  <td>
                    {pitcher.recentMatchups1.split("\n").map((matchup, idx) => (
                      <div key={idx}>{matchup}</div>
                    ))}
                  </td>
                  <td className={pitcher.bet === 2 ? "green" : ""}>
                    {pitcher.pitcher2}
                  </td>
                  <td>{pitcher.stats2}</td>
                  <td>
                    {pitcher.recentMatchups2.split("\n").map((matchup, idx) => (
                      <div key={idx}>{matchup}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <footer>
        All data about pitchers from:
        <a href="https://www.fridaystarters.com/">www.fridaystarters.com</a>
      </footer>
    </div>
  );
}

export default PitchingMatchupsTable;
