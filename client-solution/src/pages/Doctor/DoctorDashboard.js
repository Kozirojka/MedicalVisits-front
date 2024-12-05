import { useState } from 'react';
import '../../styles/Doctor/DoctorDashboard.css';

export default function DoctorDashboard() {
    const [activeTab, setActiveTab] = useState('pending');
    const [showUserMenu, setShowUserMenu] = useState(false);

    const tabIcons = {
        pending: '👥',
        schedule: '📅',
        patients: '📋',
    };

    const getTabLabel = (tab) => {
        const labels = {
            pending: 'Очікують',
            schedule: 'Розклад',
            patients: 'Пацієнти'
        };
        return labels[tab];
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="tabs-container">
                    {Object.entries(tabIcons).map(([tab, icon]) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                        >
                            <div>{icon}</div>
                            <div className="tab-label">{getTabLabel(tab)}</div>
                        </button>
                    ))}
                </div>

                <div className="user-profile-section">
                    <button
                        className="profile-button"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        👨‍⚕️
                    </button>

                    {showUserMenu && (
                        <div className="user-menu">
                            <div className="user-info">
                                <div className="user-name">Доктор Іванов</div>
                                <div className="user-role">Кардіолог</div>
                            </div>
                            <button className="logout-button">
                                Вийти
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="main-content">
                {activeTab === 'pending' && (
                    <div>
                        <h2>Пацієнти, що очікують підтвердження</h2>
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div>
                        <h2>Розклад прийомів</h2>
                    </div>
                )}

                {activeTab === 'patients' && (
                    <div>
                        <h2>Інформація про пацієнтів</h2>
                    </div>
                )}
            </div>
        </div>
    );
}