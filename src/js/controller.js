'use strict';

// import icons from '../img/icons.svg'; /// Parcel 1.

import * as model from './model';

import recipeView from './views/recipeView';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2
// crossorigin

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);

    ///// Rendering recipe.
  } catch (err) {
    alert(err);
  }
};

const init = () => {
  recipeView.addHandlerRender(controlRecipe);
};

init();
