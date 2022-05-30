import 'animate.css';
import './css/styles.css';
import './css/reset.css';
import 'modern-normalize/modern-normalize.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { axiosPhotos } from './serverAPI';
import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoad: document.querySelector('.load-more'),
  upBtn: document.querySelector('#upBtn'),
};

let page = 2;
let gallery = new SimpleLightbox('.gallery a');

const getPhotos = searchQuery => {
  axiosPhotos(searchQuery)
    .then(photos => {
      if (searchQuery.trim('').length > 0 && photos.data.totalHits !== 0) {
        refs.gallery.innerHTML = '';
        renderPhotos(photos);
        Notiflix.Notify.success(`Hooray! We found ${photos.data.totalHits} images.`);
        console.log(photos.data.totalHits);
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      }
    })
    .catch(e => {
      console.log(e);
    });
};

const scrollPage = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

const infiniteScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (clientHeight + scrollTop >= scrollHeight) {
    setTimeout(uploadMore, 1000);
  }
};

const renderPhotos = photo => {
  const markup = photo.data.hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<li class="gallery-item">
                <a class='card-link' href='${largeImageURL}'>
                  <div class="photo-card">   
                    <img class="card-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <ul class="info">
                      <li class="info-item">
                        <p class="info-item">
                          <b>Likes:</b>
                        </p>
                        <p>${likes}</p>
                      </li>
                      <li class="info-item">
                        <p class="info-item">
                          <b>Views:</b>
                        </p>
                        <p>${views}</p>
                     </li>
                     <li class="info-item">
                        <p class="info-item">
                          <b>Comments:</b>
                        </p>
                        <p>${comments}</p>
                      </li>
                      <li class="info-item">
                        <p class="info-item">
                          <b>Downloads:</b>
                        </p>
                        <p>${downloads}</p>
                      </li>
                    </ul>
                  </div>
                </a>
              </li>`;
    })
    .join(' ');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
};

const uploadMore = () => {
  axiosPhotos(refs.form.searchQuery.value, page)
    .then(data => {
      renderPhotos(data);
      scrollPage();
      page += 1;
    })
    .catch(() => {
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    });
};

const handleSubmit = event => {
  event.preventDefault();
  getPhotos(refs.form.searchQuery.value);
};

const handleScroll = () => {
  infiniteScroll();
};

const scrollUp = () => {
  window.scrollTo(screenX, 0);
};

const hideScrollBtn = () => {
  document.documentElement.scrollTop !== 0
    ? (refs.upBtn.style.display = 'inline-block')
    : (refs.upBtn.style.display = 'none');
};

refs.form.addEventListener('submit', handleSubmit);
window.addEventListener('scroll', handleScroll);
refs.upBtn.addEventListener('click', scrollUp);
window.addEventListener('scroll', hideScrollBtn);
