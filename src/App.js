import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [dataStandings, setDataStandings] = useState(null);
  const [dataTeams, setDataTeams] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const [selectedComp, setSelectedComp] = useState("PL");
  const [selectedTeam, setSelectedTeam] = useState(null);

  const urlApi = "http://localhost:3001";

  const competitions = [
    { compName: "Premier League", id: "2021", code: "PL" },
    { compName: "Bundesliga", id: "2002", code: "BL1" },
    { compName: "Primera Division", id: "2014", code: "PD" },
    { compName: "Ligue 1", id: "2015", code: "FL1" },
    { compName: "Serie A", id: "2019", code: "SA" },
    { compName: "Eredivisie", id: "2003", code: "DED" },
    { compName: "Primeira Liga", id: "2017", code: "PPL" },
    { compName: "Campeonato Brasileiro Série A", id: "2013", code: "BSA" },
    { compName: "Championship", id: "2016", code: "ELC" },
    { compName: "UEFA Champions League", id: "2001", code: "CL" },
    { compName: "Copa Libertadores", id: "2152", code: "CLI" },
    { compName: "FIFA World Cup", id: "2000", code: "WC" },
    { compName: "European Championship", id: "2018", code: "EC" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseStandings = await axios.post(urlApi + "/standings", {
          code: selectedComp,
        });
        console.log(responseStandings.data);
        setDataStandings(responseStandings.data);

        const responseTeams = await axios.post(urlApi + "/teams", {
          code: selectedComp,
        });
        setDataTeams(responseTeams.data);
        setisLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchData();
  }, [selectedComp]);

  const handleComp = (code) => {
    setSelectedComp(code);
  };

  const handleTeam = (code) => {
    setSelectedComp(code);
  };

  return (
    <div className="container">
      {isLoading ? (
        <p>En chargement</p>
      ) : (
        <div className="competitions">
          <select name="competitions" id="competition-select">
            {competitions.map((competition, index) => {
              return (
                <option
                  key={index}
                  onClick={() => handleComp(competition.code)}
                >
                  {competition.compName}
                </option>
              );
            })}
          </select>

          <select name="competitions" id="competition-select">
            {dataTeams.teams.map((team, index) => {
              return (
                <option key={index} onClick={() => handleTeam(team.id)}>
                  {team.name}
                </option>
              );
            })}
          </select>

          {dataStandings.competition.type === "LEAGUE" ? (
            <div className="standings">
              <table className="results-table">
                <thead>
                  <tr className="header-row">
                    <th className="header-cell">Position</th>
                    <th></th>
                    <th className="header-cell team-column">Équipe</th>
                    <th className="header-cell">Forme</th>
                    <th className="header-cell">Points</th>
                    <th className="header-cell">Joués</th>
                    <th className="header-cell">Gagnés</th>
                    <th className="header-cell">Perdus</th>
                    <th className="header-cell">Nuls</th>
                    <th className="header-cell">DB</th>
                  </tr>
                </thead>
                <tbody>
                  {dataStandings.standings[0].table.map((result, index) => (
                    <tr key={index} className="table-row">
                      <td>{result.position}</td>
                      <td className="container-logo">
                        <img
                          className="logo-team-table"
                          src={result.team.crest}
                          alt={result.team.shortName}
                        />
                      </td>
                      <td className="team-name">{result.team.name}</td>
                      <td>
                        <div className="form">
                          {result.form &&
                            result.form.split(",").map((element, index) => {
                              if (element === "W") {
                                return (
                                  <div
                                    key={index}
                                    className="circle victory"
                                  ></div>
                                );
                              } else if (element === "D") {
                                return (
                                  <div
                                    key={index}
                                    className="circle draw"
                                  ></div>
                                );
                              } else if (element === "L") {
                                return (
                                  <div
                                    key={index}
                                    className="circle lose"
                                  ></div>
                                );
                              } else {
                                return null;
                              }
                            })}
                        </div>
                      </td>
                      <td>{result.points}</td>
                      <td>{result.playedGames}</td>
                      <td>{result.won}</td>
                      <td>{result.lost}</td>
                      <td>{result.draw}</td>
                      <td>{result.goalDifference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
