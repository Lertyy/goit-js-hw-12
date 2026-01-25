import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const form = document.getElementById('search-form');
const input = form.elements['search-text'];
const loadMoreBtn = document.querySelector('.js-load-more');

let currentQuery = '';
let page = 1;
const PER_PAGE = 15;

hideLoadMoreButton();

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();

  const query = input.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query',
      timeout: 3000,
    });
    return;
  }

  currentQuery = query;
  page = 1;

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, page);

    if (!data || !Array.isArray(data.hits) || data.hits.length === 0) {
      iziToast.info({
        title: 'No results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        timeout: 4000,
      });
      return;
    }

    createGallery(data.hits);

    const totalHits = data.totalHits || 0;

    if (totalHits > PER_PAGE) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }

    iziToast.success({
      title: 'Success',
      message: `Found ${totalHits} images`,
      timeout: 2000,
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong while fetching images.',
      timeout: 3000,
    });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  if (!currentQuery) return;

  page += 1;
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(currentQuery, page);

    if (!data || !Array.isArray(data.hits) || data.hits.length === 0) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        timeout: 4000,
      });
      return;
    }

    createGallery(data.hits);

    const firstCard = document.querySelector('.gallery__item');
    if (firstCard) {
      const { height } = firstCard.getBoundingClientRect();
      window.scrollBy({
        top: height * 2,
        behavior: 'smooth',
      });
    }

    const totalHits = data.totalHits || 0;
    const totalLoaded = page * PER_PAGE;

    if (totalLoaded >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        timeout: 4000,
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error('Error fetching more images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong while fetching more images.',
      timeout: 3000,
    });
  } finally {
    hideLoader();
  }
}
