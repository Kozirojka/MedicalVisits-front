export async function fetchNearestDoctors(requestId) {
    if (requestId <= 0) {
        throw new Error("Ідентифікатор запиту повинен бути більше 0.");
    }

    const token = localStorage.getItem('accessToken');
    
    try {
        const response = await fetch(`http://localhost:5268/api/Admin/Nearest-Doctor/${requestId}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
 
        if (response.ok) {
            const data = await response.json();
            return data;
        } 
        
        const errorText = await response.text();
        throw new Error(errorText || 'Помилка при отриманні списку лікарів');

    } catch (error) {
        console.error("Помилка:", error);
        throw error;
    }
}