import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.getElementById('gallery');
const loadMoreBtn = document.querySelector('.js-load-more');
const loaderEl = document.querySelector('.loader');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images) {
  const markup = images
    .map(
      img => `
      <li class="gallery__item">
        <a class="gallery__link" href="${img.largeImageURL}">
          <img class="gallery__image" src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes</b><span>${img.likes}</span></p>
          <p class="info-item"><b>Views</b><span>${img.views}</span></p>
          <p class="info-item"><b>Comments</b><span>${img.comments}</span></p>
          <p class="info-item"><b>Downloads</b><span>${img.downloads}</span></p>
        </div>
      </li>`
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

export function clearGallery() {
  galleryEl.innerHTML = '';
}

export function showLoader() {
  if (loaderEl) loaderEl.classList.remove('is-hidden');
}

export function hideLoader() {
  if (loaderEl) loaderEl.classList.add('is-hidden');
}

export function showLoadMoreButton() {
  if (!loadMoreBtn) return;
  loadMoreBtn.style.display = 'block';
  loadMoreBtn.disabled = false;
}

export function hideLoadMoreButton() {
  if (!loadMoreBtn) return;
  loadMoreBtn.style.display = 'none';
  loadMoreBtn.disabled = true;
}
