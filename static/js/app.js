import sublinks from "./data.js";

/////////// Recipe section ////////

const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const allRecipes = document.querySelector(".all-recipes");
const pagination = document.querySelector(".pagination");

const default_url = "https://www.themealdb.com/api/json/v1/1/search.php?s=a";

const getData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const pages = ({ meals }) => {
  if (!meals) {
    return;
  }
  const itemNumber = 9;
  const len = Math.ceil(meals.length / itemNumber);
  const newArray = Array.from({ length: len }, (_, index) => {
    const start = itemNumber * index;
    return meals.slice(start, start + itemNumber);
  });
  return newArray;
};

const displayRecipe = (meals) => {
  allRecipes.innerHTML = meals
    .map((meal) => {
      const { idMeal: id, strMeal: name, strMealThumb: image } = meal;
      return `<article>
      
      
      <a href="/recipe/${id}">
      <div  class="recipe-image">
       <img src="${image}" >
    </div>
      </a>
   
    <h6>${name}</h6>

    </article>`;
    })
    .join(" ");
};

const displayPagination = (array) => {
  pagination.innerHTML = `<li class="prev">
      <a class="page-link" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>${array
      .map((_, index) => {
        return `<li class="page-item" data-id="${index}"><a class="page-link"  >${
          index + 1
        }</a></li>`;
      })
      .join(" ")} <li class="next">
      <a class="page-link"  aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>`;
};

const setup = (data) => {
  const mypage = pages(data);
  let count = 0;

  if (!mypage) {
    allRecipes.innerHTML = `<h5 style="color:red">Sorry, there is no recipe matched your search</h5>`;
    allRecipes.classList.add("error");
    pagination.innerHTML = "";
    return;
  }

  allRecipes.classList.remove("error");
  displayRecipe(mypage[0]);
  displayPagination(mypage);
  const allpage = document.querySelectorAll(".page-item");
  allpage[0].classList.add("active-page");

  function removeActive() {
    allpage.forEach((page) => {
      page.classList.remove("active-page");
    });
  }

  allpage.forEach((page) => {
    page.addEventListener("click", (e) => {
      removeActive();
      const id = parseInt(e.currentTarget.dataset.id);
      count = id;
      displayRecipe(mypage[id]);
      page.classList.add("active-page");
    });
  });

  const next = document.querySelector(".next");
  next.addEventListener("click", () => {
    count += 1;
    if (count > allpage.length - 1) {
      count = 0;
    }
    displayRecipe(mypage[count]);
    removeActive();
    allpage[count].classList.add("active-page");
  });

  const prev = document.querySelector(".prev");
  prev.addEventListener("click", () => {
    count -= 1;
    if (count < 0) {
      count = allpage.length - 1;
    }
    displayRecipe(mypage[count]);
    removeActive();
    allpage[count].classList.add("active-page");
  });
};

const start = async (url) => {
  const data = await getData(url);
  setup(data);
};

start(default_url);

form.addEventListener("keyup", async () => {
  const data = await getData(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput.value}`
  );
  setup(data);
});

// filter section

const categories = document.querySelector(".categories");
const areas = document.querySelector(".countries");

const getCategories = async () => {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
  );
  const data = await response.json();
  return data;
};

const getAreas = async () => {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  const data = await response.json();
  return data;
};

const displayFilter = async (selector, fun, filter, letter) => {
  const data = await fun();
  const { meals } = data;

  selector.innerHTML = meals
    .map((meal) => {
      const item = meal[`str${filter}`];
      return `<button class="filter-btn" data-filter="${item}">${item}</button>`;
    })
    .join("");

  selector.addEventListener("click", (e) => {
    searchInput.value = "";
    if (e.target.dataset.filter) {
      const filter = e.target.dataset.filter;
      start(
        `https://www.themealdb.com/api/json/v1/1/filter.php?${letter}=${filter}`
      );
    }
  });
};

const setupFilter = async () => {
  await displayFilter(categories, getCategories, "Category", "c");
  await displayFilter(areas, getAreas, "Area", "a");
};
setupFilter();
