// components/NearestDoctorsModal.jsx


//modal windows for selecting the nearest doctors
export default function NearestDoctorsModal({ isOpen, onClose, doctors, onSelectDoctor }) {
    if (!isOpen) return null;


    const handleDoctorSelect = (doctor) => {
        console.log('Вибраний лікар:', doctor); 
        onSelectDoctor(doctor.doctorId); 
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Найближчі лікарі</h2>
                <div className="doctors-grid">
                    {doctors.map(doctor => (
                        <div 
                            key={doctor.doctorId} 
                            className="doctor-card"
                            onClick={() => handleDoctorSelect(doctor)}
                        >
                            <h3>{doctor.firstName} {doctor.lastName}</h3>
                            <p>Спеціальність: {doctor.specialization}</p>
                            <p>Відстань: {doctor.distance} м</p>
                            <p>Id: {doctor.doctorId}</p>
                        </div>
                    ))}
                </div>
                <button className="close-button" onClick={onClose}>
                ✕
                </button>
            </div>
        </div>
    );  
}