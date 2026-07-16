import "./lobby.css"
import icon from "/person.png"

import { useEffect, useState } from "react"

export default function Lobby() {
  const [response, setResponse] = useState(null);
  const [voteTime, setVoteTime] = useState(false);

  const players = [
    { name:"[USER]"},
    { name:"[SOME AI #1]"},
    { name:"[SOME AI #2]"},
    { name:"[SOME AI #3]"},
    { name:"[SOME AI #4]"}
  ];

  useEffect(() => {
    setInterval(changeMode, 5000);
  }, []);

  function changeMode() {
    setVoteTime(true);
  }

  return (
      <div className="lobby">
        {players.map((player, idx) => {
          return (
            <div className="players" id={`player-${idx}`} key={player.name}>
              <p>{player.name}</p>
              <img className="person-icon" src={icon} alt="Icon of a person."/>
            </div>
          )
        })}
        <div className="prompt">
          <p>Hello! Prompt here...</p>
        </div>
        <div className="action">
          {voteTime
            ? <button>Continue to Vote</button>
            : <textarea />
          }
        </div>
      </div>
    )
}