import sublinks from "./data.js";

////////// nav section /////////

const sidebarWrapper = document.querySelector(".sidebar-wrapper");
const sidebar = document.querySelector(".sidebar-links");
const toggleBtn = document.querySelector(".toggle-btn");
const closeBtn = document.querySelector(".close-btn");
const linkBtns = document.querySelectorAll(".link-btn");
const submenu = document.querySelector(".submenu");
const nav = document.querySelector(".nav");
const hero = document.querySelector(".hero");
const singleRecipe = document.querySelector(".single-recipe");
const mealGrocery = document.querySelector(".meal-grocery");
const registerSection = document.querySelector(".register-section");
const loginSection = document.querySelector(".login-section");

const displaySidebar = sublinks
  .map((item) => {
    const { page, links } = item;
    return `<article>
    <h4 class="page-name">${page}</h4>
    <div class="sidebar-sublinks">
    ${links
      .map((link) => {
        return `<a href="${link.url}"><i class="${link.icon}"></i>${link.label}</a>`;
      })
      .join(" ")}
    </div>
    </article>`;
  })
  .join(" ");

sidebar.innerHTML = displaySidebar;

toggleBtn.addEventListener("click", () => {
  sidebarWrapper.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  sidebarWrapper.classList.remove("show");
});

linkBtns.forEach((btn) => {
  btn.addEventListener("mouseover", (e) => {
    e.stopPropagation();
    const text = e.currentTarget.textContent;
    const measure = e.currentTarget.getBoundingClientRect();
    const bottom = measure.offsetTop;
    const center = measure.left + measure.width / 2;
    sublinks.forEach((link) => {
      const { page, links } = link;
      var col = links.length;
      if (link.length > 4) {
        col = 4;
      }

      if (page === text) {
        submenu.innerHTML = `<article>
            <h4 class="page-name">${page}</h4>
            <div class="submenu-container col-${col}">${links
          .map((link) => {
            return `<a href=${link.url}><i class="${link.icon}"></i>${link.label}</a>`;
          })
          .join(" ")}
            </div>
            </article>`;
      }
    });
    submenu.style.display = "block";
    submenu.style.left = `${center}px`;
    submenu.style.top = `${bottom}px`;
  });
});

nav.addEventListener("mouseover", () => {
  submenu.style.display = "none";
});
if (hero) {
  hero.addEventListener("mouseover", () => {
    submenu.style.display = "none";
  });
}
if (singleRecipe) {
  singleRecipe.addEventListener("mouseover", () => {
    submenu.style.display = "none";
  });
}
if (mealGrocery) {
  mealGrocery.addEventListener("mouseover", () => {
    submenu.style.display = "none";
  });
}
if (registerSection) {
  registerSection.addEventListener("mouseover", () => {
    submenu.style.display = "none";
  });
}
if (loginSection) {
  loginSection.addEventListener("mouseover", () => {
    submenu.style.display = "none";
  });
}

////////// Footer content /////////////

const footer = document.querySelector(".footer-container");

const displayFooter = () => {
  footer.innerHTML = `<div class="info about">
          <h5>Food Fun</h5>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
            minus iusto error ullam. Quis similique aut quia expedita natus?
            Quos error nobis perferendis magni est voluptatibus! Rerum, at.
            Pariatur, fugit!
          </p>
        </div> ${sublinks
          .map((link) => {
            const { page, links } = link;
            return `<div class="info">
            <h5>${page}</h5>
            <p>${links
              .map((item) => {
                return `<li><a href="${item.url}">${item.label}</a></li>`;
              })
              .join("")} </p>

            </div>`;
          })
          .join("")}
          <div class="info contact">
          <h5>Contact</h5>
          <li><a href="#"><i class="fa-brands fa-facebook"></i></a></li>
          <li><a href="#"><i class="fa-brands fa-instagram"></i></i></a></li>
          <li><a href="#"><i class="fa-brands fa-twitter"></i></a></li>

          </div>
        `;
};

displayFooter();
