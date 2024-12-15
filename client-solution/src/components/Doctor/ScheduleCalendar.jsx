// components/Doctor/ScheduleCalendar.jsx
import { useState, useEffect } from 'react';
import '../../styles/Doctor/ScheduleCalendar.css';

export default function ScheduleCalendar({ onTimeSelect }) {
    const [startDate, setStartDate] = useState(new Date());
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    // Функція для отримання слотів з сервера
    const fetchTimeSlots = async (week) => {
        try {

            console.log("День тижня" + week);
            const startDate = new Date('2023-12-06');

            const token = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:5268/api/Doctor/schedule/slots?startDate=${startDate.toISOString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            

            if (!response.ok) throw new Error('Failed to fetch time slots');
            const data = await response.json();
            
            console.log(data);
            
            setTimeSlots(data);
        } catch (error) {
            console.error('Error fetching time slots:', error);
        }
    };

    useEffect(() => {
        fetchTimeSlots(startDate);
    }, [startDate]);

    const navigateWeek = (direction) => {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + direction * 7);
        setStartDate(newDate);
    };

    const getNext5Days = () => {
        const days = [];
        for (let i = 0; i < 5; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            days.push(date);
        }
        return days;
    };

    return (
        <div className="calendar-card">
            <div className="calendar-header">
                <div className="calendar-title">
                    <span>Розклад прийомів</span>
                </div>
                <div className="navigation-buttons">
                    <button onClick={() => navigateWeek(-1)}>←</button>
                    <button onClick={() => navigateWeek(1)}>→</button>
                </div>
            </div>

            <div className="calendar-content">
                <div className="time-scale">
                    <div className="time-header"></div>
                    {Array.from({ length: 9 }, (_, i) => i + 9).map(hour => (
                        <div key={hour} className="time-slot">
                            {`${hour}:00`}
                        </div>
                    ))}
                </div>

                <div className="days-grid">
                    {getNext5Days().map(date => (
                        <div key={date.toISOString()} className="day-column">
                            <div className="day-header">
                                {date.toLocaleDateString('uk-UA', { weekday: 'short', day: 'numeric' })}
                            </div>
                            <div className="day-content">
                                {Array.from({ length: 9 }, (_, i) => i + 9).map(hour => {
                                    const currentSlot = timeSlots.find(slot => 
                                        new Date(slot.date).getDate() === date.getDate() && 
                                        new Date(slot.startTime).getHours() === hour
                                    );

                                    return (
                                        <div
                                            key={hour}
                                            className={`hour-slot ${currentSlot?.status || ''}`}
                                            onClick={() => currentSlot?.status === 'Available' && 
                                                onTimeSelect(currentSlot.id)}
                                        >
                                            {currentSlot?.status === 'Booked' && 'Зайнято'}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}