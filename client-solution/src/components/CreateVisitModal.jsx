import { useState } from 'react';

// Функція для відправки запиту на сервер
async function createVisitRequest(visitData) {
   try {

        visitData.dateTime = new Date(visitData.dateTime).toISOString();
        visitData.dateTimeEnd = new Date(visitData.dateTimeEnd).toISOString();


       const token = localStorage.getItem('accessToken');
       console.log('Дані, які надсилаються:', visitData);
       console.log(token);
       const response = await fetch('http://localhost:5268/api/Patient/request', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
           },
           body: JSON.stringify(visitData)
       });

       if (!response.ok) {
           throw new Error('Помилка при створенні запиту');
       }

       return await response.json();

   } catch (error) {
       console.error('Помилка:', error);
       throw error;
   }
}

export default function CreateVisitModal({ isOpen, onClose }) {
   // Стани для управління формою та процесом відправки
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(null);
   
   // Стан для зберігання даних форми
   const [visitData, setVisitData] = useState({
       dateTime: '',
       dateTimeEnd: '',
       description: '',
       address: '', // Нове поле
       isRegular: false, // Нове поле
       hasMedicine: false,
       requiredMedications: ''
   });

   // Обробник змін в полях форми
   const handleInputChange = (e) => {
       const { name, value, type, checked } = e.target;
       setVisitData(prev => ({
           ...prev,
           [name]: type === 'checkbox' ? checked : value
       }));
   };

   // Обробник відправки форми
   const handleSubmit = async (e) => {
       e.preventDefault();
       setIsLoading(true);
       setError(null);

       try {
           await createVisitRequest(visitData);
           onClose();
           alert('Запит створено успішно!');
       } catch (error) {
           setError('Не вдалося створити запит. Спробуйте пізніше.');
       } finally {
           setIsLoading(false);
       }
   };

   if (!isOpen) return null;

   return (
       <div className="modal-overlay" onClick={onClose}>
           <div className="modal-content" onClick={e => e.stopPropagation()}>
               <h2>Create Visit Request</h2>
               
               {error && (
                   <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                       {error}
                   </div>
               )}
               
               <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                   {/* DateTime Start */}
                   <div className="form-group">
                       <label htmlFor="dateTime">Start Date and Time:</label>
                       <input
                           type="datetime-local"
                           id="dateTime"
                           name="dateTime"
                           value={visitData.dateTime}
                           onChange={handleInputChange}
                           required
                           style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                       />
                   </div>

                   {/* DateTime End */}
                   <div className="form-group">
                       <label htmlFor="dateTimeEnd">End Date and Time:</label>
                       <input
                           type="datetime-local"
                           id="dateTimeEnd"
                           name="dateTimeEnd"
                           value={visitData.dateTimeEnd}
                           onChange={handleInputChange}
                           required
                           style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                       />
                   </div>

                    {/* Address */}
                    <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={visitData.address}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                    </div>

                    {/*Is regular */}
                    <div className="form-group">
                    <label htmlFor="isRegular">Is Regular:</label>
                    <input
                        type="checkbox"
                        id="isRegular"
                        name="isRegular"
                        checked={visitData.isRegular}
                        onChange={handleInputChange}
                    />
                    </div>


                   {/* Description */}
                   <div className="form-group">
                       <label htmlFor="description">Description:</label>
                       <textarea
                           id="description"
                           name="description"
                           value={visitData.description}
                           onChange={handleInputChange}
                           required
                           rows="4"
                           style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                       />
                   </div>

                   {/* Has Medicine Checkbox */}
                   <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <input
                           type="checkbox"
                           id="hasMedicine"
                           name="hasMedicine"
                           checked={visitData.hasMedicine}
                           onChange={handleInputChange}
                       />
                       <label htmlFor="hasMedicine">Need Medications</label>
                   </div>

                   {/* Required Medications (conditional rendering) */}
                   {visitData.hasMedicine && (
                       <div className="form-group">
                           <label htmlFor="requiredMedications">Required Medications:</label>
                           <textarea
                               id="requiredMedications"
                               name="requiredMedications"
                               value={visitData.requiredMedications}
                               onChange={handleInputChange}
                               rows="3"
                               style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                               required={visitData.hasMedicine}
                           />
                       </div>
                   )}

                   {/* Buttons */}
                   <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                       <button 
                           type="submit" 
                           disabled={isLoading}
                           style={{
                               padding: '8px 16px',
                               backgroundColor: '#4CAF50',
                               color: 'white',
                               border: 'none',
                               borderRadius: '4px',
                               cursor: isLoading ? 'not-allowed' : 'pointer',
                               opacity: isLoading ? 0.7 : 1
                           }}
                       >
                           {isLoading ? 'Створення...' : 'Створити запит'}
                       </button>
                       <button 
                           type="button" 
                           onClick={onClose}
                           disabled={isLoading}
                           style={{
                               padding: '8px 16px',
                               backgroundColor: '#dc3545',
                               color: 'white',
                               border: 'none',
                               borderRadius: '4px',
                               cursor: isLoading ? 'not-allowed' : 'pointer'
                           }}
                       >
                           Скасувати
                       </button>
                   </div>
               </form>
           </div>
       </div>
   );
}