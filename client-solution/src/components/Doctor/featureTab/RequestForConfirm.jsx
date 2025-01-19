import VisitRequestCard from '../../Doctor/VisitRequestPendingCard';

export default function RequestForConfirm({ requests, loading, error }) {
    return (
        <div>
            <h2>Пацієнти, що очікують підтвердження</h2>
            {loading && <div>Завантаження...</div>}
            {error && <div className="error-message">{error}</div>}
            <div className="requests-grid">
                {!loading && !error && requests.map(request => (
                    <VisitRequestCard
                        key={request.id}
                        request={request}
                    />
                ))}
            </div>
        </div>
    );
}
