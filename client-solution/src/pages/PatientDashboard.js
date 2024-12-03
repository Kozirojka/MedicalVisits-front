// src/pages/PatientDashboard.jsx
import { useState } from 'react';
import CreateVisitModal from '../components/CreateVisitModal';
import '../styles/PatientDashboard.css';

export default function PatientDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);

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