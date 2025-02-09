import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = () => {
  const [days, setDays] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newAppointment, setNewAppointment] = useState(null);

  const mockAppointments = [
    { id: 1, day: '2023-10-01', start: '10:00', end: '11:00', title: 'Meeting' },
    { id: 2, day: '2023-10-02', start: '14:00', end: '15:00', title: 'Lunch' },
  ];

  useEffect(() => {
    const today = new Date();
    const daysArray = Array.from({ length: 3 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
    setDays(daysArray);
    setAppointments(mockAppointments);
  }, []);

  const formatDate = (date) => 
    date.toLocaleDateString('uk-UA', { day: '2-digit', month: 'long', year: 'numeric' });

  const convertPixelsToTime = (pixels) => {
    const slotIndex = Math.floor(pixels / 20);
    const hour = Math.floor(slotIndex / 2).toString().padStart(2, '0');
    const minute = (slotIndex % 2 === 0 ? '00' : '30');
    return `${hour}:${minute}`;
  };

  const checkCollision = (day, start, end) => 
    appointments.some(app => 
      app.day === day && (
        (start >= app.start && start < app.end) ||
        (end > app.start && end <= app.end) ||
        (start <= app.start && end >= app.end)
      )
    );

  const handleCreate = (day, startY, endY) => {
    const dayString = day.toISOString().split('T')[0];
    const start = convertPixelsToTime(startY);
    const end = convertPixelsToTime(endY);
    
    if (!checkCollision(dayString, start, end)) {
      setAppointments(prev => [...prev, {
        id: prev.length + 1,
        day: dayString,
        start,
        end,
        title: 'Нова подія'
      }]);
    } else {
      alert('Час зайнятий!');
    }
  };

  return (
    <div className="calendar-container">
      <h2>Календар</h2>
      <div className="days-container">
        {days.map(day => (
          <DayColumn
            key={day.toISOString()}
            day={day}
            appointments={appointments.filter(a => a.day === day.toISOString().split('T')[0])}
            isCreating={isCreating}
            onStartCreate={(startY) => {
              setIsCreating(true);
              setNewAppointment({ day, startY, endY: startY + 20 });
            }}
            onUpdateCreate={(endY) => setNewAppointment(prev => ({
              ...prev,
              endY: Math.max(prev.startY + 20, Math.min(endY, 960))
            }))}
            onFinishCreate={() => {
              if (newAppointment) {
                handleCreate(newAppointment.day, newAppointment.startY, newAppointment.endY);
                setIsCreating(false);
                setNewAppointment(null);
              }
            }}
            newAppointment={newAppointment}
            formatDate={formatDate}
            convertPixelsToTime={convertPixelsToTime}
          />
        ))}
      </div>

      {isModalOpen && selectedAppointment && (
        <Modal appointment={selectedAppointment} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

const DayColumn = React.memo(({ 
  day, 
  appointments,
  isCreating,
  newAppointment,
  formatDate,
  convertPixelsToTime,
  onStartCreate,
  onUpdateCreate,
  onFinishCreate
}) => {
  const [gridRef, setGridRef] = useState(null);

  const handleMouseDown = (e) => {
    const rect = gridRef.getBoundingClientRect();
    const startY = e.clientY - rect.top;
    onStartCreate(startY);
  };

  const handleMouseMove = (e) => {
    if (isCreating && gridRef) {
      const rect = gridRef.getBoundingClientRect();
      const endY = e.clientY - rect.top;
      onUpdateCreate(endY);
    }
  };

  return (
    <div className="day-column">
      <div className="day-header">{formatDate(day)}</div>
      <div 
        className="day-grid"
        ref={setGridRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={onFinishCreate}
        onMouseLeave={onFinishCreate}
      >
        {!isCreating && Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="time-slot">
            {i % 2 === 0 ? `${i/2}:00` : `${Math.floor(i/2)}:30`}
          </div>
        ))}

        {appointments.map(app => (
          <Appointment key={app.id} app={app} onClick={() => {}} />
        ))}

        {newAppointment && (
          <div 
            className="appointment creating"
            style={{
              top: newAppointment.startY,
              height: newAppointment.endY - newAppointment.startY
            }}
          >
            {convertPixelsToTime(newAppointment.startY)} - {convertPixelsToTime(newAppointment.endY)}
          </div>
        )}
      </div>
    </div>
  );
});

const Appointment = React.memo(({ app, onClick }) => {
  const start = app.start.split(':');
  const top = (parseInt(start[0]) * 2 + (start[1] === '30' ? 1 : 0)) * 20;
  const height = (app.end.split(':')[0] * 2 + (app.end.split(':')[1] === '30' ? 1 : 0) - start[0] * 2 - (start[1] === '30' ? 1 : 0)) * 20;

  return (
    <div 
      className="appointment"
      style={{ top: `${top}px`, height: `${height}px` }}
      onClick={onClick}
    >
      {app.title}<br/>
      {app.start} - {app.end}
    </div>
  );
});

const Modal = ({ appointment, onClose }) => (
  <div className="modal-overlay">
    <div className="modal">
      <h3>{appointment.title}</h3>
      <p>{appointment.start} - {appointment.end}</p>
      <button onClick={onClose}>Закрити</button>
    </div>
  </div>
);

export default Calendar;