/*
  =========================================
  FOOD TRACKER V2
  =========================================
*/


let db = null;

let selectedFood = null;


// =========================================
// ELEMENTS
// =========================================

const mealInput =
  document.getElementById("meal");

const foodInput =
  document.getElementById("food");

const amountInput =
  document.getElementById("amount");

const unitElement =
  document.getElementById("unit");

const caloriesInput =
  document.getElementById("calories");

const proteinInput =
  document.getElementById("protein");

const suggestionsElement =
  document.getElementById("suggestions");

const nutritionInfo =
  document.getElementById("nutritionInfo");

const foodList =
  document.getElementById("foodList");

const totalCaloriesElement =
  document.getElementById("totalCalories");

const totalProteinElement =
  document.getElementById("totalProtein");

const foodCountElement =
  document.getElementById("foodCount");

const currentDateElement =
  document.getElementById("currentDate");


// =========================================
// DATE
// =========================================

function getLocalDate() {

  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function displayCurrentDate() {

  const date =
    new Date();

  currentDateElement.textContent =
    date.toLocaleDateString(
      undefined,
      {
        weekday: "long",
        day: "numeric",
        month: "long"
      }
    );
}


displayCurrentDate();


// =========================================
// INDEXED DB
// =========================================

const databaseRequest =
  indexedDB.open(
    "FoodTrackerV2",
    1
  );


databaseRequest.onupgradeneeded =
  function (event) {

    const database =
      event.target.result;


    if (
      !database.objectStoreNames.contains(
        "foodLog"
      )
    ) {

      const store =
        database.createObjectStore(
          "foodLog",
          {
            keyPath: "id",
            autoIncrement: true
          }
        );


      store.createIndex(
        "date",
        "date",
        {
          unique: false
        }
      );


      store.createIndex(
        "meal",
        "meal",
        {
          unique: false
        }
      );

    }

  };


databaseRequest.onsuccess =
  function (event) {

    db =
      event.target.result;

    loadToday();

  };


databaseRequest.onerror =
  function () {

    alert(
      "The local food database could not be opened."
    );

  };


// =========================================
// FOOD SEARCH
// =========================================

foodInput.addEventListener(
  "input",
  handleFoodSearch
);


function handleFoodSearch() {

  const search =
    foodInput.value
      .trim()
      .toLowerCase();


  selectedFood = null;

  suggestionsElement.innerHTML = "";


  if (!search) {
    return;
  }


  const results =
    FOOD_DATABASE
      .filter(
        food =>
          food.name
            .toLowerCase()
            .includes(search)
      )
      .slice(0, 8);


  results.forEach(
    food => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "suggestion";


      const name =
        document.createElement(
          "span"
        );


      name.className =
        "suggestion-name";


      name.textContent =
        food.name;


      const info =
        document.createElement(
          "span"
        );


      info.className =
        "suggestion-info";


      if (
        food.type === "weight"
      ) {

        info.textContent =
          `${food.calories} kcal / 100g`;

      } else {

        info.textContent =
          `${food.calories} kcal / ${food.unit}`;

      }


      button.appendChild(name);

      button.appendChild(info);


      button.addEventListener(
        "click",
        () => selectFood(food)
      );


      suggestionsElement.appendChild(
        button
      );

    });

}


// =========================================
// SELECT FOOD
// =========================================

function selectFood(food) {

  selectedFood =
    food;


  foodInput.value =
    food.name;


  amountInput.value =
    food.defaultAmount;


  unitElement.textContent =
    food.unit;


  suggestionsElement.innerHTML =
    "";


  displayNutritionReference(
    food
  );


  calculateNutrition();

}


// =========================================
// NUTRITION REFERENCE
// =========================================

function displayNutritionReference(
  food
) {

  nutritionInfo.classList.remove(
    "hidden"
  );


  if (
    food.type === "weight"
  ) {

    nutritionInfo.textContent =
      `${food.name}: approximately ` +
      `${food.calories} kcal and ` +
      `${food.protein}g protein per 100g.`;

  } else {

    nutritionInfo.textContent =
      `${food.name}: approximately ` +
      `${food.calories} kcal and ` +
      `${food.protein}g protein per ${food.unit}.`;

  }

}


// =========================================
// CALCULATE NUTRITION
// =========================================

amountInput.addEventListener(
  "input",
  calculateNutrition
);


function calculateNutrition() {

  if (!selectedFood) {
    return;
  }


  const amount =
    Number(
      amountInput.value
    );


  if (
    !Number.isFinite(amount) ||
    amount < 0
  ) {

    return;

  }


  let calories = 0;

  let protein = 0;


  if (
    selectedFood.type ===
    "weight"
  ) {

    calories =
      selectedFood.calories *
      amount /
      100;


    protein =
      selectedFood.protein *
      amount /
      100;

  } else {

    calories =
      selectedFood.calories *
      amount;


    protein =
      selectedFood.protein *
      amount;

  }


  caloriesInput.value =
    Math.round(calories);


  proteinInput.value =
    protein.toFixed(1);

}


// =========================================
// ADD FOOD
// =========================================

document
  .getElementById(
    "addFoodButton"
  )
  .addEventListener(
    "click",
    addFood
  );


function addFood() {

  if (!db) {

    alert(
      "The database is still loading."
    );

    return;

  }


  const foodName =
    foodInput.value.trim();


  if (!foodName) {

    alert(
      "Enter a food."
    );

    return;

  }


  const calories =
    Number(
      caloriesInput.value
    );


  const protein =
    Number(
      proteinInput.value
    );


  if (
    !Number.isFinite(calories) ||
    calories < 0
  ) {

    alert(
      "Enter valid calories."
    );

    return;

  }


  if (
    !Number.isFinite(protein) ||
    protein < 0
  ) {

    alert(
      "Enter valid protein."
    );

    return;

  }


  const amount =
    Number(
      amountInput.value
    );


  const item = {

    date:
      getLocalDate(),

    meal:
      mealInput.value,

    food:
      foodName,

    amount:
      Number.isFinite(amount)
        ? amount
        : null,

    unit:
      unitElement.textContent ||
      "",

    calories:
      calories,

    protein:
      protein,

    createdAt:
      Date.now()

  };


  const transaction =
    db.transaction(
      "foodLog",
      "readwrite"
    );


  const store =
    transaction.objectStore(
      "foodLog"
    );


  store.add(item);


  transaction.oncomplete =
    function () {

      clearForm();

      loadToday();

    };

}


// =========================================
// CLEAR FORM
// =========================================

document
  .getElementById(
    "clearButton"
  )
  .addEventListener(
    "click",
    clearForm
  );


function clearForm() {

  selectedFood = null;


  foodInput.value =
    "";


  amountInput.value =
    "";


  caloriesInput.value =
    "";


  proteinInput.value =
    "";


  unitElement.textContent =
    "g";


  suggestionsElement.innerHTML =
    "";


  nutritionInfo.textContent =
    "";


  nutritionInfo.classList.add(
    "hidden"
  );

}


// =========================================
// LOAD TODAY
// =========================================

function loadToday() {

  if (!db) {
    return;
  }


  const transaction =
    db.transaction(
      "foodLog",
      "readonly"
    );


  const store =
    transaction.objectStore(
      "foodLog"
    );


  const dateIndex =
    store.index(
      "date"
    );


  const request =
    dateIndex.getAll(
      getLocalDate()
    );


  request.onsuccess =
    function () {

      const items =
        request.result;


      items.sort(
        (a, b) =>
          a.createdAt -
          b.createdAt
      );


      displayFoodLog(
        items
      );

    };

}


// =========================================
// DISPLAY FOOD LOG
// =========================================

function displayFoodLog(items) {

  foodList.innerHTML =
    "";


  let totalCalories = 0;

  let totalProtein = 0;


  items.forEach(
    item => {

      totalCalories +=
        item.calories;

      totalProtein +=
        item.protein;

    });


  totalCaloriesElement.textContent =
    Math.round(
      totalCalories
    );


  totalProteinElement.textContent =
    totalProtein.toFixed(1);


  foodCountElement.textContent =
    `${items.length} ${
      items.length === 1
        ? "item"
        : "items"
    }`;


  if (
    items.length === 0
  ) {

    foodList.innerHTML = `

      <div class="empty-state">

        Nothing logged yet.

        <br>

        Add your first food above.

      </div>

    `;

    return;

  }


  const meals = [

    "Breakfast",

    "Lunch",

    "Dinner",

    "Snack"

  ];


  meals.forEach(
    meal => {

      const mealItems =
        items.filter(
          item =>
            item.meal === meal
        );


      if (
        mealItems.length === 0
      ) {

        return;

      }


      const group =
        document.createElement(
          "div"
        );


      group.className =
        "meal-group";


      const title =
        document.createElement(
          "div"
        );


      title.className =
        "meal-title";


      title.textContent =
        meal;


      group.appendChild(
        title
      );


      mealItems.forEach(
        item => {

          group.appendChild(
            createFoodElement(
              item
            )
          );

        });


      foodList.appendChild(
        group
      );

    });

}


// =========================================
// CREATE FOOD ELEMENT
// =========================================

function createFoodElement(
  item
) {

  const element =
    document.createElement(
      "div"
    );


  element.className =
    "food-item";


  const details =
    document.createElement(
      "div"
    );


  const name =
    document.createElement(
      "div"
    );


  name.className =
    "food-name";


  name.textContent =
    item.food;


  details.appendChild(
    name
  );


  if (
    item.amount !== null
  ) {

    const amount =
      document.createElement(
        "div"
      );


    amount.className =
      "food-amount";


    amount.textContent =
      `${item.amount} ${item.unit}`;


    details.appendChild(
      amount
    );

  }


  const values =
    document.createElement(
      "div"
    );


  values.className =
    "food-values";


  const calories =
    document.createElement(
      "div"
    );


  calories.className =
    "food-calories";


  calories.textContent =
    `${Math.round(
      item.calories
    )} kcal`;


  const protein =
    document.createElement(
      "div"
    );


  protein.className =
    "food-protein";


  protein.textContent =
    `${item.protein.toFixed(
      1
    )}g protein`;


  const deleteButton =
    document.createElement(
      "button"
    );


  deleteButton.type =
    "button";


  deleteButton.className =
    "delete-button";


  deleteButton.textContent =
    "Delete";


  deleteButton.addEventListener(
    "click",
    () =>
      deleteFood(
        item.id
      )
  );


  values.appendChild(
    calories
  );


  values.appendChild(
    protein
  );


  values.appendChild(
    deleteButton
  );


  element.appendChild(
    details
  );


  element.appendChild(
    values
  );


  return element;

}


// =========================================
// DELETE FOOD
// =========================================

function deleteFood(id) {

  if (!db) {
    return;
  }


  const confirmed =
    confirm(
      "Delete this food?"
    );


  if (!confirmed) {
    return;
  }


  const transaction =
    db.transaction(
      "foodLog",
      "readwrite"
    );


  const store =
    transaction.objectStore(
      "foodLog"
    );


  store.delete(id);


  transaction.oncomplete =
    function () {

      loadToday();

    };

}


// =========================================
// CLOSE SEARCH WHEN CLICKING ELSEWHERE
// =========================================

document.addEventListener(
  "click",
  function (event) {

    if (
      event.target !==
      foodInput &&
      !suggestionsElement.contains(
        event.target
      )
    ) {

      suggestionsElement.innerHTML =
        "";

    }

  }
);