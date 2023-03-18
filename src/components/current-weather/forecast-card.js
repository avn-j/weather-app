import { useState, useEffect } from 'react';

const ForecastCard = ({ data, day }) => {
	const [icon, setIcon] = useState('');

	const WEEK_DAYS = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday',
	];

	const dayInTheWeek = new Date().getDay();
	const forecastDays = WEEK_DAYS.slice(dayInTheWeek, WEEK_DAYS.length).concat(
		WEEK_DAYS.slice(0, dayInTheWeek)
	);

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
			case 'Snow':
				icon = 'snowy-6.svg';
				break;
			default:
				icon = 'day.svg';
				break;
		}

		setIcon(icon);
	});

	return (
		<div className="forecast-container">
			<p className="day-of-week">{forecastDays[day]}</p>
			<img
				alt="weather"
				className="forecast-weather-icon"
				src={`${process.env.PUBLIC_URL}/assets/${icon}`}
			/>
			<p className="forecast-condition">{data.weather[0].main}</p>
			<p className="forecast-temperature">{Math.round(data.main.temp)}°C</p>
		</div>
	);
};

export default ForecastCard;
