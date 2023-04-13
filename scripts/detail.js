import { detailCarousel } from './components/components.js';
import { loadingDetail } from './data.js';
import { initialSetup } from './index.js';

initialSetup();

const titleEl = document.getElementById('title');
const descriptionEl = document.getElementById('description');
const bannerImageEl = document.getElementById('banner-image');
const coverImageEl = document.getElementById('cover-image');
const infoEl = document.getElementById('info');
const infoListEl = document.getElementById('info-list');
const trailerEl = document.getElementById('trailer-div');
const streamEpisodeEl = document.getElementById('stream-episode');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');

const getDetailData = async () => {
	if (id === '999999') {
		titleEl.innerHTML = 'NOT FOUND';
		descriptionEl.innerHTML = 'Data is not registered.';
		return;
	}

	try {
		const response = await axios.get(`https://animeapi-askiahnur1.b4a.run/anime/${id}`);
		updateDetailPage(response.data);
		console.log(response.data);
	} catch (err) {
		console.error('Failed to get data for detail page: ', err.message);
		titleEl.innerHTML = 'NOT FOUND';
		descriptionEl.innerHTML = `Failed to get requested data: ${err.message}`;
	}
};

function toggleDesc() {
	let descPoints = document.getElementById('desc-points');
	let descButton = document.getElementById('desc-button');
	let descContinue = document.getElementById('desc-continue');

	if (descContinue.classList.contains('hidden')) {
		descPoints.classList.remove('inline');
		descPoints.classList.add('hidden');
		descContinue.classList.remove('hidden');
		descContinue.classList.add('inline');
		descButton.innerHTML = '(<b>Show Less</b>)';
	} else {
		descPoints.classList.remove('hidden');
		descPoints.classList.add('inline');
		descContinue.classList.remove('inline');
		descContinue.classList.add('hidden');
		descButton.innerHTML = '(<b>Show More</b>)';
	}
}

const updateDetailPage = (data) => {
	titleEl.innerHTML = data.title.romaji;
	bannerImageEl.src = data.bannerImage || loadingDetail.bannerImage;
	coverImageEl.src = data.coverImage || loadingDetail.coverImage;

	const info = [
		data.year,
		data.format,
		data.episodes ? `${data.episodes}&nbsp;Episode${data.episodes > 1 ? 's' : ''}` : '',
	];

	let infoString = '';
	info.forEach((item, index) => {
		if (item) {
			infoString += `<span class="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">${item}</span>`;
		}
	});
	infoEl.innerHTML = infoString;

	let descString = data.description;
	if (data.description.length > 320) {
		descString = `
			${data.description.slice(0, 320)}
			<span id="desc-points" class="inline">... </span>
			<span id="desc-continue" class="hidden">${data.description.slice(320)}</span>
			<button id="desc-button" class="inline not-italic"><b>(Show More)</b></button>
		`
		descriptionEl.innerHTML = descString;
		descriptionEl.addEventListener('click', toggleDesc)
	} else {
		descriptionEl.innerHTML = descString;
	} 
	

	if (!!data.trailer?.site && !!data.trailer?.id)
		trailerEl.innerHTML = `<iframe id="trailer-vid" width="420" height="315" src="https://www.${data.trailer.site}.com/embed/${data.trailer.id}" frameborder="0">
            </iframe>`;

	const infoList = {
		Title: data.title.romaji,
		'English Title': data.title.english,
		Format: data.format,
		Episode: data.episodes,
		Status: data.status,
		Genres: data.genres,
		Popularity: data.popularity,
	};

	const infoKeyArray = Object.keys(infoList);
	const infoListString = infoKeyArray
		.map((infoKey, index) => {
			let infoItem = infoList[infoKey];
			if (infoKey == 'Genres') {
				infoItem = infoList[infoKey].join(', ');
			}
			return `<li id='infokey${index}'><b>${
				infoKey == 'Episode' && infoList[infoKey] > 1 ? infoKey + 's' : infoKey
			}:</b> ${!!infoItem ? infoItem : '?'}</li>`;
		})
		.join(' ');

	infoListEl.innerHTML = infoListString;

	if (data.streamingEpisodes.length > 0) {
    streamEpisodeEl.innerHTML = detailCarousel(data.streamingEpisodes)

    const prev = document.getElementById('ep-carousel-prev');
    prev.onclick = () => {
		  document.getElementById('episodes-container').scrollLeft -= 1000;
	  };

    const next = document.getElementById('ep-carousel-next');
	    next.onclick = () => {
		document.getElementById('episodes-container').scrollLeft += 1000;
	};
  }
};
updateDetailPage(loadingDetail);
getDetailData();


