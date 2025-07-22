let searchInput = document.getElementById("searchInput");
let btn = document.getElementById("btn");
let clear_btn = document.getElementById("btn-clear");
let list = document.getElementById('resultList');
 let meals = [];

async function  fetchdata() {
    try{
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        const data = await response.json();
        console.log(data);
        meals = data.meals;
    } catch(error){
        console.log(error);
    }
    
}
function searchforitems() {
  const values = searchInput.value.trim().toLowerCase();
  list.innerHTML = '';

  const matchedmeals = meals.filter(meal => {
    for (let i = 1; i <= 25; i++) {
      const ingredient = meal[`strIngredient${i}`];
      if (ingredient && ingredient.toLowerCase().includes(values)) {
        return true;
      }
    }
    return false;
  });

  if (matchedmeals.length === 0) {
    list.innerHTML = '<li class="list-group-item text-danger">No meals found with that ingredient.</li>';
  } else {
    matchedmeals.forEach(meal => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="row g-0">
          <div class="col-md-4 bg-light">
            <img src="${meal.strMealThumb}" class="img-fluid rounded-start" alt="${meal.strMeal}">
          </div>
          <div class="col-md-8  bg-light">
            <div class="card-body bg-light">
              <h5 class="card-title">${meal.strMeal}</h5>
              <p class="card-text">${meal.strInstructions.substring(0,200)}...</p>
              <a href="${meal.strSource}"class="btn btn-outline-primary btn-sm">View details</a>
            </div>
          </div>
        </div>
      `;
      list.appendChild(card);
    });
  }
}


  btn.addEventListener("click", searchforitems);


clear_btn.onclick = function(){
  list.innerHTML = '';
  searchInput.value = '';
}

fetchdata();

