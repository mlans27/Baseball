import React, { useState } from "react";
import axios from "axios";
import "../styling/MLB.css"; // Import CSS file

function TeamDropdown() {
  const teams = [
    { id: 1, name: "Arizona Diamondbacks" },
    { id: 2, name: "Atlanta Braves" },
    { id: 3, name: "Baltimore Orioles" },
    { id: 4, name: "Boston Red Sox" },
    { id: 5, name: "Chicago White Sox" },
    { id: 6, name: "Chicago Cubs" },
    { id: 7, name: "Cincinnati Reds" },
    { id: 8, name: "Cleveland Guardians" },
    { id: 9, name: "Colorado Rockies" },
    { id: 10, name: "Detroit Tigers" },
    { id: 11, name: "Houston Astros" },
    { id: 12, name: "Kansas City Royals" },
    { id: 13, name: "Los Angeles Angels" },
    { id: 14, name: "Los Angeles Dodgers" },
    { id: 15, name: "Miami Marlins" },
    { id: 16, name: "Milwaukee Brewers" },
    { id: 17, name: "Minnesota Twins" },
    { id: 18, name: "New York Yankees" },
    { id: 19, name: "New York Mets" },
    { id: 20, name: "Oakland Athletics" },
    { id: 21, name: "Philadelphia Phillies" },
    { id: 22, name: "Pittsburgh Pirates" },
    { id: 23, name: "San Diego Padres" },
    { id: 24, name: "San Francisco Giants" },
    { id: 25, name: "Seattle Mariners" },
    { id: 26, name: "St. Louis Cardinals" },
    { id: 27, name: "Tampa Bay Rays" },
    { id: 28, name: "Texas Rangers" },
    { id: 29, name: "Toronto Blue Jays" },
    { id: 30, name: "Washington Nationals" },
  ];

  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedPitcher, setSelectedPitcher] = useState("");

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handlePitcherChange = (event) => {
    setSelectedPitcher(event.target.value);
  };
  //const [battingAverage, setBattingAverage] = useState("");

  //const [battingAverageLocation, setBattingAverageLocation] = useState("");

  const [tableData, setTableData] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Send the selected team and location to the backend
    axios
      .post("http://18.219.235.20:8000/myapp/selected-team/", {
        team: selectedTeam,
        location: selectedLocation,
        arm: selectedPitcher,
      })
      .then((response) => {
        console.log("Response from backend:", response.data);
        const {
          message,
          location,
          arm,
          batting_average,
          batting_average_location,
          batting_average_pitcher,
        } = response.data;

        console.log("Selected Team:", message);

        console.log("Selected Location:", location);
        console.log("Selected arm:", arm);

        console.log("Batting Average:", batting_average);

        console.log("Batting Average Location:", batting_average_location);
        console.log("Batting Average right/left:", batting_average_pitcher);

        // Update table data

        setTableData([
          {
            team: message,
            location,
            arm,
            batting_average,
            batting_average_location,
            batting_average_pitcher,
          },
        ]);
        // Handle the response data as needed
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        // Handle error if needed
      });
  };

  return (
    <div>
      <h3>
        Choose a team, if they are home or away, and if they are facing a right
        or left handed pitcher
      </h3>
      <h3>
        Then see how their overall average stacks up against todays matchup
      </h3>
      <div className="team-dropdown-container">
        <form onSubmit={handleSubmit} className="team-dropdown-form">
          <div className="div-spacing">
            <label htmlFor="team-select">Select a team:</label>
            <select
              id="team-select"
              value={selectedTeam}
              onChange={handleTeamChange}
              className="team-dropdown-select"
            >
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div className="div-spacing">
            <label htmlFor="location-select">Select location:</label>
            <select
              id="location-select"
              value={selectedLocation}
              onChange={handleLocationChange}
              className="team-dropdown-select"
            >
              <option value="">Select location</option>
              <option value="Home">Home</option>
              <option value="Away">Away</option>
            </select>
          </div>
          <div className="div-spacing">
            <label htmlFor="pitcher-select">Select Pithcer Arm:</label>
            <select
              id="pitcher-select"
              value={selectedPitcher}
              onChange={handlePitcherChange}
              className="team-dropdown-select"
            >
              <option value="">Righty Or Lefty</option>
              <option value="Right">Right</option>
              <option value="Left">Left</option>
            </select>
          </div>
          <button type="submit" className="team-dropdown-submit">
            Submit
          </button>
        </form>

        <table className="team-info-table">
          <thead>
            {tableData.map((rowData, index) => (
              <tr key={index}>
                <th>Team</th>
                <th>Location</th>
                <th>Team Batting Average</th>
                <th>Team Batting Average {rowData.location}</th>
                <th>Team Batting Average vs. {rowData.arm}</th>
              </tr>
            ))}
          </thead>
          <tbody>
            {tableData.map((rowData, index) => (
              <tr key={index}>
                <td>{rowData.team}</td>
                <td>{rowData.location}</td>
                <td>{rowData.batting_average}</td>
                <td
                  className={
                    rowData.batting_average_location > rowData.batting_average
                      ? "green-cell"
                      : rowData.batting_average_location <
                        rowData.batting_average
                      ? "red-cell"
                      : ""
                  }
                >
                  {rowData.batting_average_location}
                </td>
                <td
                  className={
                    rowData.batting_average_pitcher > rowData.batting_average
                      ? "green-cell"
                      : rowData.batting_average_pitcher <
                        rowData.batting_average
                      ? "red-cell"
                      : ""
                  }
                >
                  {rowData.batting_average_pitcher}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeamDropdown;
