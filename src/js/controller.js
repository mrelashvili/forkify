import * as model from './model';
import recipeView from './views/recipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
('use strict');

/// https://forkify-api.herokuapp.com/v2

if (module.hot) module.hot.accept();

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    /// Loading spinner.
    recipeView.renderSpinner();

    /// 1) Loading Recipe

    await model.loadRecipe(id);

    /// 2) Rendering Recipe.

    const { recipe } = model.state;
    recipeView.render(recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  resultsView.renderSpinner();
  try {
    /// 1) Get search query.
    const query = searchView.getQuery();
    if (!query) return;

    /// 2) load search results
    await model.loadSearchResults(query);

    /// 3) Render results
    resultsView.render(model.getSearchResultsPage());

    /// 4) render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  /// 3) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  /// 4) render NEW pagination buttons
  paginationView.render(model.state.search);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);
