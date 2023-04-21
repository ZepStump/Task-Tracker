import { Link } from "react-router-dom";

export default function Header({ name, signOut }) {
  return (
    <div className="header">
      <h1 className="header__title">{name}'s Task Tracker</h1>
      <Link to="/">
        <button className="header__logout-btn" onClick={signOut}>
          Log Out
        </button>
      </Link>
    </div>
  );
}
