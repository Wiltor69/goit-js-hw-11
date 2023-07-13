import axios from 'axios';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const API_KEY = '38080803-2095028227abc5092026f2051';
const BASE_URL = 'https://pixabay.com/api/';

let searchQuery = '';
let currentPage = 1;
let total = null;
let firstSearch = true;


export function updateFirstSearch(state) {
  firstSearch = state;
}


export function nextPage() {
  currentPage = currentPage + 1;
  return getImages();
}


export function resetPage() {
  currentPage = 1;
}


export async function getImages() {
  let params = {
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: currentPage,
    per_page: 40,
  };

  try {
    let response = await axios.get(BASE_URL, { params: params });

    total = response.data.total;

    if (firstSearch) {
      updateFirstSearch(false);
    }

    let imagesData = response.data.hits.map(hit => {
      return {
        webformatURL: hit.webformatURL.replace('_640', '_340'),
        largeImageURL: hit.largeImageURL,
        tags: hit.tags,
        views: hit.views,
        comments: hit.comments,
        downloads: hit.downloads,
        likes: hit.likes,
      };
    });

    return imagesData;
  } catch (error) {
    Notify.failure('Помилка: ' + error.message);
  }
}


export function setSearchQuery(newQuery) {
  searchQuery = newQuery;
}



