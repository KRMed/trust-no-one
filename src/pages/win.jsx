import { Link, useLocation } from "react-router-dom"

export default function Win() {
  const location = useLocation();
  return (
    <div className="container">
      <div className="title win">YOU WIN</div>
      
      <div>
        <Link to="/lobby/view-responses" state={location.state} className="btn">
          Play Again
        </Link>
      </div>
    </div>
  )
}