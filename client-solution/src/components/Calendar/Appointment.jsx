import React from "react";
import "./Calendar.css";

const Appointment = React.memo(({ app, onClick, onDragStart, onDragEnd }) => {
  const [startHour, startMinute] = app.start.split(":");
  const [endHour, endMinute] = app.end.split(":");
  const top =
    (parseInt(startHour, 10) * 2 + (startMinute === "30" ? 1 : 0)) * 20;
  const height =
    (parseInt(endHour, 10) * 2 +
      (endMinute === "30" ? 1 : 0) -
      (parseInt(startHour, 10) * 2 + (startMinute === "30" ? 1 : 0))) *
    20;

  return (
    <div
      className="appointment"
      style={{ top: `${top}px`, height: `${height}px` }}
      onClick={onClick}
      draggable="true"
      onDragStart={(e) => onDragStart(e, app)}
      onDragEnd={onDragEnd}
    >
      <div className="appointment-content">
        <div className="appointment-title">{app.title}</div>
        <div className="appointment-time">
          {app.start} - {app.end}
        </div>
      </div>
    </div>
  );
});

export default Appointment;