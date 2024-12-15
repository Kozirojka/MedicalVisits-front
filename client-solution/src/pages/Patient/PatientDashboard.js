// src/pages/PatientDashboard.jsx
import { useState } from 'react';
import CreateVisitModal from '../../components/CreateVisitModal';
import '../../styles/Patient/PatientDashboard.css';
import { useNavigate } from 'react-router-dom';


export default function PatientDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    return (
        <div className="patient-dashboard">
            <header className="dashboard-header">
                <h1>Панель керування пацієнта</h1>
                <button>Вийти</button>
            </header>

            <main className="dashboard-content">
                <div className="admin-controls">
                    <p>Funcional panel of patien</p> 
                    <button 
                        className="create-visit-button"
                        onClick={() => setIsModalOpen(true)}
                    >
                         Create visit request
                    </button>


                    <CreateVisitModal 
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </div>
            </main>
        </div>
    );
}