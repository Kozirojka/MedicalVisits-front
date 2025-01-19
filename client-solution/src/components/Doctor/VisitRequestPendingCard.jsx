import { formatDateTime } from "../../utils/dateUtils";
import { useState } from "react";
import "../../styles/Doctor/styleForPendingCard.css";
import "../../styles/Doctor/ScheduleCalendar.css";
import Button from '@mui/material/Button';

export default function VisitRequestCard({ request, onOpenCalendar }) {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTimeSelect = async (timeSlotId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      console.log(
        "Нагаємось відіслати вже в handleTimeSelect" +
          timeSlotId +
          "send id of visit " +
          request.id
      );

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
            VisitRequestId: request.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to assign time");

      setShowCalendarModal(false);
    } catch (error) {
      console.error("Error assigning time:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-card">
      <div className="card-header">
        <div className="header-content">
          <h3>Візит #{request.id}</h3>
          <div className="menu-dots">⋮</div>
        </div>
        <div className="patient-id">Пацієнт ID: {request.patientId}</div>
      </div>

      <div className="card-content">
        <div className="info-row">
          <span className="label">Час початку:</span>
          <span>{formatDateTime(request.dateTime)}</span>
        </div>

        <div className="info-row">
          <span className="label">Час закінчення:</span>
          <span>{formatDateTime(request.dateTimeEnd) || "Не вказано"}</span>
        </div>

        <div className="info-row">
          <span className="label">Опис:</span>
          <span>{request.description}</span>
        </div>

        <div className="info-row">
          <span className="label">Адреса:</span>
          <span>
            {request.address
              ? `${request.address.city}, ${request.address.street}, буд. ${request.address.building}, кв. ${request.address.apartment}, ${request.address.region}, ${request.address.country}`
              : "Не вказано"}
          </span>
        </div>

        <Button
            variant="contained"        
            color="primary"
          onClick={() => onOpenCalendar(request)}
        >
          Встановити час
        </Button>
      </div>
    </div>
  );
}
