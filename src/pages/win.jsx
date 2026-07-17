import { Link } from "react-router-dom"

export default function Win() {
  return (
    <div className="container">
      <div className="title win">YOU WIN</div>
      
      <div>
        <Link to="/lobby/view-responses" className="btn">
          Play Again
        </Link>
      </div>
    </div>
  )
}