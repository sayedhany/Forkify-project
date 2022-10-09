import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksview from './views/bookmarksview.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
// const recipeContainer = document.querySelector('.recipe');
// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    // 1)loading recipe
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    bookmarksview.update(model.state.bookmarks);

    await model.loadRecipe(id);
    // const { recipe } = model.state;

    // 2) rendring recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};
const searchInput = document.querySelector('.search__field');
const btn = document.querySelector('.search__btn');
btn.addEventListener('click', () => {
  controlSearchResults(searchInput.value);
});

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.leadSearchResults(query);
    // console.log(model.getSearchResultsPage(1));
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    // throw err
  }
};
const controlPagination = function (goToPage) {
  // console.log('page controller');
  // console.log(goToPage);

  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  model.updateServings(newServings);

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // model.addBookmark(model.state.recipe);
  // console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
  bookmarksview.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksview.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // console.log(newRecipe);
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksview.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // setTimeout(function () {
    //   addRecipeView.toggleWindow();
    // }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err, '😂 ');
    addRecipeView.renderError(err.message);
  }
};
function init() {
  bookmarksview.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  // controlServings();
}
init();
