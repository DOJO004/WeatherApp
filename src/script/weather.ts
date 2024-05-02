export default function getCurrentWeather(lat:number, lon:number) {
    console.log(lat, lon);
    
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        throw error; // 重新拋出錯誤，以便調用方處理
      });
  }
  