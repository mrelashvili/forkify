import * as model from './model';
import recipeView from './views/recipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './views/searchView';
import resultsView from './views/resultsView';

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
    console.log(model.state.search.results);
    resultsView.render(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);
