let allRecipes = [];

// Debounce function: Ensures that search is performed after a delay
function debounce(func, delay) {
  let debounceTimer;
  return function (...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Fetch the data when the webpage is loaded
document.addEventListener("DOMContentLoaded", function () {
  fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
    .then((response) => response.json())
    .then((data) => {
      allRecipes = data.meals; // Store the fetched recipes data
      displayRecipes(allRecipes); // Initially display all recipes
    })
    .catch((error) => console.error("Error fetching data:", error));
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

// Search function to filter and display recipes
function searchRecipes() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const filteredRecipes = allRecipes.filter((recipe) => {
    return (
      recipe.strMeal.toLowerCase().includes(query) ||
      recipe.strCategory.toLowerCase().includes(query) ||
      recipe.strArea.toLowerCase().includes(query)
    );
  });
  displayRecipes(filteredRecipes); // Display filtered recipes
}

// Attach the debounce function to the search input
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", debounce(searchRecipes, 300)); 


