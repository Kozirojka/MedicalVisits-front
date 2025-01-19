import React, { useState } from 'react';
import './ScheduleOfVisits.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const dayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(date) {
  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
}

function ScheduleOfVisits() {
  const [selecting, setSelecting] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [selectionRange, setSelectionRange] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const weekDays = dayLabels.map((label, index) => {
    const dateObj = new Date(currentWeekStart);
    dateObj.setDate(currentWeekStart.getDate() + index);
    return { label, date: dateObj };
  });

  const onMouseDownCell = (d, h) => {
    setSelecting(true);
    setStartCell({ d, h });
    setSelectionRange([{ d, h }]);
  };

  const onMouseEnterCell = (d, h) => {
    if (!selecting || !startCell || d !== startCell.d) return;
    const start = Math.min(startCell.h, h);
    const end = Math.max(startCell.h, h);
    setSelectionRange(
      Array.from({ length: end - start + 1 }, (_, i) => ({ d, h: start + i }))
    );
  };

  const onMouseUp = () => {
    setSelecting(false);
    if (selectionRange.length && window.confirm("Створити робочий час?")) {
      const { d } = selectionRange[0];
      const start = selectionRange[0].h;
      const end = selectionRange[selectionRange.length - 1].h + 1;
      setEvents([...events, { id: Date.now(), d, start, end }]);
    }
    setSelectionRange([]);
    setStartCell(null);
  };

  const onDragStart = (e, event) => {
    e.dataTransfer.setData("eventId", event.id);
  };

  const onDropCell = (e, d, h) => {
    const id = Number(e.dataTransfer.getData("eventId"));
    const ev = events.find(ev => ev.id === id);
    if (ev) {
      const duration = ev.end - ev.start;
      const updated = { ...ev, d, start: h, end: h + duration };
      setEvents(events.map(ev => ev.id === id ? updated : ev));
    }
  };

  const changeWeek = (offset) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + offset * 7);
    setCurrentWeekStart(getStartOfWeek(newStart));
    setEvents([]); // Очищення подій при зміні тижня
  };

  const handleOpenModal = (dayObj) => {
    setSelectedDay(dayObj);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDay(null);
  };

  return (
    <div className="calendar-container" onMouseUp={onMouseUp}>
      <div className="week-nav">
        <Button variant="outlined" onClick={() => changeWeek(-1)}>Попередній тиждень</Button>
        <span>
          {formatDate(currentWeekStart)} - {formatDate(new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000))}
        </span>
        <Button variant="outlined" onClick={() => changeWeek(1)}>Наступний тиждень</Button>
      </div>
      <div className="calendar-grid">
        {weekDays.map((dayObj, d) => (
          <div key={dayObj.label} className="day-column">
            <div 
              className="day-header"
              onClick={() => handleOpenModal(dayObj)}
              style={{ cursor: 'pointer' }}
            >
              {dayObj.label} {dayObj.date.getDate()}
            </div>
            {Array.from({ length: 24 }, (_, h) => {
              const isSelected = selectionRange.some(
                cell => cell.d === d && cell.h === h
              );
              return (
                <div
                  key={h}
                  className={`time-slot ${isSelected ? 'selected' : ''}`}
                  onMouseDown={() => onMouseDownCell(d, h)}
                  onMouseEnter={() => onMouseEnterCell(d, h)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDropCell(e, d, h)}
                >
                  {events
                    .filter(ev => ev.d === d && ev.start <= h && ev.end > h)
                    .map(ev => (
                      <div
                        key={ev.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, ev)}
                        className="event"
                      >
                        Подія {ev.id}
                      </div>
                    ))
                  }
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <Dialog 
        open={modalOpen} 
        onClose={handleCloseModal} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>
          {selectedDay ? `${selectedDay.label} ${selectedDay.date.getDate()}` : 'День'}
        </DialogTitle>
        <DialogContent>
          {selectedDay && (
            <p>Деталі для {selectedDay.label} {selectedDay.date.toLocaleDateString('uk-UA')}</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained">Закрити</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ScheduleOfVisits;
