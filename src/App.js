import { useEffect, useState } from "react";
import "./App.css";
import moment from "moment";
import Countdown from "./components/Coutdown";
import competitions from "./enums/competitions";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MatchCard from "./components/matchCard/MatchCard";
import Loader from "./components/loader/Loader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = "https://football-app-back.vercel.app";

// Fetch API functions
const fetchStandings = async (code) => {
  const res = await axios.post(`${apiUrl}/standings`, { code });
  return res.data;
};

const fetchTeams = async (code) => {
  const res = await axios.post(`${apiUrl}/teams`, { code });
  return res.data;
};

const fetchMatches = async (id) => {
  const res = await axios.post(`${apiUrl}/matches`, { id });
  return res.data;
};

function App() {
  const [selectedComp, setSelectedComp] = useState("PL");
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Standings query
  const {
    data: dataStandings,
    isLoading: loadingStandings,
    isError: errorStandings,
  } = useQuery({
    queryKey: ["standings", selectedComp],
    queryFn: () => fetchStandings(selectedComp),
    keepPreviousData: true,
  });

  // Teams query
  const {
    data: dataTeams,
    isLoading: loadingTeams,
    isError: errorTeams,
  } = useQuery({
    queryKey: ["teams", selectedComp],
    queryFn: () => fetchTeams(selectedComp),
    keepPreviousData: true,
    onSuccess: (data) => {
      if (!selectedTeam) setSelectedTeam(data.teams[0].id);
    },
  });

  // Matches query
  const { data: dataMatches, isError: errorMatches } = useQuery({
    queryKey: ["matches", selectedTeam],
    queryFn: () => fetchMatches(selectedTeam),
    enabled: !!selectedTeam,
  });

  // **Effet pour sélectionner la première équipe dès que les données sont chargées**
  useEffect(() => {
    if (dataTeams && dataTeams.teams.length > 0 && !selectedTeam) {
      setSelectedTeam(dataTeams.teams[0].id);
    }
  }, [dataTeams, selectedTeam]);

  const lastGamePlayed =
    dataMatches?.matches.findLast((match) => match.status === "FINISHED") ||
    null;

  const nextGame =
    dataMatches?.matches.find(
      (match) => match.status === "TIMED" || match.status === "SCHEDULED"
    ) || null;

  const handleComp = (code) => {
    setSelectedComp(code);
    setSelectedTeam(null);
  };

  const handleTeam = (id) => setSelectedTeam(id);

  const formattedDate = (date) => moment(date).format("DD-MM-YYYY");

  const isLoading = loadingStandings || loadingTeams;
  const isError = errorStandings || errorTeams || errorMatches;

  return (
    <div className="container">
      <Header />
      <main>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="competitions">
            <div className="selections-competition-team">
              <div className="competitions-select">
                <select
                  value={selectedComp}
                  onChange={(e) => handleComp(e.target.value)}
                >
                  {competitions.map((competition, index) => (
                    <option key={index} value={competition.code}>
                      {competition.compName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="teams-select">
                {loadingTeams ? (
                  <Loader />
                ) : (
                  dataTeams && (
                    <select
                      value={selectedTeam || ""}
                      onChange={(e) => handleTeam(e.target.value)}
                    >
                      {dataTeams.teams.map((team, index) => (
                        <option key={index} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  )
                )}
              </div>
            </div>

            {isError && <Countdown />}

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

            {dataStandings?.competition.type === "LEAGUE" && (
              <>
                {/* Desktop */}
                <div className="standings desktop">
                  <table className="results-table">
                    <thead>
                      <tr className="header-row">
                        <th className="header-cell"></th>
                        <th></th>
                        <th className="header-cell team-column">Équipe</th>
                        <th className="header-cell">Points</th>
                        <th className="header-cell">Joués</th>
                        <th className="header-cell">Gagnés</th>
                        <th className="header-cell">Nuls</th>
                        <th className="header-cell">Perdus</th>
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
                          <td className="team-name">{result.team.name}</td>
                          <td>{result.points}</td>
                          <td>{result.playedGames}</td>
                          <td>{result.won}</td>
                          <td>{result.draw}</td>
                          <td>{result.lost}</td>
                          <td>{result.goalDifference}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
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
                              alt={result.team.name}
                            />
                          </td>
                          <td className="team-name">{result.team.name}</td>
                          <td>{result.points}</td>
                          <td>{result.playedGames}</td>
                          <td>{result.goalDifference}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
