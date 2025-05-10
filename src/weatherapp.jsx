import React, { useEffect, useState } from "react";
import './weather.css';
import cloud from './images/cloudy.png';
import { IoSearch } from "react-icons/io5";

import tempImg from "./images/temperature.png";
import HumidityImg from "./images/humidity.png";
import pressureImg from "./images/barometer.png";
import feelsImg from "./images/temperatures.png";
import windSpeedImg from "./images/storm.png";

import maxTempImg from "./images/weather.png"

import ForcastDetails from "./components/forcastdetail";
import WeatherMap from "./components/weathermap";

function WeatherApp() {
    const [data, setData] = useState({});
    const [forcast, forcdata] = useState({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [city_name, setCity] = useState("");

    const API_key = "e795b1e26ec7e48b1d8581c5e5d64d89";

    const [forcastLoad, setForcastLoading] = useState(false);
    const [forcastError, setForcastError] = useState(false);

    // Handle city input
    const handleSearch = (e) => setCity(e.target.value);

    useEffect(() => {
        // Handle geolocation and reverse geocoding to fetch user's city name
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
    
              try {
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                );
                const data = await response.json();
                setCity(data.address?.city || data.address?.town || data.address?.village || "Unknown location");
              } catch (error) {
                console.error("Failed to fetch user's location via reverse geocoding", error);
              }
            },
            (error) => {
              console.error("Geolocation permission denied or failed:", error);
              setError(true);
            }
          );
        } else {
          console.error("Geolocation not supported by this browser.");
          setError(true);
        }
      }, []);


    useEffect(() => {

       
        async function fetchWeatherAndForecast() {
            if (!city_name) return;

            setLoading(true);
            setError(false);

            try {
                const weatherResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_key}&units=metric`
                );
                const weatherData = await weatherResponse.json();
          
                if (!weatherResponse.ok) {
                    throw new Error('Failed to fetch weather data');
                }
console.log(weatherData)
                setData(weatherData);

                const { lat, lon } = weatherData.coord;

                if (lat && lon) {
                    setForcastLoading(true);
                    const forcastResponse = await fetch(
                        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&appid=${API_key}&units=metric`
                    );
                    const forecastData = await forcastResponse.json();

                    if (!forcastResponse.ok) {
                        throw new Error('Failed to fetch forecast data');
                    }

                    forcdata(forecastData);
                    setForcastLoading(false);
                } else {
                    throw new Error('Could not determine coordinates');
                }
            } catch (error) {
                console.error(error.message);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchWeatherAndForecast();
    }, [city_name]);

    return (
        <>
            <div className="search">
                <p className="weatherapp">Weather App</p>
                <div>
                    <input
                        type="text"
                        id="searchcity"
                        value={city_name}
                        onChange={handleSearch}
                    />
                    {/* <button
                        onClick={() => setCity(city_name)}
                        className="searchbox"
                    >
                        <IoSearch />
                    </button> */}
                </div>
                <img
                    style={{ width: "100px" }}
                    src={cloud}
                    alt="cloud representation"
                />
            </div>

            {loading && <div>Loading...</div>}
            {error && !loading && (
                <div>Failed to load weather data. Please try searching again.</div>
            )}

            {!loading && !error && (
                <div className="mainbg">
                    <div className="navbarmain">
                      
                        <h3>{data?.name || "Unknown City"}</h3>
                    </div>
                    <div className="mainDegree">
                        <h3>{data?.main?.temp ?? "N/A"} <sup>°C</sup></h3>
                    </div>
                    <div className="weatherdetails">
                        <div className="weathdet">

                        <img src={tempImg} alt="" className="weatherimages" />
                            <p>Temperature:</p>
                            <p>{data?.main?.temp ?? "N/A"} °C</p>
                        </div>
                        <div className="weathdet">
                        <img src={pressureImg} alt="" className="weatherimages" />
                            <p>Pressure:</p>
                            <p>{data?.main?.pressure ?? "N/A"} hPa</p>
                        </div>
                        <div className="weathdet">
                        <img src={HumidityImg} alt="" className="weatherimages" />
                            <p>Humidity:</p>
                            <p>{data?.main?.humidity ?? "N/A"}%</p>
                        </div>
                        <div className="weathdet">
                        <img src={feelsImg} alt="" className="weatherimages" />
                            <p>Feels Like:</p>
                            <p>{data?.main?.feels_like ?? "N/A"} °C</p>
                        </div>
                        <div className="weathdet">
                        <img src={windSpeedImg} alt="" className="weatherimages" />
                            <p>Wind Speed:</p>
                            <p>{data?.wind?.speed ?? "N/A"} m/s</p>
                        </div>
                        <div className="weathdet">
                        <img src={maxTempImg} alt="" className="weatherimages" />
                            <p>Temp Max:</p>
                            <p>{data?.main?.temp_max ?? "N/A"} °C</p>
                        </div>
                    </div>

                 <WeatherMap city={city_name}/>

                    <ForcastDetails forcast={forcast} forcastLoad={forcastLoad} forcastError={forcastError} />

                   
                </div>
            )}
        </>
    );
}

export default WeatherApp;
