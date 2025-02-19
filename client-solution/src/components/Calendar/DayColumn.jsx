import React, { useState } from "react";
import Appointment from "./Appointment";
import "./Calendar.css";
 
const DayColumn = React.memo(
  ({
    day,
    appointments,
    isCreating,
    newAppointment,
    formatDate,
    convertPixelsToTime,
    onStartCreate,
    onUpdateCreate,
    onFinishCreate,
    onAppointmentClick,
    onDragAppointment,
    onHandleViewRoadmap
  }) => {
    const [gridRef, setGridRef] = useState(null);
    const [dragApp, setDragApp] = useState(null);

    const handleMouseDown = (e) => {
      if (!e.target.closest(".appointment")) {
        const rect = gridRef.getBoundingClientRect();
        const startY = e.clientY - rect.top;
        onStartCreate(startY);
      }
    };

    const handleMouseMove = (e) => {
      if (isCreating && gridRef) {
        const rect = gridRef.getBoundingClientRect();
        const endY = e.clientY - rect.top;
        onUpdateCreate(endY);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      if (dragApp) {
        const rect = gridRef.getBoundingClientRect();
        const newY = e.clientY - rect.top;
        onDragAppointment(dragApp, convertPixelsToTime(newY));
      }
    };

    return (
      <div className="day-column">
        <div className="day-header" onClick={() => onHandleViewRoadmap(day)}>{formatDate(day)}</div>
        <div
          className="day-grid"
          ref={setGridRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={onFinishCreate}
          onMouseLeave={onFinishCreate}
          onDragOver={handleDragOver}
          onDrop={onFinishCreate}
        >
          {!isCreating &&
            Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="time-slot">
                {i % 2 === 0 ? `${i / 2}:00` : `${Math.floor(i / 2)}:30`}
              </div>
            ))}

          {appointments.map((app) => (
            <Appointment
              key={app.id}
              app={app}
              onClick={() => onAppointmentClick(app)}
              onDragStart={(e, app) => {
                e.dataTransfer.setData("text/plain", app.id);
                setDragApp(app);
              }}
              onDragEnd={() => setDragApp(null)}
            />
          ))}

          {newAppointment && (
            <div
              className="appointment creating"
              style={{
                top: newAppointment.startY,
                height: newAppointment.endY - newAppointment.startY,
              }}
            >
              {convertPixelsToTime(newAppointment.startY)} -{" "}
              {convertPixelsToTime(newAppointment.endY)}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default DayColumn;