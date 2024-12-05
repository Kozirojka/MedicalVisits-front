// services/adminService.js
export const fetchVisitRequests = async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('http://localhost:5268/api/Admin/VisitsRequest', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch requests');
    }

    return response.json();
};