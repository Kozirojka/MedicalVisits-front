import { formatDateTime } from "../../utils/dateUtils";
import "../../styles/Doctor/styleVisitRequestCard.css";
import "../../styles/Doctor/ScheduleCalendar.css";
import Button from "@mui/material/Button";

export default function VisitRequestCard({ request, onOpenCalendar }) {
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
