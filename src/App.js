import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import moment from "moment";
import Countdown from "./components/Coutdown";
import competitions from "./enums/competitions";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MatchCard from "./components/matchCard/MatchCard";
import Loader from "./components/loader/Loader";

function App() {
  const [dataStandings, setDataStandings] = useState(null);
  const [dataTeams, setDataTeams] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComp, setIsLoadingComp] = useState(false);
  const [selectedComp, setSelectedComp] = useState("PL");
  const [lastGamePlayed, setLastGamePlayed] = useState(null);
  const [nextGame, setNextGame] = useState(null);
  const [error, setError] = useState(false);

  const apiUrl = "https://football-app-back.vercel.app";

  useEffect(() => {
    setError(false);
    const fetchData = async () => {
      try {
        // On récupère le classement de la compétition
        const responseStandings = await axios.post(apiUrl + "/standings", {
          code: selectedComp,
        });

        setDataStandings(responseStandings.data);
        // On récupère les équipes de la compétition
        const responseTeams = await axios.post(apiUrl + "/teams", {
          code: selectedComp,
        });

        setDataTeams(responseTeams.data);
        handleTeam(responseTeams.data.teams[0].id);
        setIsLoading(false);
        setIsLoadingComp(false);
      } catch (error) {
        console.log(error.response);
        // Si erreur car trop de requêtes, le countdown se déclenche
        if (error.response?.data?.message === "Too many requests") {
          setError(true);
        }
      }
    };

    fetchData();
  }, [selectedComp]);

  /**
   * Fonction permettant le changement de la compétition et un nouvel appel du useEffect
   * @param {string} code le code de la compétition
   */
  const handleComp = (code) => {
    setSelectedComp(code);
    setLastGamePlayed(null);
    setNextGame(null);
    setDataTeams(null);
    setIsLoadingComp(true);
  };

  /**
   * Fonction permettant de récupérer les matches d'une équipe
   * @param {*} id id de la team sélectionnée
   */
  const handleTeam = async (id) => {
    setError(false);
    setLastGamePlayed(null);
    setNextGame(null);
    try {
      // On récupère les matches d'une équipe en envoyant l'id au serveur
      const responseTeam = await axios.post(apiUrl + "/matches", {
        id,
      });

      const lastGamePlayedIndex = responseTeam.data.matches.findLastIndex(
        (match) => match.status === "FINISHED"
      );
      if (lastGamePlayedIndex !== -1) {
        setLastGamePlayed(responseTeam.data.matches[lastGamePlayedIndex]);
      }

      const nextGameIndex = responseTeam.data.matches.findIndex(
        (match) => match.status === "TIMED" || match.status === "SCHEDULED"
      );
      if (nextGameIndex !== -1) {
        setNextGame(responseTeam.data.matches[nextGameIndex]);
      }
    } catch (error) {
      console.log(error.response);
      // Si erreur car trop de requêtes, le countdown se déclenche
      if (error.response?.data?.message === "Too many requests") {
        setError(true);
      }
    }
  };

  /**
   * Fonction permettant de formater la date
   * @param {string} date la date à formater
   * @returns la date formatée
   */
  const formattedDate = (date) => {
    // Conversion en objet Moment
    const dateObject = moment(date);
    // Formatage de la date
    const formattedDate = dateObject.format("DD-MM-YYYY");
    return formattedDate;
  };

  return (
    <div className="container">
      <Header />
      {isLoading ? (
        <Loader />
      ) : (
        <div className="competitions">
          <div className="selections-competition-team">
            <div className="competitions-select">
              <select
                name="competitions"
                id="competition-select"
                onChange={(event) => handleComp(event.target.value)}
              >
                {competitions.map((competition, index) => {
                  return (
                    <option key={index} value={competition.code}>
                      {competition.compName}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="teams-select">
              {isLoadingComp ? (
                <Loader />
              ) : (
                dataTeams && (
                  <select
                    name="competitions"
                    id="competition-select"
                    onChange={(event) => handleTeam(event.target.value)}
                  >
                    {dataTeams.teams.map((team, index) => {
                      return (
                        <option key={index} value={team.id}>
                          {team.name}
                        </option>
                      );
                    })}
                  </select>
                )
              )}
            </div>
          </div>

          <div>{error && <Countdown />}</div>

          <div className="matches">
            {lastGamePlayed ? (
              <MatchCard
                date={formattedDate(lastGamePlayed.utcDate)}
                competition={lastGamePlayed.competition.name}
                homeTeamName={lastGamePlayed.homeTeam.name}
                homeTeamCrest={lastGamePlayed.homeTeam.crest}
                awayTeamName={lastGamePlayed.awayTeam.name}
                awayTeamCrest={lastGamePlayed.awayTeam.crest}
                scoreHome={lastGamePlayed.score.fullTime.home}
                scoreAway={lastGamePlayed.score.fullTime.away}
              />
            ) : (
              <div className="match-card-empty"></div>
            )}

            {nextGame ? (
              <MatchCard
                date={formattedDate(nextGame.utcDate)}
                competition={nextGame.competition.name}
                homeTeamName={nextGame.homeTeam.name}
                homeTeamCrest={nextGame.homeTeam.crest}
                awayTeamName={nextGame.awayTeam.name}
                awayTeamCrest={nextGame.awayTeam.crest}
              />
            ) : (
              <div className="match-card-empty"></div>
            )}
          </div>

          {dataStandings.competition.type === "LEAGUE" ? (
            <div className="standings desktop">
              <table className="results-table">
                <thead>
                  <tr className="header-row">
                    <th className="header-cell"></th>
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
                          alt={result.team.name}
                        />
                      </td>
                      <td className="team-name">
                        {result.team.name && result.team.name}
                      </td>
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
                      <td>{result.points && result.points}</td>
                      <td>{result.playedGames && result.playedGames}</td>
                      <td>{result.won && result.won}</td>
                      <td>{result.lost && result.lost}</td>
                      <td>{result.draw && result.draw}</td>
                      <td>{result.goalDifference && result.goalDifference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div></div>
          )}

          {dataStandings.competition.type === "LEAGUE" ? (
            <div className="standings mobile">
              <table className="results-table">
                <thead>
                  <tr className="header-row">
                    <th className="header-cell"></th>
                    <th></th>
                    <th className="header-cell team-column">Équipe</th>
                    <th className="header-cell">P</th>
                    <th className="header-cell">J</th>
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
                      <td className="team-name">
                        {result.team.name && result.team.name}
                      </td>
                      <td>{result.points && result.points}</td>
                      <td>{result.playedGames && result.playedGames}</td>
                      <td>{result.goalDifference && result.goalDifference}</td>
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
      <Footer />
    </div>
  );
}

export default App;
