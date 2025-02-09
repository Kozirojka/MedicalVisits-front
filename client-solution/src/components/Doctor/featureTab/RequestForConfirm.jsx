import VisitRequestCard from "../../Doctor/VisitRequestPendingCard";
import { useState } from "react";
import ScheduleCalendar from "../../Doctor/ScheduleCalendar";
import "../../../styles/Doctor/ScheduleCalendar.css";

export default function RequestForConfirm({ requests, loading, error }) {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loadingAssign, setLoadingAssign] = useState(false);

  const handleOpenCalendar = (request) => {
    setSelectedRequest(request);
    setShowCalendarModal(true);
  };

  const handleCloseCalendar = () => {
    setShowCalendarModal(false);
    setSelectedRequest(null);
  };

  const handleTimeSelect = async (timeSlotId) => {
    if (!selectedRequest) return;
    try {
      setLoadingAssign(true);
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:5268/api/Doctor/assign-visit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timeSlotId: timeSlotId,
            VisitRequestId: selectedRequest.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to assign time");

      handleCloseCalendar();
    } catch (error) {
      console.error("Error assigning time:", error);
    } finally {
      setLoadingAssign(false);
    }
  };

  return (
    <div>
      <h2>Пацієнти, що очікують підтвердження</h2>
      {loading && <div>Завантаження...</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="requests-grid">
        {!loading &&
          !error &&
          requests.map((request) => (
            <VisitRequestCard
              key={request.id}
              request={request}
              onOpenCalendar={handleOpenCalendar}
            />
          ))}
      </div>

      {showCalendarModal && (
        <div className="modal-overlay" onClick={handleCloseCalendar}>
          <div
            className={`popup ${showCalendarModal ? "visible" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h1>Обрати час</h1>
            <ScheduleCalendar onSelect={handleTimeSelect} />
            <button
              className="close-btn"
              onClick={() => setShowCalendarModal(false)}
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
