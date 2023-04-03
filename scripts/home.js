import { bannerCarouselItem, section } from './components/components.js';
import { loadingHomeData } from './data.js';
import { initialSetup } from './index.js';

initialSetup();

const setBannerCarouselItem = (banner) => {
	const bannerContainer = document.getElementById('banner-container');

	const carouselItems = banner.map((item) =>
		bannerCarouselItem({
			id: item.id,
			title: item.title.romaji,
			description: item.description,
			banner: item.bannerImage || '/assets/image-not-available.png',
			year: item.year,
			genre: item.genres[0],
			format: item.format,
		})
	);

	bannerContainer.innerHTML = carouselItems.join('');

	const items = [];
	let index = 0;
	for (const item of bannerContainer.children) {
		items.push({
			position: index++,
			el: item,
		});
	}

	const carousel = new Carousel(items);
	carousel.cycle();

	const prevButton = document.querySelector('[data-carousel-prev]');
	const nextButton = document.querySelector('[data-carousel-next]');

	prevButton.onclick = () => {
		carousel.prev();
	};

	nextButton.onclick = () => {
		carousel.next();
	};
};

setBannerCarouselItem(loadingHomeData);

const displayError = (err, whichData, setElement) => {
	console.error(`Failed to get data for ${whichData}:`, err.message);
	const dataNotFound = loadingHomeData;
	dataNotFound.forEach((items) => {
		items.title = { romaji: 'NOT FOUND', english: 'NOT FOUND' };
		items.genres = ['Not Found'];
		items.description = `Failed to get data for ${whichData}: <br/> ${err.message}`;
	});
	setElement(dataNotFound);
};

const getBanner = async () => {
	try {
		const response = await axios.get(
			'https://animeapi-askiahnur1.b4a.run/anime?sort=trending'
		);
		const bannerItems = await response.data.slice(0, 5);
		setBannerCarouselItem(bannerItems);
	} catch (err) {
		displayError(err, 'banner', setBannerCarouselItem);
	}
};
getBanner();

let registeredSections = [
	{ name: 'Trending' },
	{ name: 'Popularity' },
	{ name: 'Newest' },
	{ name: 'Top-Anime' },
];
registeredSections.forEach((item) => (item.data = loadingHomeData));

const showListSection = (listSection) => {
	// menampilkan data ke halaman HTML
	document.querySelector('main').innerHTML = listSection.map((item) => section(item)).join('');

	// memberi action pada button scroll kiri dan kanan
	listSection.forEach((item) => {
		const sectionName = item.name.toLowerCase();

		const prev = document.querySelector('#' + sectionName + ' button[data-carousel-prev]');
		prev.onclick = () => {
			document.getElementById(sectionName + '-container').scrollLeft -= 1000;
		};

		const next = document.querySelector('#' + sectionName + ' button[data-carousel-next]');
		next.onclick = () => {
			document.getElementById(sectionName + '-container').scrollLeft += 1000;
		};
	});
};
showListSection(registeredSections);

const updateListSection = (category, updatedData) => {
	const processArray = registeredSections;
	const newArray = [];
	processArray.forEach((item) => {
		if (item.name === category) {
			newArray.push({ name: item.name, data: updatedData });
		} else {
			newArray.push(item);
		}
	});
	registeredSections = newArray;
	showListSection(newArray);
};

const getSection = async (category, endpoint) => {
	try {
		const response = await axios.get(
			`https://animeapi-askiahnur1.b4a.run/anime?sort=${endpoint}`
		);
		updateListSection(category, response.data);
	} catch (err) {
		const errData = loadingHomeData;
		function setData(notfoundData) {
			errData = notfoundData;
		}
		displayError(err, `${category} section`, setData);
    updateListSection(category, errData);
	}
};

getSection('Trending', 'trending');
getSection('Popularity', 'popularity');
getSection('Newest', 'newest');
getSection('Top-Anime', 'top')
