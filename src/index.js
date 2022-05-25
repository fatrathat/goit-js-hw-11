import './css/styles.css';
import './css/reset.css';

import { fetchPhotos } from './fetchPhotos';
import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoad: document.querySelector('.load-more'),
};

const renderPhotos = photo => {
  const markup = photo.hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
                <a href='${largeImageURL}'>
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                </a>
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
  refs.gallery.insertAdjacentHTML('beforeend', markup);
};

const uploadMore = () => {
  let page = 2;
  fetchPhotos(refs.form.searchQuery.value, page)
    .then(data => {
      renderPhotos(data);
      page += 1;
    })
    .catch(e => {
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    });
};

const handleSubmit = event => {
  event.preventDefault();

  fetchPhotos(refs.form.searchQuery.value)
    .then(data => {
      renderPhotos(data);
      refs.btnLoad.classList.toggle('is-hidden');
    })
    .catch(e => {
      console.log(e);
    });
};

const handleClick = event => {
  uploadMore;
};

refs.form.addEventListener('submit', handleSubmit);
refs.btnLoad.addEventListener('click', uploadMore);
