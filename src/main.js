import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const formEl = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let totalPages = 0;

formEl.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  query = e.target.elements['search-text'].value.trim();

  if (!query) {
    iziToast.warning({ message: 'Please enter a search query' });
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    createGallery(data.hits);

    totalPages = Math.ceil(data.totalHits / 15);

    if (page < totalPages) {
      showLoadMoreButton();
    }
  } catch {
    iziToast.error({ message: 'Request failed. Try again later.' });
  } finally {
    hideLoader();
    formEl.reset();
  }
}

async function onLoadMore() {
  page += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);
    smoothScroll();

    if (page >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch {
    iziToast.error({ message: 'Request failed.' });
  } finally {
    hideLoader();
  }
}

function smoothScroll() {
  const card = document.querySelector('.gallery-item');
  if (!card) return;

  const { height } = card.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}
