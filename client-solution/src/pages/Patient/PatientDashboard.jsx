// src/pages/PatientDashboard.jsx
import { useState } from "react";
import "../../styles/Patient/PatientDashboard.css";
import Sidebar from "../../components/Shared/Sidebar/Sidebar";
import CreateVisitRequestTab from "../../components/Patient/featureTabs/CreateVisitRequestTab";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("create-visit");

  const tabsConfig = [
    {
      key: "create-visit",
      label: "Створити візит",
      icon: <LiveHelpIcon style={{ fontSize: 30, color: "#4caf50" }} />,
      component: <CreateVisitRequestTab />,
    },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar
        tabsConfig={tabsConfig}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="main-content">
        {tabsConfig.map(
          (tab) =>
            tab.key === activeTab && <div key={tab.key}>{tab.component}</div>
        )}
      </div>
    </div>
  );
}
