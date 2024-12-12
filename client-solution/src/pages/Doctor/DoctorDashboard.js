import { useState, useEffect } from 'react'; // Додаємо useEffect
import '../../styles/Doctor/DoctorDashboard.css';
import { fetchVisitPendingRequests } from '../../services/Doctor/fetchPendingVisitRequests'; // Додаємо фігурні дужки
import VisitRequestCard from '../../components/Doctor/VisitRequestPendingCard';
import { useNavigate } from 'react-router-dom';
import ChatTab from "../../components/Doctor/ChatTab";



export default function DoctorDashboard() {
    const [activeTab, setActiveTab] = useState('pending');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    const tabIcons = {
        pending: '👥',
        schedule: '📅',
        patients: '📋',
        chat: '💬'
    };

    const getTabLabel = (tab) => {
        const labels = {
            pending: 'Очікують',
            schedule: 'Розклад',
            patients: 'Пацієнти',
            chat: 'Чат'
        };
        return labels[tab];
    };

    useEffect(() => {
      if (activeTab === 'pending') {
          handleFetchPendingRequests();
      }
  }, [activeTab]); // Запускається кожного разу, коли змінюється activeTab


    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetchPendingRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchVisitPendingRequests();
            
            console.log(data);
            setRequests(data);
        } catch (err) {
            setError('Помилка при отриманні даних');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChatOpen = () => {
        navigate('/chat-app');
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
              {loading && <div>Завантаження...</div>}
              {error && <div className="error-message">{error}</div>}
              <div className="requests-grid">
                    
              {!loading && !error && requests.map(request => {
                
                console.warn('Request without ID:', request);
                return ( 
                    <VisitRequestCard
                        key={request.id}
                        request={request}
                    />
                     );
                })}
              </div>
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

                {activeTab === "chat" && <ChatTab />}

            </div>
        </div>
    );
}