import { useState, useEffect } from 'react';
import VisitRequestCard from '../VisitRequestCard';
import { fetchVisitRequests } from '../../../services/Admin/adminService';
import { assignDoctorToVisit } from '../../../services/Admin/assignDoctorToVisit';


export default function RequestsTab() {
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

  useEffect(() => {
    handleFetchRequests();
  }, []);

  return (
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
        {requests.map((request) => (
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
