import './App.css';
import Search from './components/search/search';
import CurrentWeather from './components/current-weather/current-weather';
import SavedCity from './components/saved-city/saved-city';
import { OWEATHER_API_KEY, OWEATHER_API_URL } from './api';
import { useState, useEffect } from 'react';

function App() {
	const [currentWeather, setCurrentWeather] = useState(null);
	const [currentForecast, setCurrentForecast] = useState(null);
	const [fetching, setFetching] = useState(false);

	const [savedCities, setSavedCities] = useState(() => {
		const saved = JSON.parse(localStorage.getItem('savedCities'));
		return saved || [];
	});
	const [savedCitiesWeather, setSavedCitiesWeather] = useState([]);
	const [hasSavedCities, setHasSavedCities] = useState(false);
	const [loadedCities, setLoadedCities] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	useEffect(() => {
		if (savedCities.length > 0) {
			setHasSavedCities(true);
			setFetching(true);

			fetchSavedCitiesWeather();
		}
	}, []);

	useEffect(() => {
		setTimeout(() => {
			setLoadedCities(true);
		}, 1000);
	}, [savedCitiesWeather]);

	useEffect(() => {
		setErrorMsg('');
		localStorage.setItem('savedCities', JSON.stringify(savedCities));
	}, [savedCities]);

	const fetchSavedCitiesWeather = () => {
		let fetchObjs = [];
		let cities = [];

		savedCities.forEach((city) => {
			const cityFetchUrl = `${OWEATHER_API_URL}/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${OWEATHER_API_KEY}`;

			fetchObjs.push({
				city: city.city,
				lat: city.lat,
				lon: city.lon,
				url: cityFetchUrl,
				saved: true,
			});
		});

		Promise.all(
			fetchObjs.map((obj) => {
				fetch(obj.url)
					.then((response) => response.json())
					.then((response) => {
						let cityObj = {
							city: obj.city,
							lat: obj.lat,
							lon: obj.lon,
							saved: obj.saved,
							...response,
						};

						cities.push(cityObj);
					});
			})
		)
			.then(() => {
				setFetching(false);
			})
			.then(() => {
				setSavedCitiesWeather(cities);
			});
	};

	const handleOnSearchChange = (searchData) => {
		setFetching(true);

		const [lat, lon] = searchData.value.split(' ');
		let isSaved = false;

		const currentWeatherFetch = fetch(
			`${OWEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OWEATHER_API_KEY}`
		);

		const forecastFetch = fetch(
			`${OWEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OWEATHER_API_KEY}&cnt=7`
		);

		if (
			savedCities.some((savedCity) => {
				return savedCity.city === searchData.label;
			}) ||
			searchData.saved
		) {
			isSaved = true;
		}

		Promise.all([currentWeatherFetch, forecastFetch])
			.then(async (response) => {
				const weatherResponse = await response[0].json();
				const forecastResponse = await response[1].json();

				setCurrentWeather({
					city: searchData.label,
					lat: lat,
					lon: lon,
					saved: isSaved,
					...weatherResponse,
				});

				setCurrentForecast(forecastResponse);
				setFetching(false);
			})
			.catch((e) => console.error(e));
	};

	const handleSaveCity = (city, data) => {
		if (
			!savedCities.some((savedCity) => {
				return savedCity.city === city.city;
			})
		) {
			savedCities
				? setSavedCities([{ ...city, saved: true }, ...savedCities])
				: setSavedCities([{ ...city, saved: true }]);
		}

		if (
			!savedCitiesWeather.some((savedCity) => {
				return savedCity.city === data.city;
			})
		) {
			savedCitiesWeather
				? setSavedCitiesWeather([
						{ ...data, saved: true },
						...savedCitiesWeather,
				  ])
				: setSavedCitiesWeather([{ ...data, saved: true }]);
		}
	};

	const handleRemoveCity = (city) => {
		const newSavedArray = savedCities.filter((savedCity) => {
			return savedCity.city !== city.city;
		});

		const newWeatherArray = savedCitiesWeather.filter((savedCity) => {
			return savedCity.city !== city.city;
		});

		newSavedArray.length === 0
			? setHasSavedCities(false)
			: setHasSavedCities(true);

		setSavedCities(newSavedArray);
		setSavedCitiesWeather(newWeatherArray);
	};

	const handleShowForecast = (city) => {
		handleOnSearchChange(city);
	};

	const handleCloseCity = () => {
		setCurrentWeather(null);
		setCurrentForecast(null);
	};

	const renderSaved = savedCitiesWeather
		.filter((savedCity) => {
			if (currentWeather) {
				return savedCity.city !== currentWeather.city;
			} else {
				return true;
			}
		})
		.map((cityWeather, index) => {
			return (
				<SavedCity
					key={cityWeather.city}
					data={cityWeather}
					onSaveCity={handleSaveCity}
					onRemoveCity={handleRemoveCity}
					onShowForecast={handleShowForecast}
				/>
			);
		});

	return (
		<div className="App">
			<div className="top-bar">
				<h1 className="app-title">Weather App</h1>
				<div className="search">
					<Search onSearchChange={handleOnSearchChange} />
				</div>
			</div>
			{fetching && (
				<div className="loading-details">
					<img
						alt="loading"
						className="loading-icon"
						src={`${process.env.PUBLIC_URL}/assets/loading.svg`}
					/>
					<span>Fetching Weather...</span>
				</div>
			)}
			<div className="content">
				{currentWeather && (
					<CurrentWeather
						key={currentWeather.city}
						data={currentWeather}
						forecastData={currentForecast}
						onSaveCity={handleSaveCity}
						onRemoveCity={handleRemoveCity}
						onCloseCity={handleCloseCity}
					/>
				)}
				{currentWeather ? (
					<div className="saved-cities-container">
						{loadedCities && renderSaved}
					</div>
				) : (
					<div className="saved-cities-container-no-weather">
						{loadedCities && renderSaved}
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
