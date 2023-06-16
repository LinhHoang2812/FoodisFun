const url = window.location.href;
const id = url.split("/")[url.split("/").length - 1];

const introContainer = document.querySelector(".intro-container");
const ingredients = document.querySelector(".ingredients-list");
const instructionDetail = document.querySelector(".instruction-detail");
const tagsList = document.querySelector(".tags-list");

const getSingleRecipe = async () => {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await response.json();
  const { meals } = data;
  return meals[0];
};

const displaySingleRecipe = async () => {
  const data = await getSingleRecipe();
  const {
    strMeal: name,
    strCategory: category,
    strArea: area,
    strMealThumb: image,
    strInstructions: instruction,
    strTags: tags,
  } = data;

  const simpleList = [];
  for (var i = 1; i < 21; i++) {
    var ingredient = data[`strIngredient${i}`];
    if (ingredient) {
      simpleList.push(ingredient);
    }
  }

  const ingredientsList = [];
  for (var i = 1; i < 21; i++) {
    var ingredient = data[`strMeasure${i}`] + " " + data[`strIngredient${i}`];
    if (
      ingredient !== "null null" &&
      ingredient !== "  " &&
      ingredient !== " "
    ) {
      ingredientsList.push(ingredient);
    }
  }

  const totalIngredients = ingredientsList.length;
  introContainer.innerHTML = `<div class="single-recipe-img" >
  <img src="${image}">
  </div>
  <div class="recipe-summary">
  <h3 class="recipe-name">${name}</h3>
  <div class="short-info">
  
  <div>
  <h4>Ingredients</h4>
  <p>${totalIngredients}</p>
  </div>
  
  <div>
  <h4>Category</h4>
  <p>${category}</p>
  </div>
  
  <div>
  <h4>Country</h4>
  <p>${area}</p>
  </div>
  
  </div>
  <a
  class="save-btn-a">

  Save to mealboard

  </a>
  
  
  
  
  </div>
  `;

  ingredients.innerHTML = `${ingredientsList
    .map((item) => {
      return `<li>${item}</li>`;
    })
    .join("")}`;
  var arrayInstruction = instruction.split(/\. (?=[A-Z])/);

  instructionDetail.innerHTML = `${arrayInstruction
    .map((item) => {
      return `<li>${item}</li>`;
    })
    .join("")}`;

  if (tags) {
    var tagsArray = tags.split(",");

    tagsList.innerHTML = `${tagsArray
      .map((item) => {
        return `<button class="tag-btn">${item}</button>`;
      })
      .join("")}`;
  }

  //save to mealboard
  const saveBtn = document.querySelector(".save-btn-a");

  saveBtn.addEventListener("click", (e) => {
    // addLocalStorage(id, name, image, totalIngredients, simpleList);
    fetch("/save-recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, image, totalIngredients, simpleList }),
    })
      .then((response) => {
        var data = response.text();
        return data;
      })
      .then((data) => (window.location.href = data));
  });
};

displaySingleRecipe();
