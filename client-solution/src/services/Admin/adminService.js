import {BASE_API} from '../../constants/BASE_API';

export const fetchVisitRequests = async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${BASE_API}/Admin/VisitsRequest`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch requests');
    }
 
    return response.json();
};