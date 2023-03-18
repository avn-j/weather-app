import './current-weather.css';
import ForecastCard from './forecast-card';
import { useState, useEffect } from 'react';

const CurrentWeather = ({
	data,
	forecastData,
	onSaveCity,
	onRemoveCity,
	onCloseCity,
}) => {
	/**
	 * States
	 */
	const [saved, setIsSaved] = useState(() => {
		if (data.saved) {
			return true;
		} else {
			return false;
		}
	});

	const [icon, setIcon] = useState('');

	useEffect(() => {
		setIsSaved(data.saved);
	}, []);

	useEffect(() => {
		let icon = '';

		switch (data.weather[0].main) {
			case 'Clouds':
				icon = 'cloudy-day-1.svg';
				break;
			case 'Rain':
				icon = 'rainy-1.svg';
				break;
			case 'Clear':
				icon = 'day.svg';
				break;
			case 'Thunder':
				icon = 'thunder.svg';
				break;
			default:
				icon = 'day.svg';
				break;
		}

		setIcon(icon);
	});

	/**
	 * Function handlers
	 */
	const saveCity = () => {
		const cityObj = {
			city: data.city,
			lat: data.lat,
			lon: data.lon,
		};

		setIsSaved(true);
		onSaveCity(cityObj, data);
	};

	const removeCity = () => {
		const cityObj = {
			city: data.city,
			lat: data.lat,
			lon: data.lon,
		};

		setIsSaved(false);
		onRemoveCity(cityObj);
	};

	const closeCity = () => {
		onCloseCity();
	};

	const renderForecast = forecastData.list.map((forecast, index) => {
		return <ForecastCard key={index} data={forecast} day={index} />;
	});

	return (
		<div className="current-weather-container">
			<div className="buttons">
				{saved ? (
					<button className="remove-city-button" onClick={removeCity}>
						Saved
					</button>
				) : (
					<button className="save-city-button" onClick={saveCity}>
						Save City
					</button>
				)}
				<button className="close-button" onClick={closeCity}>
					<img
						alt="close"
						src={`${process.env.PUBLIC_URL}/assets/icons8-close.svg`}
						height="40px"
					/>
				</button>
			</div>
			<div className="todays-weather">
				<div className="weather-details-left">
					<img
						alt="weather"
						className="current-weather-icon"
						src={`${process.env.PUBLIC_URL}/assets/${icon}`}
					/>
					<div className="city-and-temp-container">
						<p className="current-conditions">{data.weather[0].main}</p>
						<p className="current-temperature">
							{Math.round(data.main.temp)}°C
						</p>
						<p className="city">{data.city}</p>
					</div>
				</div>
				<div className="weather-details-right">
					<div className="current-parameter-container">
						<div className="parameter-row">
							<span className="parameter-label">Feels like</span>
							<span className="parameter-value">
								{Math.round(data.main.feels_like)}°C
							</span>
						</div>
						<div className="parameter-row">
							<span className="parameter-label">Wind</span>
							<span className="parameter-value">{data.wind.speed} m/s</span>
						</div>
						<div className="parameter-row">
							<span className="parameter-label">Humidity</span>
							<span className="parameter-value">{data.main.humidity}%</span>
						</div>
						<div className="parameter-row">
							<span className="parameter-label">Pressure</span>
							<span className="parameter-value">{data.main.pressure} hPa</span>
						</div>
					</div>
				</div>
			</div>
			<div className="daily-forecast-label">Daily Forecast</div>
			<div className="weekly-forecast">{renderForecast}</div>
		</div>
	);
};

export default CurrentWeather;
