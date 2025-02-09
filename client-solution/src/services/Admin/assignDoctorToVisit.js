import {BASE_API} from '../../constants/BASE_API';


export const assignDoctorToVisit = async (doctorId, visitId) => {
    try {
        const token = localStorage.getItem('accessToken');


        const data = {
            doctorId: doctorId,
            visitId: visitId
        };

        console.log('Дані для відправки:', data); 

        const response = await fetch(`${BASE_API}/Admin/Attach-VisitRequest`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', errorText);
            throw new Error('Failed to assign doctor');
        }

        return await response.json();
    } catch (error) {
        console.error('Error assigning doctor:', error);
        throw error;
    }
};