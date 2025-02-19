import {useState, useEffect} from 'react';
import fetchRoadMap from '../../services/Map/fetchRoadMap';

const RoadMap = (selectedDay) => {
    const [roadMap, setRoadMap] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetchRoadMap = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchRoadMap(selectedDay);

            console.log(data);

            
            setRoadMap(data);
        } catch (err) {
            setError('Помилка при отриманні даних');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetchRoadMap();
    }, [selectedDay]);

    return (
        <div>
            <header className="content-header">
                {console.log(selectedDay)}
                <h1>Маршрут</h1>
                <button
                    className="update-button"
                    onClick={handleFetchRoadMap}
                    disabled={loading}
                >
                    {loading ? 'Завантаження...' : 'Оновити маршрут'}
                </button>
            </header>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
}


export default RoadMap;