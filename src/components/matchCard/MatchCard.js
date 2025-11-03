import moment from "moment";
import "./matchCard.css";

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
  const formattedDate = () => moment(date).format("DD-MM-YYYY");

  const gameDate = new Date(date);
  const today = new Date();

  return (
    <div className="match-card">
      <p>
        {today > gameDate ? "Dernier match :" : "Prochain match :"}{" "}
        {formattedDate()}
      </p>
      <p>{competition}</p>
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
