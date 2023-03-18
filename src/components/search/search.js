import { AsyncPaginate } from 'react-select-async-paginate';
import { useState } from 'react';
import { geoApiOptions, GEO_API_URL } from '../../api';

const Search = ({ onSearchChange }) => {
	const [searchValue, setSearchValue] = useState(null);

	const handleSearchChange = (changeData) => {
		setSearchValue(changeData);
		onSearchChange(changeData);
	};

	const loadOptions = (inputValue) => {
		return fetch(
			`${GEO_API_URL}/cities?minPopulation=100000&namePrefix=${inputValue}`,
			geoApiOptions
		)
			.then((response) => response.json())
			.then((response) => {
				return {
					options: response.data.map((city) => {
						return {
							value: `${city.latitude} ${city.longitude}`,
							label: `${city.name}, ${city.countryCode}`,
						};
					}),
				};
			})
			.catch((e) => console.error(e));
	};

	return (
		<AsyncPaginate
			placeholder="Search for a city..."
			debounceTimeout={1000}
			value={searchValue}
			onChange={handleSearchChange}
			loadOptions={loadOptions}
		/>
	);
};

export default Search;
