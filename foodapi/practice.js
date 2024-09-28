let allRecipes = [];
let categories = [];
let areas = [];
let ingredients = [];

// Debounce function: Ensures that search is performed after a delay
function debounce(func, delay) {
  let debounceTimer;
  return function (...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Fetch the data from three different APIs when the webpage is loaded
document.addEventListener("DOMContentLoaded", function () {
  fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
    .then((response) => response.json())
    .then((data) => {
      allRecipes = data.meals; // Access the 'meals' array
      displayRecipes(allRecipes); // Display all recipes
    })
    .catch((error) => console.error("Error fetching recipes:", error));

  fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then((response) => response.json())
    .then((data) => {
      categories = data.categories; // Access 'categories'
      populateFilterOptions(categories, "category-filters", "strCategory");
    })
    .catch((error) => console.error("Error fetching categories:", error));

  fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    .then((response) => response.json())
    .then((data) => {
      areas = data.meals; // Access 'meals' for areas
      populateFilterOptions(areas, "area-filters", "strArea");
    })
    .catch((error) => console.error("Error fetching areas:", error));

  fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
    .then((response) => response.json())
    .then((data) => {
      ingredients = data.meals; // Access 'meals' for ingredients
      populateFilterOptions(ingredients, "ingredient-filters", "strIngredient");
    })
    .catch((error) => console.error("Error fetching ingredients:", error));
});

// Function to display recipes in the table
function displayRecipes(recipes) {
  const tableBody = document.querySelector("#recipe-table tbody");
  tableBody.innerHTML = ""; // Clear previous table rows

  recipes.forEach((recipe) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${recipe.idMeal}</td>
          <td>${recipe.strMeal}</td>
          <td>${recipe.strCategory}</td>
          <td>${recipe.strArea}</td>
          <td><img src="${recipe.strMealThumb}" alt="Meal Image" width="80"></td>
          <td><a href="${recipe.strYoutube}" target="_blank">Watch on YouTube</a></td>
        `;
    tableBody.appendChild(row);
  });
}

// Function to populate filter options
function populateFilterOptions(items, elementId, key) {
  const container = document.getElementById(elementId);
  items.forEach((item) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = key;
    checkbox.value = item[key];
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(item[key]));
    container.appendChild(label);
  });
}

// Function to filter recipes based on selected checkboxes and search query
function filterRecipes() {
  const searchQuery = document
    .getElementById("search-input")
    .value.toLowerCase();

  const selectedCategories = Array.from(
    document.querySelectorAll('input[name="strCategory"]:checked')
  ).map((input) => input.value);
  const selectedAreas = Array.from(
    document.querySelectorAll('input[name="strArea"]:checked')
  ).map((input) => input.value);
  const selectedIngredients = Array.from(
    document.querySelectorAll('input[name="strIngredient"]:checked')
  ).map((input) => input.value);

  const filteredRecipes = allRecipes.filter((recipe) => {
    const matchesSearch =
      recipe.strMeal.toLowerCase().includes(searchQuery) ||
      recipe.strCategory.toLowerCase().includes(searchQuery) ||
      Object.entries(recipe)
        .filter(([key, value]) => key.includes("strIngredient"))
        .some(
          ([key, ingredient]) =>
            ingredient && ingredient.toLowerCase().includes(searchQuery)
        );

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(recipe.strCategory);
    const matchesArea =
      selectedAreas.length === 0 || selectedAreas.includes(recipe.strArea);
    const matchesIngredients =
      selectedIngredients.length === 0 ||
      selectedIngredients.every((ingredient) =>
        Object.values(recipe).includes(ingredient)
      );

    return (
      matchesSearch && matchesCategory && matchesArea && matchesIngredients
    );
  });

  displayRecipes(filteredRecipes);
}

// Debounce search input
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", debounce(filterRecipes, 300)); // 300ms delay

// Apply filters when the filter button is clicked
document
  .getElementById("apply-filters")
  .addEventListener("click", filterRecipes);

// Toggle filter container visibility
const filterToggleBtn = document.getElementById("filter-toggle");
filterToggleBtn.addEventListener("click", function () {
  const filterContainer = document.getElementById("filter-container");
  filterContainer.style.display =
    filterContainer.style.display === "none" ? "block" : "none";
});
