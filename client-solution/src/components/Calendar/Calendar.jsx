import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import { Button } from "@mui/material";
import { BASE_API } from "../../constants/BASE_API";
import DayColumn from "./DayColumn";
import "./Calendar.css";

const Calendar = ({visitRequestId = null}) => {
  
  const [days, setDays] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await fetch(`${BASE_API}/doctor/intervals`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        const formattedAppointments = data.map((interval) => {
          const start = new Date(interval.startInterval).toLocaleTimeString(
            "uk-UA",
            { hour: "2-digit", minute: "2-digit" }
          );
          const end = new Date(interval.endInterval).toLocaleTimeString(
            "uk-UA",
            { hour: "2-digit", minute: "2-digit" }
          );
          return {
            id: interval.id,
            day: new Date(interval.startInterval).toISOString().split("T")[0],
            start,
            end,
            title: `Зустріч з лікарем (${interval.doctor.specialization})`,
          };
        });
        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const formatDate = (date) =>
    date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const convertPixelsToTime = (pixels) => {
    const slotIndex = Math.floor(pixels / 20);
    const hour = Math.floor(slotIndex / 2)
      .toString()
      .padStart(2, "0");
    const minute = slotIndex % 2 === 0 ? "00" : "30";
    return `${hour}:${minute}`;
  };

  const handleDragAppointment = (app, newTime) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === app.id
          ? { ...a, start: newTime, end: calculateNewEnd(a.end, newTime) }
          : a
      )
    );
  };

  const calculateNewEnd = (oldEnd, newStart) => {
    const [startHours, startMinutes] = newStart.split(":").map(Number);
    const [endHours, endMinutes] = oldEnd.split(":").map(Number);
    const duration =
      endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
    let newEndHours = startHours + Math.floor(duration / 60);
    let newEndMinutes = startMinutes + (duration % 60);
    if (newEndMinutes >= 60) {
      newEndHours += 1;
      newEndMinutes -= 60;
    }
    return `${newEndHours.toString().padStart(2, "0")}:${newEndMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const checkCollision = (day, start, end) =>
    appointments.some(
      (app) =>
        app.day === day &&
        ((start >= app.start && start < app.end) ||
          (end > app.start && end <= app.end) ||
          (start <= app.start && end >= app.end))
    );

  const handleCreate = (day, startY, endY) => {
    const dayString = day.toISOString().split("T")[0];
    const start = convertPixelsToTime(startY);
    const end = convertPixelsToTime(endY);

    if (!checkCollision(dayString, start, end)) {
      setAppointments((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          day: dayString,
          start,
          end,
          title: "Нова подія",
        },
      ]);
    } else {
      alert("Час зайнятий!");
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDrawerOpen(true);
  };

  const handleDeleteAppointment = () => {
    setAppointments((prev) =>
      prev.filter((a) => a.id !== selectedAppointment.id)
    );
    setIsDrawerOpen(false);
  };

  return (
    <div className="calendar-container">
      <div className="days-container">
        {days.map((day) => (
          <DayColumn
            key={day.toISOString()}
            day={day}
            appointments={appointments.filter(
              (a) => a.day === day.toISOString().split("T")[0]
            )}
            isCreating={isCreating}
            onStartCreate={(startY) => {
              setIsCreating(true);
              setNewAppointment({ day, startY, endY: startY + 20 });
            }}
            onUpdateCreate={(endY) =>
              setNewAppointment((prev) => ({
                ...prev,
                endY: Math.max(prev.startY + 20, Math.min(endY, 960)),
              }))
            }
            onFinishCreate={() => {
              if (newAppointment) {
                handleCreate(
                  newAppointment.day,
                  newAppointment.startY,
                  newAppointment.endY
                );
                setIsCreating(false);
                setNewAppointment(null);
              }
            }}
            newAppointment={newAppointment}
            formatDate={formatDate}
            convertPixelsToTime={convertPixelsToTime}
            onAppointmentClick={handleAppointmentClick}
            onDragAppointment={handleDragAppointment}
          />
        ))}
      </div>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <div style={{ padding: 16 }}>
          {selectedAppointment && (
            <div>
              <h3>Деталі події</h3>
              <p>
                <strong>Назва:</strong> {selectedAppointment.title}
              </p>
              <p>
                <strong>Час:</strong> {selectedAppointment.start} -{" "}
                {selectedAppointment.end}
              </p>
              <p>
                <strong>Дата:</strong>{" "}
                {formatDate(new Date(selectedAppointment.day))}
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={handleDeleteAppointment}
                  color="error"
                  variant="contained"
                >
                  Видалити
                </Button>
                <Button
                  onClick={() => setIsDrawerOpen(false)}
                  color="primary"
                  variant="contained"
                  style={{ marginLeft: 8 }}
                >
                  Закрити
                </Button>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default Calendar;
