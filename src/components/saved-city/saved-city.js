import { useState, useEffect } from 'react';
import './saved-city.css';

const SavedCity = ({ data, onSaveCity, onRemoveCity, onShowForecast }) => {
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

	const cityObj = {
		city: data.city,
		lat: data.lat,
		lon: data.lon,
	};

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
		setIsSaved(true);
		onSaveCity(cityObj, data);
	};

	const removeCity = (e) => {
		e.stopPropagation();
		setIsSaved(false);
		onRemoveCity(cityObj);
	};

	const showForecast = () => {
		onShowForecast({
			label: data.city,
			value: `${data.lat} ${data.lon}`,
			saved: saved,
		});
	};

	return (
		<div className="weather-container" onClick={showForecast}>
			<div className="weather-details-top">
				<div className="left-container">
					<p className="city">{data.city}</p>
					<p className="weather-description">{data.weather[0].main}</p>
				</div>
				<img
					alt="weather"
					className="weather-icon"
					src={`${process.env.PUBLIC_URL}/assets/${icon}`}
				/>
			</div>
			<div className="weather-details-bottom">
				<p className="temperature">{Math.round(data.main.temp)}°C</p>
			</div>
			{saved ? (
				<button className="saved-remove-city-button" onClick={removeCity}>
					Remove City
				</button>
			) : (
				<button className="saved-save-city-button" onClick={saveCity}>
					Save City
				</button>
			)}
		</div>
	);
};

export default SavedCity;
