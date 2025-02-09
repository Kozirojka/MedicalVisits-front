export async function fetchNearestDoctors(VisitRequestId) {
    if (VisitRequestId <= 0) {
        throw new Error("Ідентифікатор запиту повинен бути більше 0.");
    }

    console.log("Request id is" + VisitRequestId);


    const token = localStorage.getItem('accessToken');
    
    console.log(token);

    try {
        const response = await fetch(`http://localhost:5268/api/admin/doctors/nearest/${VisitRequestId}`, {
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