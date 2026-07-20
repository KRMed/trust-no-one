import "./leaderboard.css"
import { useNavigate } from 'react-router';
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Leaderboard(){
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then((result) => {
      if (result.error) {
        console.error(result.error.message);
        return;
      }
      if (!result.data.session) {
        console.error("session not active for some reason");
        return;
      }

      supabase
        .from("accounts")
        .select("id, username, wins")
        .order("wins", { ascending: false })
        .then((result) => {
          if (result.error) {
            console.error(result.error.message);
            return;
          }
          setLeaderboardData(result.data);
        });
    });
  }, []);

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
          {leaderboardData.map((player) => (
            <tr key={player.id}>
              <td>{player.username}</td>
              <td>{player.wins}</td>
            </tr>
          ))}
        </tbody>

        </table>

      </div>
  );

}