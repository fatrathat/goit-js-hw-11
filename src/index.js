import './css/styles.css';
import './css/reset.css';
import { fetchPhotos } from './fetchPhotos';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

const getPhotos = photo => {
  const markup = photo.hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                  <p class="info-item">
                    <b>Likes: ${likes}</b>
                  </p>
                  <p class="info-item">
                    <b>Views: ${views}</b>
                  </p>
                  <p class="info-item">
                    <b>Comments: ${comments}</b>
                  </p>
                  <p class="info-item">
                    <b>Downloads: ${downloads}</b>
                  </p>
                </div>
              </div>`;
    })
    .join(' ');
  refs.gallery.innerHTML = markup;
};

const handleSubmit = event => {
  event.preventDefault();
  fetchPhotos(refs.form.searchQuery.value)
    .then(data => {
      getPhotos(data);
    })
    .catch(e => {
      console.log(e);
    });
};

refs.form.addEventListener('submit', handleSubmit);
