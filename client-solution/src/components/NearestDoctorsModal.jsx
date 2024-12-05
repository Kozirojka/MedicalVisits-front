// components/NearestDoctorsModal.jsx
export default function NearestDoctorsModal({ isOpen, onClose, doctors, onSelectDoctor }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Найближчі лікарі</h2>
                <div className="doctors-grid">
                    {doctors.map(doctor => (
                        <div 
                            key={doctor.id} 
                            className="doctor-card"
                            onClick={() => onSelectDoctor(doctor.id)}
                        >
                            <h3>{doctor.firstName} {doctor.lastName}</h3>
                            <p>Спеціальність: {doctor.specialization}</p>
                            <p>Відстань: {doctor.distance} м</p>
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