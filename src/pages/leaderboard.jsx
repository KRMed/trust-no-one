import "./leaderboard.css"
import { useNavigate } from 'react-router';

export default function Leaderboard(){
  const navigate = useNavigate()
  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <button className="back-button" onClick={() => navigate("/start-game")}>
        Go Back
        </button>
        <h1>Leaderboard</h1>
      </div>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Wins</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>i_am_number_one</td>
            <td>10000000000000000</td>
          </tr>
          <tr>
            <td>what</td>
            <td>10</td>
          </tr>
        </tbody>

        </table>

      </div>
  );

}