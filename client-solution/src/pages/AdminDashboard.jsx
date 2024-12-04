// src/pages/AdminDashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import VisitRequestCard from '../components/VisitRequestCard';
import { fetchVisitRequests } from '../services/adminService';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const handleAssignDoctor = (requestId) => {
        // Логіка призначення лікаря
    };

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <h1>Панель адміністратора - Запити на візити</h1>
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
    );
}