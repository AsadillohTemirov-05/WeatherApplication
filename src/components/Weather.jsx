import React, { useState, useEffect } from 'react'
import { BiSearch } from 'react-icons/bi'
import { FaLocationDot, FaWind } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { fetchForeCastByCity } from '../redux/weatherSlice'

import sunnyImage from "../assets/sunny.jpg"
import rainImage from "../assets/rain.jpg"
import snowImage from "../assets/snow.jpg"
import cloudImage from "../assets/cloud.jpg"
import "./Weather.css"

const Weather = () => {
  const [city, setCity] = useState("Tashkent");
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (city.trim() !== "") {
      dispatch(fetchForeCastByCity(city));
    }
  };

  useEffect(() => {
    dispatch(fetchForeCastByCity("Tashkent"));
  }, [dispatch]);

  const foreCast = useSelector((state) => state.weather.forecast);
  const foreCastHours = foreCast?.forecast?.forecastday[0]?.hour.slice(0, 10);
  const weatherCondition = foreCast?.current?.condition?.text?.toLowerCase();

  let backgroundImage = sunnyImage;
  if (weatherCondition) {
    if (weatherCondition.includes("sunny") || weatherCondition.includes("clear")) {
      backgroundImage = sunnyImage;
    } else if (weatherCondition.includes("rain")) {
      backgroundImage = rainImage;
    } else if (weatherCondition.includes("snow")) {
      backgroundImage = snowImage;
    } else if (weatherCondition.includes("cloud") || weatherCondition.includes("overcast")) {
      backgroundImage = cloudImage;
    }
  }

  return (
    <div className='weather-container' style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundPosition: "center",
      backgroundSize: "cover"
    }}>
      <div className='main-section'>
        <div className='weather-info'>
          <div className='location'>
            <h3>{foreCast?.location?.name} - {foreCast?.location?.country}</h3>
          </div>
          <div className="condition">
            <h1>{foreCast?.current?.condition?.text}</h1>
          </div>
        </div>

        <div className='weather-hours'>
          {foreCastHours?.map((hour, index) => {
            const time = new Date(hour.time).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            });
            return (
              <div className="hour-card" key={index}>
                <div className='hour-time'>
                  <p>{time}</p>
                </div>
                <div className="hour-condition">
                  <img src={hour?.condition.icon} alt="" />
                </div>
                <div className='hour-temp'>
                  <h2>{!isNaN(hour?.temp_c) ? Math.ceil(hour.temp_c) : "--"}</h2>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="side-section">
        <div className="search-box">
          <FaLocationDot className='icon' />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={foreCast?.location?.name || "Search city..."} />
          <BiSearch onClick={handleSearch} className='icon' />
        </div>

        <div className="temp-info">
          <h1>{!isNaN(foreCast?.current?.temp_c) ? Math.ceil(foreCast.current.temp_c) : "--"}</h1>
          <p>
            <FaWind /> {foreCast?.current?.wind_dir} {foreCast?.current?.wind_kph}
          </p>
        </div>

        <div className="forecast-days">
          <h1 className='forecast-heading'>The Next Days Forecast</h1>
          {foreCast?.forecast?.forecastday?.map((item, index) => {
            const forecastDate = new Date(item.date).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "2-digit",
              month: "long"
            });
            return (
              <div key={index} className='forecast-item'>
                <div className="forecast-details">
                  <div className='forecast-icon'>
                    <img src={item.day.condition.icon} alt="" />
                  </div>
                  <div className="details">
                    <h2>{forecastDate}</h2>
                    <p>{item.day.condition.text}</p>
                  </div>
                </div>

                <div className='forecast-temp'>
                  <div className="temp-display">
                    <h2>{!isNaN(item.day.maxtemp_c) ? item.day.maxtemp_c : "--"} °C</h2>
                    <h2>{!isNaN(item.day.mintemp_c) ? item.day.mintemp_c : "--"} °C</h2>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Weather
