const sublinks = [
  {
    page: "home",
    links: [
      {
        label: "search recipe",
        icon: "fa-sharp fa-solid fa-magnifying-glass",
        url: "/",
      },
    ],
  },
  {
    page: "mealboard",
    links: [
      {
        label: "mealboard",
        icon: "fa-sharp fa-solid fa-clipboard-list",
        url: "/mealboard",
      },
      {
        label: "shopping list",
        icon: "fa-sharp fa-solid fa-clipboard-list",
        url: "/mealboard",
      },
    ],
  },
  {
    page: "about",
    links: [
      { label: "our story", icon: "fas fa-briefcase", url: "/" },
      { label: "career", icon: "fas fa-briefcase", url: "/" },
      { label: "contact", icon: "fas fa-briefcase", url: "/" },
      { label: "Q&A", icon: "fas fa-briefcase", url: "/" },
    ],
  },
];

export default sublinks;
