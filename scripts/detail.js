import { loadingDetail } from './data.js';
import { initialSetup } from './index.js';

initialSetup();

const titleEl = document.getElementById('title');
const descriptionEl = document.getElementById('description');
const bannerImageEl = document.getElementById('banner-image');
const coverImageEl = document.getElementById('cover-image');
const infoEl = document.getElementById('info');
const infoListEl = document.getElementById('info-list')

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');

const getDetailData = async() => {
  if (id === '999999') {
    titleEl.innerHTML = 'NOT FOUND';
    descriptionEl.innerHTML = 'Data is not registered.';
    return;
  }

  try {
    const response = await axios.get(`https://animeapi-askiahnur1.b4a.run/anime/${id}`);
    updateDetailPage(response.data)
    console.log(response.data)
  } catch (err) {
    console.error('Failed to get data for detail page: ', err.message);
    titleEl.innerHTML = 'NOT FOUND'
    descriptionEl.innerHTML = `Failed to get requested data: ${err.message}`;
  }
}

const updateDetailPage = (data) => {
  titleEl.innerHTML = data.title.romaji;
  descriptionEl.innerHTML = data.description;
  bannerImageEl.src = data.bannerImage || loadingDetail.bannerImage;
  coverImageEl.src = data.coverImage || loadingDetail.coverImage;

  const info = [data.year, data.format, data.episodes ? `${data.episodes}&nbsp;Episode${data.episodes > 1?'s':''}` : ''];

  let infoString = '';
  info.forEach((item, index) => {
		if (item) {
			infoString += `<span class="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">${item}</span>`;
		}
  });
  infoEl.innerHTML = infoString;

  const infoList = {
		'Title': data.title.romaji,
    "English Title": data.title.english,
		'Format': data.format,
		'Episode': data.episodes,
		'Status': data.status,
		'Genres': data.genres,
		'Popularity': data.popularity,
  };

  const infoKeyArray = Object.keys(infoList);
  const infoListString = infoKeyArray.map((infoKey, index) => { let infoItem = infoList[infoKey];
    if (infoKey == 'Genres') {infoItem = infoList[infoKey].join(', ')}; 
    return `<li id='infokey${index}'><b>${(infoKey == 'Episode' && infoList[infoKey] > 1)? infoKey + 's': infoKey}:</b> ${!!infoItem?infoItem:'?'}</li>`;
  }).join(' ');
  console.log(infoListString);

  infoListEl.innerHTML = infoListString;
}
updateDetailPage(loadingDetail)
getDetailData()



//? tambahkan script untuk menampilkan daftar genre
// .....
