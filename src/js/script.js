/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      booksList: '#template-book'
    },
    containerOf: {
      booksList: '.books-list',
      filteringInputs: '.filters form'
    },
    bookFeature: {
      cover: '.book__image'
    },
    filters: {
      input: '.filters input'
    }
  };

  const classNames = {
    favoriteBookCover: 'favorite',
    bookCoverBlurred: 'hidden'
  };

  const styles = {
    ratingBarBackground: {
      upTo6: 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)',
      from6To8: 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)',
      from8To9: 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)',
      from9Up: 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)'
    }
  };

  const templates = {
    booksList: Handlebars.compile(document.querySelector(select.templateOf.booksList).innerHTML)
  };

  class BooksList {
    constructor(){
      const thisBooksList = this;
      thisBooksList.data = dataSource.books;
      thisBooksList.favoriteBooks = [];
      thisBooksList.getElements();
      thisBooksList.booksListRender();
      thisBooksList.initActions();
    }
    getElements(){
      const thisBooksList = this;
      thisBooksList.elements = {
        booksListContainer: document.querySelector(select.containerOf.booksList),
        filteringInputsContainer: document.querySelector(select.containerOf.filteringInputs),
        filteringInputs: document.querySelectorAll(select.filters.input)
      };
    }
    addRatingBarParams(book){
      const rating = book.rating;
      if(rating < 6){
        book.ratingBarBackground = styles.ratingBarBackground.upTo6;
      } else if(rating < 8) {
        book.ratingBarBackground = styles.ratingBarBackground.from6To8;
      } else if(rating < 9){
        book.ratingBarBackground = styles.ratingBarBackground.from8To9;
      } else {
        book.ratingBarBackground = styles.ratingBarBackground.from9Up;
      }
      book.ratingBarWidth = `${rating * 10}%`;
      return book;
    }
    booksListRender(){
      const thisBooksList = this;
      for(let book of thisBooksList.data){
        book = thisBooksList.addRatingBarParams(book);
        const generatedHTML = templates.booksList(book);
        const generatedDOM = utils.createDOMFromHTML(generatedHTML);
        thisBooksList.elements.booksListContainer.appendChild(generatedDOM);
      }
    }
    addToFavoritesOrRemove(e){
      const thisBooksList = this;
      let target;
      for(const element of e.path){
        if(element === e.currentTarget){
          return;
        }
        if(element.matches(select.bookFeature.cover)){
          target = element;
          break;
        }
      }
      const coverId = target.getAttribute('data-id');
      const indexOfCover = thisBooksList.favoriteBooks.indexOf(coverId);
      if(indexOfCover === -1){
        thisBooksList.favoriteBooks.push(coverId);
        target.classList.add(classNames.favoriteBookCover);
      } else {
        thisBooksList.favoriteBooks.splice(indexOfCover, 1);
        target.classList.remove(classNames.favoriteBookCover);
      }
    }

    //What is better: version above or below?

    /*filterBooks(){
      const thisBooksList = this;
      const blurredBookCovers = thisBooksList.elements.booksListContainer.querySelectorAll('.' + classNames.bookCoverBlurred);
      for(const cover of blurredBookCovers){
        cover.classList.remove(classNames.bookCoverBlurred);
      }
      const inputsChecked = [];
      for(const input of thisBooksList.elements.filteringInputs){
        if(input.checked){
          inputsChecked.push(input.value);
        }
      }
      if(inputsChecked.length === 0){
        return;
      } else {
        for(const book of thisBooksList.data){
          let isCoverToBeBlurred = false;
          for(const inputName of inputsChecked){
            if(!book.details[inputName]){
              isCoverToBeBlurred = true;
              break;
            }
          }
          if(isCoverToBeBlurred){
            const coverToBlur = thisBooksList.elements.booksListContainer.querySelector(`[data-id="${book.id}"]`);
            coverToBlur.classList.add(classNames.bookCoverBlurred);
          }
        }
      }
    }*/
    filterBooks(){
      const thisBooksList = this;
      const inputsChecked = [];
      for(const input of thisBooksList.elements.filteringInputs){
        if(input.checked){
          inputsChecked.push(input.value);
        }
      }
      for(const book of thisBooksList.data){
        let isCoverToBeBlurred = false;
        for(const inputName of inputsChecked){
          if(!book.details[inputName]){
            isCoverToBeBlurred = true;
            break;
          }
        }
        const bookCover = thisBooksList.elements.booksListContainer.querySelector(`[data-id="${book.id}"]`);
        if(isCoverToBeBlurred){
          if(!bookCover.classList.contains(classNames.bookCoverBlurred)){
            bookCover.classList.add(classNames.bookCoverBlurred);
          }
        } else {
          if(bookCover.classList.contains(classNames.bookCoverBlurred)){
            bookCover.classList.remove(classNames.bookCoverBlurred);
          }
        }
      }
    }
    initActions(){
      const thisBooksList = this;
      thisBooksList.elements.booksListContainer.addEventListener('click', function(e){
        e.preventDefault();
      });
      thisBooksList.elements.booksListContainer.addEventListener('dblclick', function(e){
        thisBooksList.addToFavoritesOrRemove(e);
      });
      thisBooksList.elements.filteringInputsContainer.addEventListener('change', function(){
        thisBooksList.filterBooks();
      });
    }
  }

  const app = new BooksList(); // eslint-disable-line no-unused-vars

}
