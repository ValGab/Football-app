const MatchCard = ({
  date,
  competition,
  homeTeamName,
  homeTeamCrest,
  awayTeamName,
  awayTeamCrest,
  scoreHome,
  scoreAway,
}) => {
  return (
    <div className="match-card">
      <p>
        {scoreHome ? "Dernier match :" : "Prochain match :"} {date} -{" "}
        {competition}
      </p>
      <div className="team-match-card">
        <div className="team-logo-match-card">
          <img src={homeTeamCrest} alt={homeTeamName} />
        </div>
        <span className="team-name-match-card">{homeTeamName}</span>
        <span className="score">{scoreHome}</span>
      </div>
      <div className="team-match-card">
        <div className="team-logo-match-card">
          <img src={awayTeamCrest} alt={awayTeamName} />
        </div>
        <span className="team-name-match-card">{awayTeamName}</span>
        <span className="score">{scoreAway}</span>
      </div>
    </div>
  );
};

export default MatchCard;
