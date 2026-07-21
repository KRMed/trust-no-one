import { Link, useLocation } from "react-router-dom"
import "./win-or-lose.css"

export default function Win() {
  const location = useLocation();
  return (
    <div className="container">
      <div className="title win">YOU WIN</div>
      
      <div>
        <Link to="/start-game" state={location.state} className="btn">
          Play Again
        </Link>
      </div>
    </div>
  )
}