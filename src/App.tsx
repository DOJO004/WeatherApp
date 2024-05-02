import { useEffect, useState } from "react";
import getCurrentWeather from "./script/weather";

interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const [weatherData, setWeatherData] = useState<WeatherData>(
    {} as WeatherData
  );
  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          getWeatherData(lat, lng);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const getWeatherData = async (lat: number, lng: number) => {
    const data = await getCurrentWeather(lat, lng);
    console.log("current weather", data);
    setWeatherData(data);
  };
  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // 每秒更新一次

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 mt-12 max-w-md mx-auto">
      {weatherData ? (
        <>
          <div className=" flex justify-between items-end">
            <div className="flex gap-4 mt-4  items-center  ">
              <i className="fa-solid fa-location-dot"></i>
              <p>
                {weatherData.name} , {weatherData.sys?.country}
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <i className="fa-regular fa-calendar"></i>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <p className="text-7xl text-center mt-4">
            {weatherData.main?.temp}°C
          </p>

          <div className="flex gap-4 items-center mt-4 justify-center">
            <i className="fa-regular fa-clock fa-xl"></i>
            <p>{currentTime.toLocaleTimeString()}</p>
          </div>
          <div className="flex justify-between">
            <img
              src={
                weatherData?.weather && weatherData.weather.length > 0
                  ? `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
                  : ""
              }
              alt=""
            />
            <div className="flex gap-2 items-center">
              <div className="border rounded-md p-2 flex gap-2 items-center">
                <i className="fa-solid fa-temperature-arrow-down"></i>
                <p>{weatherData.main?.temp_min}</p>
              </div>
              <div className="border rounded-md p-2 flex gap-2 items-center">
                <i className="fa-solid fa-temperature-arrow-up"></i>
                <p>{weatherData.main?.temp_max}</p>
              </div>
            </div>
          </div>
          <div className=" grid grid-cols-4 gap-1">
            <div className=" border rounded-md p-1 grid justify-center">
              <i className="fa-solid fa-sun  mx-auto"></i>
              <p className=" text-center">
                {new Date(weatherData.sys?.sunrise * 1000).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  }
                )}
              </p>
            </div>
            <div className=" border rounded-md p-1 grid justify-center">
              <i className="fa-solid fa-moon mx-auto"></i>
              <p className=" text-center">
                {new Date(weatherData.sys?.sunset * 1000).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  }
                )}
              </p>
            </div>
            <div className="border rounded-md p-1 grid justify-center">
              <i className="fa-solid fa-child mx-auto "></i>
              <p className=" text-center">{weatherData.main?.feels_like}</p>
            </div>
            <div className="border rounded-md p-1 grid justify-center">
              <i className="fa-solid fa-water mx-auto"></i>
              <p className=" text-center">{weatherData.main?.humidity}</p>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
