import { useState } from 'react';

export default function DoctorDashboard() {
   const [activeTab, setActiveTab] = useState('pending');
   const [showUserMenu, setShowUserMenu] = useState(false);

   const tabIcons = {
       pending: '👥',
       schedule: '📅',
       patients: '📋',
   };

   return (
       <div style={{ display: 'flex', height: '100vh' }}>
           {/* Вертикальна панель */}
           <div style={{
               width: '80px',
               backgroundColor: '#f8f9fa',
               borderRight: '1px solid #dee2e6',
               display: 'flex',
               flexDirection: 'column',
               padding: '20px 0',
               justifyContent: 'space-between' // Розділяє контент на початок і кінець
           }}>
               {/* Верхня частина з вкладками */}
               <div style={{
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
               }}>
                   {Object.entries(tabIcons).map(([tab, icon]) => (
                       <button
                           key={tab}
                           onClick={() => setActiveTab(tab)}
                           style={{
                               width: '60px',
                               height: '60px',
                               margin: '5px 0',
                               display: 'flex',
                               flexDirection: 'column',
                               justifyContent: 'center',
                               alignItems: 'center',
                               border: 'none',
                               borderRadius: '10px',
                               cursor: 'pointer',
                               backgroundColor: activeTab === tab ? '#4a90e2' : 'transparent',
                               color: activeTab === tab ? 'white' : '#6c757d',
                               fontSize: '24px',
                               transition: 'all 0.2s ease',
                               padding: '10px'
                           }}
                           onMouseEnter={(e) => {
                               if (activeTab !== tab) {
                                   e.currentTarget.style.backgroundColor = '#e9ecef';
                               }
                           }}
                           onMouseLeave={(e) => {
                               if (activeTab !== tab) {
                                   e.currentTarget.style.backgroundColor = 'transparent';
                               }
                           }}
                       >
                           <div>{icon}</div>
                           <div style={{ 
                               fontSize: '10px', 
                               marginTop: '5px',
                               textAlign: 'center'
                           }}>
                               {tab === 'pending' && 'Очікують'}
                               {tab === 'schedule' && 'Розклад'}
                               {tab === 'patients' && 'Пацієнти'}
                           </div>
                       </button>
                   ))}
               </div>

               {/* Нижня частина з профілем користувача */}
               <div style={{ position: 'relative' }}>
                   <button
                       onClick={() => setShowUserMenu(!showUserMenu)}
                       style={{
                           width: '60px',
                           height: '60px',
                           margin: '5px 10px',
                           border: 'none',
                           borderRadius: '50%',
                           backgroundColor: '#e9ecef',
                           cursor: 'pointer',
                           display: 'flex',
                           justifyContent: 'center',
                           alignItems: 'center',
                           fontSize: '24px',
                           transition: 'all 0.2s ease'
                       }}
                   >
                       👨‍⚕️
                   </button>

                   {/* Спливаюче меню користувача */}
                   {showUserMenu && (
                       <div style={{
                           position: 'absolute',
                           bottom: '70px',
                           left: '80px',
                           backgroundColor: 'white',
                           padding: '10px',
                           borderRadius: '8px',
                           boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                           minWidth: '150px',
                           zIndex: 1000
                       }}>
                           <div style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                               <div style={{ fontWeight: 'bold' }}>Доктор Іванов</div>
                               <div style={{ fontSize: '12px', color: '#666' }}>Кардіолог</div>
                           </div>
                           <button
                               style={{
                                   width: '100%',
                                   padding: '8px',
                                   border: 'none',
                                   background: 'none',
                                   textAlign: 'left',
                                   cursor: 'pointer',
                                   color: '#dc3545'
                               }}
                           >
                               Вийти
                           </button>
                       </div>
                   )}
               </div>
           </div>

           {/* Основний контент */}
           <div style={{ flex: 1, padding: '20px' }}>
               {activeTab === 'pending' && (
                   <div>
                       <h2>Пацієнти, що очікують підтвердження</h2>
                   </div>
               )}

               {activeTab === 'schedule' && (
                   <div>
                       <h2>Розклад прийомів</h2>
                   </div>
               )}

               {activeTab === 'patients' && (
                   <div>
                       <h2>Інформація про пацієнтів</h2>
                   </div>
               )}
           </div>
       </div>
   );
}