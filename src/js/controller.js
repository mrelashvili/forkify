import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import paginationView from './views/paginationView';
import recipeView from './views/recipeView';
import resultsView from './views/resultsView';
import searchView from './views/searchView';
import bookmarksView from './views/bookmarksView';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    /// Generate id for recipe;
    const id = window.location.hash.slice(1);

    if (!id) return;

    // Render spinner.

    recipeView.renderSpiner();

    /// Update resultsview to mark selected search result.
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    /// Loading recipe.

    await model.loadRecipe(id);
    const { recipe } = model.state;

    /// 2) Rendering recipe;

    recipeView.render(recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpiner();
    /// 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    /// 2) Load search results
    await model.loadSearchResults(query);

    /// 3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    /// 4) Render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Render NEW results.
  resultsView.render(model.getSearchResultsPage(goToPage));

  /// 4) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  /// Update the recipe servings (in state)
  model.updateServings(newServings);

  /// Update the recipe view

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  /// Add or remove boomark.
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.state.recipe.bookmarked;
    model.deleteBookmark(model.state.recipe.id);
  }

  // Update recipe view.
  recipeView.update(model.state.recipe);

  /// Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();
