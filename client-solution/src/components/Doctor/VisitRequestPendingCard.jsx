import { formatDateTime } from '../../utils/dateUtils';
import { useState } from 'react';
import '../../styles/Doctor/styleForPendingCard.css';


export default function VisitRequestCard({ request }) {

    const [showDoctorsModal, setShowDoctorsModal] = useState(false);
    const [nearestDoctors, setNearestDoctors] = useState([]);
    const [loading, setLoading] = useState(false);

    

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
           </div>

        

       </div>
   );
}   