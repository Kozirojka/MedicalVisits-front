// VerticalCalendar.jsx
import React from 'react';
import './VerticalCalendar.css';

function VerticalCalendar({ year, month }) {
  // За замовчуванням використовуємо поточний місяць та рік, якщо не передано в пропсах
  const now = new Date();
  const currentYear = year || now.getFullYear();
  const currentMonth = typeof month === 'number' ? month : now.getMonth(); // місяці від 0 до 11

  // Визначаємо кількість днів у місяці
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Ініціалізуємо 7 колонок для кожного дня тижня
  const columns = [[], [], [], [], [], [], []];

  // Заповнюємо колонки числами відповідно до дня тижня
  for (let date = 1; date <= daysInMonth; date++) {
    const dayOfWeek = new Date(currentYear, currentMonth, date).getDay();
    columns[dayOfWeek].push(date);
  }

  const dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  return (
    <div className="vertical-calendar">
      {columns.map((colDays, dayIndex) => (
        <div className="day-column" key={dayIndex}>
          <h3>{dayNames[dayIndex]}</h3>
          {colDays.map(day => (
            <div className="day" key={day}>{day}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default VerticalCalendar;
