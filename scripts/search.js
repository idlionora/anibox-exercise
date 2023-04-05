import { imageCard } from './components/components.js';
import { initialSetup } from './index.js';

initialSetup();

const resultContainer = document.getElementById('result-container');
const searchKeyword = document.getElementById('search-keyword');
const keywordInput = document.getElementById('search-navbar');
const buttonLeft = document.getElementById('page-left');
const buttonRight = document.getElementById('page-right');
const pageDisplay = document.getElementById('page-number');
let currentPage = 1;

// mengambil query string parameter pada url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const query = urlParams.get('q');

keywordInput.value = query;
searchKeyword.innerHTML = query;

//? ambil data hasil searching dari API
const getSearchData = async (page) => {
	resultContainer.innerHTML = '<p>Fetching data...</p>';
	searchKeyword.innerHTML = keywordInput.value;
	buttonLeft.disabled = true;
	buttonRight.disabled = true;
	let searchResult = [];

	if (keywordInput.value === '') {
		resultContainer.innerHTML = '<p>Search bar is empty.</p>';
		return;
	}

	try {
		const response = await axios.get(
			`https://animeapi-askiahnur1.b4a.run/anime?title=${keywordInput.value}&limit=20&page=${page}`
		);
		searchResult = response.data;

		if (!searchResult.length) {
			resultContainer.innerHTML = '<p>Data not found.</p>';
		} else {
			resultContainer.innerHTML = searchResult
				.map((item) =>
					imageCard({
						title: item.title.romaji,
						genre: item.genres[0],
						id: item.id,
						imageUrl: item.coverImage,
						year: item.year,
					})
				)
				.join('');
		}
	} catch (err) {
		console.error('Failed to get search item data: ', err.message);
		resultContainer.innerHTML = `Failed to get search item data: ${err.message}`;
	}

	//toggle prev button function
	if (currentPage < 2) {
		buttonLeft.disabled = true;
	} else {
		buttonLeft.disabled = false;
	}

	//toggle next button function
	try {
		const nextResponse = await axios.get(
			`https://animeapi-askiahnur1.b4a.run/anime?title=${keywordInput.value}&limit=20&page=${
				page + 1
			}`
		);
		if (!nextResponse.data.length) {
			buttonRight.disabled = true;
		} else {
			buttonRight.disabled = false;
		}
	} catch (err) {
		console.error('Failed to check the next search page: ', err.message);
		buttonRight.disabled = true;
	}
};
getSearchData(1);

const clickPageArrow = (whichPage) => {
	whichPage === 'next' ? currentPage++ : currentPage--;
	getSearchData(currentPage);
	pageDisplay.innerHTML = currentPage;
};

const debounceSearch = () => {
	let timeout;
	return () => {
		clearTimeout(timeout);
		timeout = setTimeout(() => getSearchData(1), 1300);
	};
};

buttonRight.addEventListener('click', () => clickPageArrow('next'));
buttonLeft.addEventListener('click', () => clickPageArrow('prev'));
keywordInput.addEventListener('input', debounceSearch());
