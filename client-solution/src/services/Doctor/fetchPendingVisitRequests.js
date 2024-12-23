export const fetchVisitPendingRequests = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:5268/api/Doctor/visits/pending', {
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