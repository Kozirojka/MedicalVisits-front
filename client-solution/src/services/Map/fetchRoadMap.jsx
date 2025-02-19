import { BASE_API } from "../../constants/BASE_API";

const fetchRoadMap = async (DayObj) => {
  const token = localStorage.getItem("accessToken");

  const { selectedDay } = DayObj;

  try {
    const response = await fetch(
      `${BASE_API}/v2/doctor/visits/confirmed-visits/${selectedDay}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch requests");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    throw error;
  }
};

export default fetchRoadMap;
