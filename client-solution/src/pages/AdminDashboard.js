import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';



export default function AdminDashboard() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Помилка при виході:', error);
        }
    };


    const fetchVisitRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:5268/api/Admin/VisitsRequest', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch requests');
            }

            const data = await response.json();
            setRequests(data);
            console.log('Отримані дані:', data);
        } catch (err) {
            setError('Помилка при отриманні даних');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'Не вказано';
        const date = new Date(dateTime);
        return new Intl.DateTimeFormat('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date) + ' р.';
    };

    return (
        <div className="admin-dashboard" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px' 
            }}>
                <h1>Панель адміністратора - Запити на візити</h1>
                <button 
                    onClick={fetchVisitRequests}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                    disabled={loading}
                >
                    {loading ? 'Завантаження...' : 'Оновити запити'}
                </button>
            </header>

            {error && (
                <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#ffebee', 
                    color: '#c62828',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
                padding: '20px 0'
            }}>
                {requests.map(request => (
                    <div key={request.id} style={{
                        background: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{
                            borderBottom: '1px solid #eee',
                            paddingBottom: '10px',
                            marginBottom: '10px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3>Візит #{request.id}</h3>
                                <div style={{ cursor: 'pointer' }}>⋮</div>
                            </div>
                            <div style={{ color: '#666', fontSize: '0.9em' }}>
                                Пацієнт ID: {request.patienId}
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: '10px' }}>
                                <div style={{ color: '#666', fontSize: '0.9em' }}>Час початку:</div>
                                <div>{formatDateTime(request.dateTimeStart)}</div>
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <div style={{ color: '#666', fontSize: '0.9em' }}>Час закінчення:</div>
                                <div>{formatDateTime(request.dateTimeEnd)}</div>
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <div style={{ color: '#666', fontSize: '0.9em' }}>Опис:</div>
                                <div>{request.description}</div>
                            </div>

                            <div style={{ marginBottom: '10px' }}>
    <div style={{ color: '#666', fontSize: '0.9em' }}>Адреса:</div>
    <div>
        {request.address ? 
            `${request.address.city}, ${request.address.street}, ${request.address.building}, кв.${request.address.apartment}` 
            : 'Не вказано'}
    </div>
</div>
                        </div>

                        <div style={{
                            borderTop: '1px solid #eee',
                            paddingTop: '10px',
                            marginTop: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{
                                padding: '4px 8px',
                                backgroundColor: '#fff3e0',
                                color: '#ef6c00',
                                borderRadius: '4px',
                                fontSize: '0.9em'
                            }}>
                                Очікує
                            </span>
                            <button style={{
                                padding: '8px 16px',
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Призначити лікаря
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}