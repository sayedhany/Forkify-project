import icons from 'url:../../img/icons.svg';

import View from './View';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your query! please try again :)`;
  _message = '';
  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');

    //   console.log(res.title);
  }
  _generateMarkupPreview(result) {
    return `
        <li class="preview">
        <a class="preview__link" href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
            
          </div>
        </a>
      </li>
          `;
  }
}

export default new ResultsView();
