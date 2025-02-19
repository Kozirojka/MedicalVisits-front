import {BASE_API} from '../../constants/BASE_API';

export const fetchVisitPendingRequests = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${BASE_API}/v2/doctor/visits/pending-visits`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch requests');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        throw error;
    }
};  