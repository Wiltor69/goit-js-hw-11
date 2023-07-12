import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import {
  getImages,
  setSearchQuery,
  resetPage,
  nextPage,
  updateFirstSearch,
} from './photo_api';
import { createMarkup } from './markup';
import { Notify } from 'notiflix';
import { Report } from 'notiflix/build/notiflix-report-aio';

let form = document.querySelector('#search-form');
let gallery = document.querySelector('.gallery');
let loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.style.display = 'none';

form.addEventListener('submit', function (evt) {
  evt.preventDefault();

  let searchQuery = evt.target.searchQuery.value.trim();
  if (searchQuery === '') {
    Notify.warning('Input field is empty or contains only spaces');
    return;
  }

  setSearchQuery(searchQuery);
  resetPage();
  updateFirstSearch(true);
  loadMoreBtn.hidden = true;
  gallery.innerHTML = '';

  getImages().then(function (data) {
    if (data.length === 0) {
      Notify.failure('Nothing found by Your request');
      loadMoreBtn.style.display = 'none';
      return;
    }

    gallery.insertAdjacentHTML('beforeend', createMarkup(data));
    new SimpleLightbox('.gallery a', {
      captionDelay: 200,
      captionsData: 'alt',
    });
    loadMoreBtn.hidden = false;
    loadMoreBtn.style.display = 'block';
  });

  evt.target.searchQuery.value = '';
});

loadMoreBtn.addEventListener('click', function () {
  nextPage().then(function (data) {
    if (data.length === 0) {
      Report.info(
        "We're sorry",
        "but you've reached the end of search results.",
        'Okay'
      );
      loadMoreBtn.hidden = true;
      // return;
    }

    gallery.insertAdjacentHTML('beforeend', createMarkup(data));
    new SimpleLightbox('.gallery a', {
      captionDelay: 200,
      captionsData: 'alt',
    });
  });
});












// import Notiflix from 'notiflix';
// import SimpleLightbox from "simplelightbox";
// import "simplelightbox/dist/simple-lightbox.min.css";
// import LoadMoreBtn from './buttmod';
// import { Report } from 'notiflix/build/notiflix-report-aio';

// import {
//   getImages,
//   setSearchQuery,
//   resetPage,
//   nextPage,
//   updateFirstSearch,
// } from './photo_api';

// // import { PhotoAPI } from './photo_api';

// const formEl = document.querySelector('#search-form');
// const galleryEl = document.querySelector('.gallery');
// const loadMoreBtnEl = document.querySelector('.js-load-more');
// const seachBtnEl = document.querySelector('.search-but');
// const loading = document.querySelector('.loader');


//const photoApi = new PhotoAPI();



// const loadMoreBtn = new LoadMoreBtn({
//   selector: '.load-more',
//   isHidden: true,
// });

// const container = document.createElement('div');
// container.className = 'search-container';
// while (formEl.firstChild) {
//   container.appendChild(formEl.firstChild);
// }
// form.appendChild(container);
// seachBtnEl.textContent = '🔍';

// let lightbox = null;
// loading.style.display = 'block';

// async function appImage() {
//   const creatPage = photoApi.page;
//   try {
//     const { data, totalData } = await photoApi.fetchPhotos();
//     if (data.length === 0) {
//       invalidInput();
//     }
//     if (creatPage === 1) {
//       Notiflix.Notify.success(`OK! We found ${totalData} images.`);
//     }

//     const nextPage = photoApi.page;
//     const maxPage = Math.ceil(totalData / 20);
//     if (nextPage > maxPage) {
//       loadMoreBtn.hide();
//     }
//     const makup = createCards(data);
//     galleryEl.insertAdjacentHTML('beforeend', makup);
//     checkLightbox();
//   } catch (error) {
//     onError(err)
//   }
//   loadMoreBtn.enable();
// }

// function onSubmit(e) {
//   e.preventDefault();
//   const searchQuery = formEl.elements.searchQuery.value;
//   if (searchQuery === '') {
//     Notiflix.Notify.warning('Empty query');
//     return;
//   }
//   newList();
//   photoApi.setValue(searchQuery);
//   loadMoreBtn.show();

//   photoApi.resPage();
//   appImage()
//     .catch(onError)
//     .finally(() => formEl.reset());
// }



// function onLoadMore() {
//   loadMoreBtn.disable();
//   appImage();
//   smoothScrollToNextCards();
//   lightbox.refresh();
// }

// function invalidInput() {
//   throw new Error(
//     Notiflix.Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     )
//   );
//   return;
// }

// function newList() {
//   galleryEl.innerHTML = '';
// }

// function onError(err) {
//   console.error(err);
//   newList();
//   loadMoreBtn.hide();
// }

// function createCards(arr) {
//     return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => 
//          `<div class="photo-card">
//          <a class="gallery__link" href="${largeImageURL}">
//   <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b class="info-desc"><span class = "info-name" >Likes: </span><span class = "info-value">"${likes}"</span></b>
//           </p>
//     <p class="info-item">
//       <b class="info-desc"><span class = "info-name" >Views: </span><span class = "info-value">"${views}"</span></b>
//            </p>
//     <p class="info-item">
//       <b class="info-desc"><span class = "info-name" >Comments: </span><span class = "info-value">"${comments}"</span></b>
//           </p>
//     <p class="info-item">
//       <b class="info-desc"><span class = "info-name" >Downloads: </span><span class = "info-value">"${downloads}"</span></b>
//           </p>
//   </div>
// </div>`

//     ).join('');
// }

// function checkLightbox() {
//   if (!lightbox) {
//     lightbox = new SimpleLightbox('.gallery a', {
//       captions: true,
//       captionDelay: 250,
//     });
//   } else {
//     lightbox.refresh();
//   }
// }

// formEl.addEventListener('submit', onSubmit);
// loadMoreBtnEl.addEventListener('click', onLoadMore);

// function smoothScrollToNextCards() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }