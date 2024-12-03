import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Помилка при виході:', error);
        }
    };

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <h1>Панель керування адміністратора</h1>
                <button 
                    onClick={handleLogout}
                    className="logout-button"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        marginLeft: 'auto'
                    }}
                >
                    Вийти
                </button>
            </header>
            
            <main className="dashboard-content" style={{
                padding: '20px',
                margin: '20px'
            }}>
                {/* В майбутньому тут можна додати адміністративний функціонал */}
                <div className="admin-controls">
                    <h2>Адміністративні функції</h2>
                    {/* Тут можна додати інші елементи керування */}
                </div>
            </main>
        </div>
    );
}