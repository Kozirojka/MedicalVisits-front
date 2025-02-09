import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import './Calendar.css';

const Calendar = () => {
  const [days, setDays] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newAppointment, setNewAppointment] = useState(null);

  useEffect(() => {
    const today = new Date();
    const daysArray = Array.from({ length: 3 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
    setDays(daysArray);

    const todayString = daysArray[0].toISOString().split('T')[0];
    const tomorrowString = daysArray[1].toISOString().split('T')[0];

    const mockAppointments = [
      { id: 1, day: todayString, start: '10:00', end: '11:00', title: 'Meeting with John' },
      { id: 2, day: tomorrowString, start: '14:00', end: '15:00', title: 'Lunch with Team' },
    ];

    setAppointments(mockAppointments);
  }, []);

  const formatDate = (date) =>
    date.toLocaleDateString('uk-UA', { day: '2-digit', month: 'long', year: 'numeric' });

  const convertPixelsToTime = (pixels) => {
    const slotIndex = Math.floor(pixels / 20);
    const hour = Math.floor(slotIndex / 2).toString().padStart(2, '0');
    const minute = slotIndex % 2 === 0 ? '00' : '30';
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
      setAppointments(prev => [
        ...prev,
        {
          id: prev.length + 1,
          day: dayString,
          start,
          end,
          title: 'Нова подія'
        }
      ]);
    } else {
      alert('Час зайнятий!');
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleDeleteAppointment = () => {
    setAppointments(prev => prev.filter(a => a.id !== selectedAppointment.id));
    setIsModalOpen(false);
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
            onUpdateCreate={(endY) =>
              setNewAppointment(prev => ({
                ...prev,
                endY: Math.max(prev.startY + 20, Math.min(endY, 960))
              }))
            }
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
            onAppointmentClick={handleAppointmentClick}
          />
        ))}
      </div>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Деталі події</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <div>
              <p>
                <strong>Назва:</strong> {selectedAppointment.title}
              </p>
              <p>
                <strong>Час:</strong> {selectedAppointment.start} - {selectedAppointment.end}
              </p>
              <p>
                <strong>Дата:</strong>{' '}
                {formatDate(new Date(selectedAppointment.day))}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAppointment} color="error">
            Видалити
          </Button>
          <Button onClick={() => setIsModalOpen(false)} color="primary">
            Закрити
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

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
  }) => {
    const [gridRef, setGridRef] = useState(null);

    const handleMouseDown = (e) => {
      if (!e.target.closest('.appointment')) {
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
              {convertPixelsToTime(newAppointment.startY)} -{' '}
              {convertPixelsToTime(newAppointment.endY)}
            </div>
          )}
        </div>
      </div>
    );
  }
);

const Appointment = React.memo(({ app, onClick }) => {
  const [startHour, startMinute] = app.start.split(':');
  const [endHour, endMinute] = app.end.split(':');
  const top = (parseInt(startHour, 10) * 2 + (startMinute === '30' ? 1 : 0)) * 20;
  const height =
    ((parseInt(endHour, 10) * 2 + (endMinute === '30' ? 1 : 0)) -
      (parseInt(startHour, 10) * 2 + (startMinute === '30' ? 1 : 0))) *
    20;

  return (
    <div
      className="appointment"
      style={{ top: `${top}px`, height: `${height}px` }}
      onClick={onClick}
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

export default Calendar;
