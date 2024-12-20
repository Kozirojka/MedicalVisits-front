import { formatDateTime } from '../../utils/dateUtils';
import { useState } from 'react';
import '../../styles/Doctor/styleForPendingCard.css';
import ScheduleCalendar from './ScheduleCalendar';
import '../../styles/Doctor/ScheduleCalendar.css'


export default function VisitRequestCard({ request }) {

    const [showDoctorsModal, setShowDoctorsModal] = useState(false);
    const [nearestDoctors, setNearestDoctors] = useState([]);

    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleTimeSelect = async (timeSlotId) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            
            console.log("Нагаємось відіслати вже в handleTimeSelect" + timeSlotId
                + "send id of visit " + request.id
            );

            const response = await fetch(`http://localhost:5268/api/Doctor/assign-visit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    timeSlotId: timeSlotId,
                    VisitRequestId: request.id
                })
            });

            if (!response.ok) throw new Error('Failed to assign time');
            
            setShowCalendarModal(false);
        } catch (error) {
            console.error('Error assigning time:', error);
        } finally {
            setLoading(false);
        }
    };

   return (
       <div className="request-card">
           <div className="card-header">
               <div className="header-content">
                   <h3>Візит #{request.id}</h3>
                   <div className="menu-dots">⋮</div>
               </div>
               <div className="patient-id">
                   Пацієнт ID: {request.patientId
                    }
               </div>
           </div>

           <div className="card-content">
               {/* Дата і час початку */}
               <div className="info-row">
                   <span className="label">Час початку:</span>
                   <span>{formatDateTime(request.dateTime)}</span>
               </div>

               {/* Дата і час закінчення */}
               <div className="info-row">
                   <span className="label">Час закінчення:</span>
                   <span>{formatDateTime(request.dateTimeEnd) || 'Не вказано'}</span>
               </div>

               {/* Опис */}
               <div className="info-row">
                   <span className="label">Опис:</span>
                   <span>{request.description}</span>
               </div>

               {/* Адреса */}
               <div className="info-row">
                   <span className="label">Адреса:</span>
                   <span>
                       {request.address ? 
                           `${request.address.city}, ${request.address.street}, буд. ${request.address.building}, кв. ${request.address.apartment}, ${request.address.region}, ${request.address.country}` 
                           : 'Не вказано'}
                   </span>
               </div>

               <button 
                    className="set-time-button"
                    onClick={() => setShowCalendarModal(true)}
                >
                    Встановити час
                </button>
           </div>
                        
           {showCalendarModal && (
                <div className="modal-overlay">
                    <div className="modal-content calendar-modal">
                        <button 
                            className="close-button"
                            onClick={() => setShowCalendarModal(false)}
                        >
                            ✕
                        </button>
                        <ScheduleCalendar onTimeSelect={handleTimeSelect} />
                    </div>
                </div>
            )}
        

       </div>
   );
}   