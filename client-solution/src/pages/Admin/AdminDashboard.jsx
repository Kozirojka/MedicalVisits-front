import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Admin/AdminDashboard.css';
import RequestsTab from '../../components/Admin/featureTabs/RequestsTab';
import Sidebar from '../../components/Shared/Sidebar/Sidebar';

export default function AdminDashboard() {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('requests');


    const tabsConfig = [
        {
        key: 'requests',
        label: 'Очікувані запити',
        icon: 'list_alt',         
        component: <RequestsTab />
        }
    ]

    
    const handleLogout = () => {
        logout();
      };


      return (
        <div className="dashboard-container">
          <Sidebar
            tabsConfig={tabsConfig}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
          />
    
          <div className="main-content">
            {tabsConfig.map((tabItem) => {
              if (tabItem.key === activeTab) {
                return (
                  <div key={tabItem.key}>
                    {tabItem.component}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      );
    }
