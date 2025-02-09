import React from "react";
import "./Sidebar.css";

const Sidebar = ({ tabsConfig, activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="sidebar">
      <div className="tabs-container">
        {tabsConfig.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`tab-button ${activeTab === tab.key ? "active" : ""}`}
          >
            <span className="material-icons tab-icon">{tab.icon}</span>
            <div className="tab-label">{tab.label}</div>
          </button>
        ))}
      </div>

      <div className="user-profile">
        <button className="profile-button" onClick={onLogout}>
          <span className="material-icons tab-icon">account_circle</span>
          <div className="profile-label">Вийти</div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
