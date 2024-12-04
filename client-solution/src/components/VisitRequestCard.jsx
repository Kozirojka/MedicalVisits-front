import { formatDateTime } from '../utils/dateUtils';

export default function VisitRequestCard({ request, onAssignDoctor }) {
   return (
       <div className="request-card">
           <div className="card-header">
               <div className="header-content">
                   <h3>Візит #{request.id}</h3>
                   <div className="menu-dots">⋮</div>
               </div>
               <div className="patient-id">
                   Пацієнт ID: {request.patienId}
               </div>
           </div>

           <div className="card-content">
               {/* Дата і час початку */}
               <div className="info-row">
                   <span className="label">Час початку:</span>
                   <span>{formatDateTime(request.dateTimeStart)}</span>
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

           <div className="card-footer">
               <span className="status-badge">Очікує</span>
               <button 
                   className="assign-doctor-button"
                   onClick={() => onAssignDoctor(request.id)}
               >
                   Призначити лікаря
               </button>
           </div>
       </div>
   );
}