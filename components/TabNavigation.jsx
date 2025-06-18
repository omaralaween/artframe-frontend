import "../style/components/TabNavigation.css";

export default function TabNavigation() {
  return (
    <div className="tab-nav">
      <button className="tab-nav__btn">
        Created
      </button>

      <button className="tab-nav__btn active">
        My Gallery <span className="tab-nav__badge">302</span>
      </button>

      <button className="tab-nav__btn">
        Saved <span className="tab-nav__badge">4</span>
      </button>
    </div>
  );
}
