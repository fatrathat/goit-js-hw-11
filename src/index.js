import './css/styles.css';
// import './css/reset.css';
import 'modern-normalize/modern-normalize.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { axiosPhotos } from './serverAPI';
import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoad: document.querySelector('.load-more'),
};

let page = 2;
let gallery = new SimpleLightbox('.gallery a');

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
      return `<a class='card-link' href='${largeImageURL}'>
                <div class="photo-card">   
                 <img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" />
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
               </div>
              </a>`;
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

  axiosPhotos(refs.form.searchQuery.value)
    .then(photos => {
      if (refs.form.searchQuery.value.trim('').length !== 0) {
        refs.gallery.innerHTML = '';
        renderPhotos(photos);
        Notiflix.Notify.success(`Hooray! We found ${photos.data.totalHits} images.`);
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
const handleScroll = event => {
  infiniteScroll();
};

refs.form.addEventListener('submit', handleSubmit);
window.addEventListener('scroll', handleScroll);
