import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import { Button } from "@mui/material";
import { BASE_API } from "../../constants/BASE_API";
import DayColumn from "./DayColumn";
import "./Calendar.css";
import RoadMap from "../Map/RoadMap";

const Calendar = ({ visitRequestId = null }) => {
  const [days, setDays] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newAppointment, setNewAppointment] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

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

  const combineDateTime = (dateStr, timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    const date = new Date(dateStr);
    date.setUTCHours(hours, minutes, 0, 0);

    return date.toISOString();
  };

  const handleCreate = (day, startY, endY) => {
    const dayString = day.toISOString();
    const start = convertPixelsToTime(startY);
    const end = convertPixelsToTime(endY);

    if (!checkCollision(dayString, start, end)) {
      setAppointmentDetails({
        day: dayString,
        startData: combineDateTime(dayString, start),
        endData: combineDateTime(dayString, end),
      });
      setShowConfirmationModal(true);
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

  const handleOpenCalendar = (day) => {
    console.log(day);

    const year = day.getFullYear();
    const month = day.getMonth();
    const date = day.getDate();

    const formattedDay = new Date(Date.UTC(year, month, date, 1, 0, 0));

    console.log(formattedDay.toISOString());

    setSelectedDay(formattedDay.toISOString());
    setShowCalendarModal(true);
  };

  const handleCloseCalendar = () => {
    setShowCalendarModal(false);
  };

  const createAppointment = () => {
    if (visitRequestId) {
      const { day, ...filteredDetails } = appointmentDetails;

      fetch(`${BASE_API}/doctor/interval`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitRequestId: visitRequestId,
          ...filteredDetails,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to confirm appointment");
          }
          console.log("Appointment confirmed");
        })
        .catch((error) => {
          console.error("Error confirming appointment:", error);
        });
    }
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
            onHandleViewRoadmap={handleOpenCalendar}
          />
        ))}
      </div>

      {showCalendarModal && (
        <div className="modal-overlay" onClick={handleCloseCalendar}>
          <div
            className={`popup ${showCalendarModal ? "visible" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <RoadMap selectedDay={selectedDay}/>
            <button
              className="close-btn"
              onClick={() => setShowCalendarModal(false)}
            >
              Закрити
            </button>
          </div>
        </div>
      )}

      {showConfirmationModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowConfirmationModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Підтвердження створення для візиту {visitRequestId}</h3>
            <p>
              Ви впевнені, що хочете створити цей відрізок для запиту на
              допомогу?
            </p>
            <p>Дата: {appointmentDetails.day}</p>
            <p>
              Час: {appointmentDetails.start} - {appointmentDetails.end}
            </p>
            <button onClick={() => createAppointment()}>Так</button>
            <button onClick={() => setShowConfirmationModal(false)}>Ні</button>
          </div>
        </div>
      )}

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
