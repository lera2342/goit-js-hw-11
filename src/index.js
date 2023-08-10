import ApiService from './js/api-service';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const elements = {
 searchForm: document.querySelector('.search-form'),
 gallery: document.querySelector('.gallery'),
 buttonLoadMore: document.querySelector('.load-more'),
 loader: document.querySelector('.loader'),
}

let isLoading = false;
const apiService = new ApiService();

let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

function loaderHide() {
  elements.loader.style.display = 'none';
  isLoading = false;
}
function showLoader() {
  elements.loader.style.display = 'block';
  isLoading = true;
}
function clearGallery() {
  elements.gallery.innerHTML = '';
}

elements.searchForm.addEventListener('submit', searchFormFn);
elements.buttonLoadMore.addEventListener('click', buttonLoadMoreFn);

async function searchFormFn(event) {
  event.preventDefault();
  apiService.query = event.currentTarget.elements.searchQuery.value;
  
  // const formData = new formData(event.currentTarget);
  // const values = formData.getAll("searchQuery").filter((value) => value);

  elements.buttonLoadMore.style.display = 'none';
  showLoader();
  apiService.resetPage();
  clearGallery();

  if (apiService.query === '') {
    return Notiflix.Notify.warning('Enter a query');
  }
  try {
    const promise = await apiService.fetchLink();
    appendMarkup(promise);
    lightbox.refresh();
    loaderHide();

    if (promise.totalHits > 0) {
      elements.buttonLoadMore.style.display = 'block';
      Notiflix.Notify.success(
        `You can see ${promise.totalHits} images.`
      );
    } else {
      elements.buttonLoadMore.style.display = 'none';

      Notiflix.Report.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function buttonLoadMoreFn() {
  if (isLoading) {
    return;
  }

  elements.buttonLoadMore.style.display = 'none';
  showLoader();

  try {
    const promise = await apiService.fetchLink();
    appendMarkup(promise);
    lightbox.refresh();
    loaderHide();

    if (promise.hits.length > 0) {
      elements.buttonLoadMore.style.display = 'block';
    } else {
      elements.buttonLoadMore.style.display = 'none';

      Notiflix.Report.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function appendMarkup(promise) {
  const markup = promise.hits
    .map(hit => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = hit;

      return `<div class="photo-card">
                <a class="gallery__link" href="${largeImageURL}">
                  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="560" length="450"/>
                </a>

                <div class="info">
                  <p class="info-item">
                    <b>Likes</b>
                    ${likes}
                  </p>

                  <p class="info-item">
                    <b>Views</b>
                    ${views}
                  </p>

                  <p class="info-item">
                    <b>Comments</b>
                    ${comments}
                  </p>

                  <p class="info-item">
                    <b>Downloads</b>
                    ${downloads}
                  </p>
                </div>
              </div>`;
    }).join('');
  elements.gallery.insertAdjacentHTML('beforeend', markup);
}
