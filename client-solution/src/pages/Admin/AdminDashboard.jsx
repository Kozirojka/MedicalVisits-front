import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import VisitRequestCard from '../../components/Admin/VisitRequestCard';
import { fetchVisitRequests } from '../../services/Admin/adminService';
import '../../styles/Admin/AdminDashboard.css';
import { assignDoctorToVisit } from '../../services/Admin/adminAssignDoctorToVisit';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('requests');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const tabIcons = {
        requests: '📋',
        users: '👥', 
        stats: '📊',   
    };

    const getTabLabel = (tab) => {
        const labels = {
            requests: 'Очікувані запити',
            users: 'Інформація про користувачів',
            stats: 'Статистика'
        };
        return labels[tab];
    };

    const handleFetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchVisitRequests();
            setRequests(data);
        } catch (err) {
            setError('Помилка при отриманні даних');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignDoctor = async (doctorId, visitId) => {
        setLoading(true);
        setError(null);
        try {
            await assignDoctorToVisit(doctorId, visitId);
            await handleFetchRequests();
            alert('Лікаря успішно призначено');
        } catch (err) {
            setError('Помилка при призначенні лікаря');
            console.error(err);
        } finally {
            setLoading(false);
        }
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

                <div className="user-profile">
                    <button className="profile-button" onClick={logout}>
                        👤 Вийти
                    </button>
                </div>
            </div>

            <div className="main-content">
                {activeTab === 'requests' && (
                    <div>
                        <header className="content-header">
                            <h1>Запити на візити</h1>
                            <button 
                                className="update-button"
                                onClick={handleFetchRequests}
                                disabled={loading}
                            >
                                {loading ? 'Завантаження...' : 'Оновити запити'}
                            </button>
                        </header>

                        {error && <div className="error-message">{error}</div>}

                        <div className="requests-grid">
                            {requests.map(request => (
                                <VisitRequestCard
                                    key={request.id}
                                    request={request}
                                    onAssignDoctor={handleAssignDoctor}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div>
                        <h1>Інформація про користувачів</h1>
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div>
                        <h1>Статистика</h1>
                    </div>
                )}
            </div>
        </div>
    );
}