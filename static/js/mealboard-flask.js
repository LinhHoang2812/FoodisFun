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
allOut.addEventListener("click", () => {
  const children = [...groceryContainer.children];
  children.forEach((child) => {
    groceryContainer.removeChild(child);
  });
  allOut.style.display = "none";
  deleteAllItems();
});

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
        return `<li><button class="add-to-list"><i class="fa-solid fa-circle-plus"></i></button>${
          item[0].toUpperCase() + item.slice(1).toLowerCase()
        }</li>`;
      })
      .join("");
    //change color when item already is grocery list
    let list = [...ingredientsSelection.querySelectorAll("li")];

    let groceryList = [
      ...groceryContainer.querySelectorAll(".grocery-item span"),
      ...groceryContainer.querySelectorAll(".grocery-item input"),
    ];
    groceryList = groceryList.map((item) =>
      item.textContent
        ? item.textContent
        : item.value[0].toUpperCase() + item.value.slice(1).toLowerCase()
    );

    list.forEach((item) => {
      if (groceryList.includes(item.textContent)) {
        const plus = item.querySelector(".fa-circle-plus");
        plus.style.color = "rgb(198, 160, 160)";
      }
    });

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
        return `<li><button class="add-to-list"><i class="fa-solid fa-circle-plus"></i></button>${
          item[0].toUpperCase() + item.slice(1).toLowerCase()
        }</li>`;
      })
      .join("");
    let list = [...ingredientsSelection.querySelectorAll("li")];

    let groceryList = [
      ...groceryContainer.querySelectorAll(".grocery-item span"),
      ...groceryContainer.querySelectorAll(".grocery-item input"),
    ];
    groceryList = groceryList.map((item) =>
      item.textContent
        ? item.textContent
        : item.value[0].toUpperCase() + item.value.slice(1).toLowerCase()
    );

    list.forEach((item) => {
      if (groceryList.includes(item.textContent)) {
        const plus = item.querySelector(".fa-circle-plus");
        plus.style.color = "rgb(198, 160, 160)";
      }
    });

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
    let groceryList = [
      ...groceryContainer.querySelectorAll(".grocery-item span"),
      ...groceryContainer.querySelectorAll(".grocery-item input"),
    ];
    groceryList = groceryList.map((item) =>
      item.textContent
        ? item.textContent
        : item.value[0].toUpperCase() + item.value.slice(1).toLowerCase()
    );

    const simpleList = JSON.parse(e.target.parentElement.dataset.list);
    addtoscreen(simpleList, groceryList);
  }
});

async function addtoscreen(list, grocerylist) {
  const itemList = [];
  list.forEach((item) => {
    item = item[0].toUpperCase() + item.slice(1).toLowerCase();
    if (!grocerylist.includes(item)) {
      count++;
      const id = (new Date().getTime() + count).toString();
      itemList.push({ id: id, item: item });
      addToGroceryList(item, id);
    }
  });
  await addtodb(itemList);
}

async function addtodb(list) {
  const j = list.length;
  for (let i = 0; i < j; i++) {
    // wait for the promise to resolve before advancing the for loop

    await addToGroceryDB(list[i].id, list[i].item);
  }
}
/////// add each ingredient seperately ////////

ingredientsSelection.addEventListener("click", (e) => {
  if (e.target.style.color !== "rgb(198, 160, 160)") {
    if (e.target.classList.contains("fa-circle-plus")) {
      count++;
      const id = (new Date().getTime() + count).toString();
      e.target.style.color = "rgb(198, 160, 160)";
      const item = e.target.parentElement.parentElement.textContent;
      addToGroceryList(item, id);
      addToGroceryDB(id, item);
    }
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

async function addAllRecipesToList() {
  let groceryList = [
    ...groceryContainer.querySelectorAll(".grocery-item span"),
    ...groceryContainer.querySelectorAll(".grocery-item input"),
  ];
  groceryList = groceryList.map((item) =>
    item.textContent
      ? item.textContent
      : item.value[0].toUpperCase() + item.value.slice(1).toLowerCase()
  );
  const items = document.querySelectorAll(".make-it");

  const l = items.length;
  const itemList = [];
  for (let k = 0; k < l; k++) {
    const list = JSON.parse(items[k].getAttribute("data-list"));
    list.forEach((item) => {
      item = item[0].toUpperCase() + item.slice(1).toLowerCase();
      if (!groceryList.includes(item)) {
        count++;
        const id = (new Date().getTime() + count).toString();
        itemList.push({ id: id, item: item });
        addToGroceryList(item, id);
      }
    });
  }
  await addtodb(itemList);
}

/////// add ingredients of your choice ///////
addMore.addEventListener("click", () => {
  addMoreIngredient();
});
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
    addToGroceryDB(
      id,
      input.value[0].toUpperCase() + input.value.slice(1).toLowerCase()
    );
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
      addToGroceryDB(
        id,
        input.value[0].toUpperCase() + input.value.slice(1).toLowerCase()
      );
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
}

async function addToGroceryList(item, id) {
  const article = document.createElement("article");
  article.classList.add("grocery-item");
  const attribute = document.createAttribute("data-id");
  // const id = (new Date().getTime() + count).toString();
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
}

function deleteAllItems() {
  fetch("/delete-all-items", {
    method: "POST",
  });
}

// function addToGroceryDB(id, item) {
//   fetch("/save-item", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ id, item }),
//   }).then((res) => {
//     return res.text();
//   });
// }

async function addToGroceryDB(id, item) {
  const response = await fetch("/save-item", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, item }),
  });
  const data = await response.text();
  return data;
}

function deleteFromGroceryDB(id) {
  fetch("/delete-item", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}
