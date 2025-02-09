import React, { useState, useEffect } from 'react';
import './Schedule.css';

const Schedule = () => {
  // Створюємо стан з дефолтними даними
  const [scheduleData, setScheduleData] = useState({
    day1: [
      { time: '08:00', title: 'Сніданок' },
      { time: '09:30', title: 'Зустріч з командою' },
      { time: '11:00', title: 'Рев’ю коду' },
      { time: '13:00', title: 'Обід' },
      { time: '15:00', title: 'Розробка' },
      { time: '17:00', title: 'Підсумки дня' },
    ],
    day2: [
      { time: '08:30', title: 'Ранкова зарядка' },
      { time: '18:00', title: 'Підсумки дня' },
    ]
  });

  // Стан для індикації завантаження даних з API
  const [loading, setLoading] = useState(true);

  // Отримуємо дані з API під час першого рендеру
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        // Замініть URL на ваш API endpoint
        const response = await fetch('https://example.com/api/schedule');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const apiData = await response.json();
        setScheduleData(apiData);
      } catch (error) {
        console.error('Error fetching schedule data:', error);
        // Якщо помилка, дефолтні дані залишаються або можна додати обробку помилки
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  // Стан для нової події
  const [newEvent, setNewEvent] = useState({
    day: 'day1',
    time: '',
    title: '',
  });

  const handleNewEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();

    // Перевірка обов’язкових полів
    if (!newEvent.time || !newEvent.title) {
      alert('Будь ласка, заповніть усі поля');
      return;
    }

    // Додаємо нову подію до відповідного дня
    setScheduleData((prevData) => {
      const updatedDay = [...(prevData[newEvent.day] || []), { time: newEvent.time, title: newEvent.title }];
      return {
        ...prevData,
        [newEvent.day]: updatedDay,
      };
    });

    // Очищуємо форму
    setNewEvent({
      day: 'day1',
      time: '',
      title: '',
    });
  };

  if (loading) {
    return <div>Loading schedule...</div>;
  }

  return (
    <div className="schedule-container">
      <h2>Додати нову подію</h2>
      <form onSubmit={handleAddEvent} className="event-form">
        <label>
          День:
          <select name="day" value={newEvent.day} onChange={handleNewEventChange}>
            <option value="day1">День 1</option>
            <option value="day2">День 2</option>
            <option value="day3">День 3</option>
          </select>
        </label>
        <label>
          Час:
          <input
            type="text"
            name="time"
            value={newEvent.time}
            onChange={handleNewEventChange}
            placeholder="HH:MM"
          />
        </label>
        <label>
          Назва події:
          <input
            type="text"
            name="title"
            value={newEvent.title}
            onChange={handleNewEventChange}
            placeholder="Назва події"
          />
        </label>
        <button type="submit">Додати подію</button>
      </form>

      <div className="days-container">
        {Object.keys(scheduleData).map((dayKey) => (
          <div key={dayKey} className="day-column">
            <h3 className="day-title">{dayKey.toUpperCase()}</h3>
            <div className="timeline">
              {scheduleData[dayKey].map((event, index) => (
                <div key={index} className="timeline-item">
                  <div className="event-time">{event.time}</div>
                  <div className="event-title">{event.title}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
