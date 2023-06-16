const mealsContainer = document.querySelector(".meals-container");
const ingredientsSelection = document.querySelector(".ingredients-selection");
const popup = document.querySelector(".ingredient-popup");
const groceryContainer = document.querySelector(".grocery-container");
const allOut = document.querySelector(".clear-all");
const shoppingList = document.querySelector(".shopping-list");
const groceryList = document.querySelector(".grocery-list");
const groceryCloseBtn = document.querySelector(".grocery-close-btn");
const clearAllRecipes = document.querySelector(".clear-all-recipes");
const addAllRecipes = document.querySelector(".add-all-recipes");
const addMore = document.querySelector(".add-more");
const popupCloseBtn = document.querySelector(".popup-close-btn");

let count = 0;
displayClearAll();
allOut.addEventListener("click", deleteAllItems);

/////// show all ingredients ////////
mealsContainer.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("ingredients-detail")) {
    e.stopPropagation();

    if (window.innerWidth > 800) {
      const top = e.target.offsetTop;
      const left = e.target.getBoundingClientRect().left + 20;
      popup.style.top = `${top}px`;
      popup.style.left = `${left}px`;
    }
    popup.style.display = "block";

    const simpleList = JSON.parse(e.target.dataset.list);
    ingredientsSelection.innerHTML = simpleList
      .map((item) => {
        return `<li><button class="add-to-list"><i class="fa-solid fa-circle-plus"></i></button>${item}</li>`;
      })
      .join("");
    popupCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      popup.style.display = "none";
    });
  } else {
    popup.style.display = "none";
  }
});

mealsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("ingredients-detail")) {
    e.stopPropagation();

    if (window.innerWidth > 800) {
      const top = e.target.offsetTop;
      const left = e.target.getBoundingClientRect().left + 20;

      popup.style.top = `${top}px`;
      popup.style.left = `${left}px`;
    }
    popup.style.display = "block";
    const simpleList = JSON.parse(e.target.dataset.list);
    ingredientsSelection.innerHTML = simpleList
      .map((item) => {
        return `<li><button class="add-to-list"><i class="fa-solid fa-circle-plus"></i></button>${item}</li>`;
      })
      .join("");
    popupCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      popup.style.display = "none";
    });
  } else {
    popup.style.display = "none";
  }
});

/////// remove each recipe or add all ingredients from one recipe ////////
mealsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash")) {
    e.stopPropagation();
    const itemToDelete =
      e.target.parentElement.parentElement.parentElement.parentElement;
    mealsContainer.removeChild(itemToDelete);
    deleteFromRecipeDB(
      e.target.parentElement.parentElement.parentElement.dataset.id
    );
  } else if (e.target.classList.contains("plus-all")) {
    const simpleList = JSON.parse(e.target.parentElement.dataset.list);
    simpleList.forEach((item) => {
      addToGroceryList(item);
    });
  }
});

/////// add each ingredient seperately ////////

ingredientsSelection.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-circle-plus")) {
    const item = e.target.parentElement.parentElement.textContent;
    addToGroceryList(item);
  }
});

/////// delete all recipe ///////
clearAllRecipes.addEventListener("click", () => {
  const children = [...mealsContainer.children];
  children.forEach((child) => {
    mealsContainer.removeChild(child);
  });
  fetch("/delete-all-recipe", {
    method: "POST",
  });
});

/////// delete each recipe from database ///////
function deleteFromRecipeDB(id) {
  console.log(id);
  fetch("/delete-recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

/////// open and close  grocery list on small screen ///////
shoppingList.addEventListener("click", () => {
  groceryList.classList.add("show");
});
groceryCloseBtn.addEventListener("click", () => {
  groceryList.classList.remove("show");
});

/////// add all ingredients from all recipes ///////
addAllRecipes.addEventListener("click", addAllRecipesToList);

/////// add ingredients of your choice ///////
addMore.addEventListener("click", () => {
  addMoreIngredient();
});

/////// done and delete each item ///////
groceryContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("done")) {
    if (!e.target.classList.contains("bought")) {
      e.target.classList.add("bought");
      deleteFromGroceryDB(
        e.target.parentElement.parentElement.parentElement.dataset.id
      );
    } else {
      e.target.classList.remove("bought");
      addToGroceryDB(
        e.target.parentElement.parentElement.parentElement.dataset.id,
        e.target.nextElementSibling.textContent
      );
    }
  } else if (e.target.classList.contains("fa-trash")) {
    groceryContainer.removeChild(
      e.target.parentElement.parentElement.parentElement
    );
    deleteFromGroceryDB(
      e.target.parentElement.parentElement.parentElement.dataset.id
    );
  }
});

/////////////////////////// functions for grocery list //////////////

function displayClearAll() {
  if (groceryContainer.children.length == 0) {
    allOut.style.display = "none";
    return;
  }
  allOut.style.display = "block";
  clearAll();
}

function clearAll() {
  allOut.addEventListener("click", () => {
    const children = [...groceryContainer.children];
    children.forEach((child) => {
      groceryContainer.removeChild(child);
    });
    allOut.style.display = "none";
  });
}

function addToGroceryList(item) {
  count++;
  const article = document.createElement("article");
  article.classList.add("grocery-item");
  const attribute = document.createAttribute("data-id");
  const id = (new Date().getTime() + count).toString();
  attribute.value = id;
  article.setAttributeNode(attribute);
  article.innerHTML = `<div class="single-grocery-item"> 
        <div>
        <button class="done"></button>
        <span>${item}</span>
        </div>
        <button class="delete"><i class="fa-solid fa-trash"></i></button>
         </div>`;
  groceryContainer.appendChild(article);

  const doneBtn = article.querySelector(".done");
  const deleteBtn = article.querySelector(".fa-trash");
  doneBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!e.currentTarget.classList.contains("bought")) {
      e.currentTarget.classList.add("bought");
      deleteFromGroceryDB(id);
    } else {
      e.currentTarget.classList.remove("bought");
      addToGroceryDB(id, item);
    }
  });

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    groceryContainer.removeChild(
      e.currentTarget.parentElement.parentElement.parentElement
    );
    deleteFromGroceryDB(id);
    displayClearAll();
  });
  displayClearAll();
  addToGroceryDB(id, item);
}

function addMoreIngredient() {
  const article = document.createElement("article");
  article.classList.add("grocery-item");
  const attribute = document.createAttribute("data-id");
  const id = new Date().getTime().toString();
  attribute.value = id;
  article.setAttributeNode(attribute);
  article.innerHTML = `<div class="single-grocery-item"> 
        <div>
        <button class="done"></button>
        
        <input class="more-input" type="text"> 
        
        </div>
        <button class="delete"><i class="fa-solid fa-trash"></i></button>
         </div>`;
  groceryContainer.prepend(article);
  const input = article.querySelector("input");
  input.addEventListener("change", () => {
    addToGroceryDB(id, input.value);
  });

  const doneBtn = article.querySelector(".done");
  const deleteBtn = article.querySelector(".delete");
  doneBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!e.currentTarget.classList.contains("bought")) {
      e.currentTarget.classList.add("bought");
      deleteFromGroceryDB(id);
    } else {
      e.currentTarget.classList.remove("bought");
      addToGroceryDB(id, input.value);
    }
  });

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    groceryContainer.removeChild(e.currentTarget.parentElement.parentElement);
    deleteFromGroceryDB(id);
    displayClearAll();
  });
  displayClearAll();
}

function addAllRecipesToList() {
  const items = document.querySelectorAll(".make-it");

  const allIngredients = items.forEach((item) => {
    const list = JSON.parse(item.getAttribute("data-list"));
    list.forEach((ingredient) => {
      addToGroceryList(ingredient);
    });
  });
}

function deleteAllItems() {
  fetch("/delete-all-items", {
    method: "POST",
  });
}

function addToGroceryDB(id, item) {
  fetch("/save-item", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, item }),
  });
}

function deleteFromGroceryDB(id) {
  fetch("/delete-item", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}
