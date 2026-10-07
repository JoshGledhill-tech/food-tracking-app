/*
  =========================================
  FOOD TRACKER V2.1
  =========================================
*/


let db = null;

let selectedFood = null;

/*
  selectedDate stores the diary date
  currently being viewed.

  IMPORTANT:
  We use LOCAL dates rather than UTC dates.
*/

let selectedDate = getLocalDate();


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

const selectedDateLabel =
  document.getElementById("selectedDateLabel");

const selectedDateSubLabel =
  document.getElementById("selectedDateSubLabel");

const addFoodDateLabel =
  document.getElementById("addFoodDateLabel");

const diaryHeading =
  document.getElementById("diaryHeading");

const datePicker =
  document.getElementById("datePicker");

const previousDayButton =
  document.getElementById("previousDayButton");

const nextDayButton =
  document.getElementById("nextDayButton");

const todayButton =
  document.getElementById("todayButton");


// =========================================
// LOCAL DATE HELPERS
// =========================================

function getLocalDate(date = new Date()) {

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


/*
  Converts YYYY-MM-DD into a Date
  without accidentally converting
  it through UTC.
*/

function parseLocalDate(dateString) {

  const parts =
    dateString.split("-");

  const year =
    Number(parts[0]);

  const month =
    Number(parts[1]) - 1;

  const day =
    Number(parts[2]);

  return new Date(
    year,
    month,
    day
  );

}


function changeDateByDays(
  dateString,
  amount
) {

  const date =
    parseLocalDate(
      dateString
    );

  date.setDate(
    date.getDate() + amount
  );

  return getLocalDate(
    date
  );

}


// =========================================
// DATE FORMATTING
// =========================================

function formatLongDate(
  dateString
) {

  const date =
    parseLocalDate(
      dateString
    );

  return date.toLocaleDateString(
    undefined,
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

}


function formatShortDate(
  dateString
) {

  const date =
    parseLocalDate(
      dateString
    );

  return date.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short"
    }
  );

}


// =========================================
// DATE NAVIGATION DISPLAY
// =========================================

function updateDateDisplay() {

  const today =
    getLocalDate();

  const isToday =
    selectedDate === today;


  /*
    Main navigation label
  */

  if (isToday) {

    selectedDateLabel.textContent =
      "Today";

    selectedDateSubLabel.textContent =
      formatLongDate(
        selectedDate
      );

    diaryHeading.textContent =
      "Today";

    addFoodDateLabel.textContent =
      "Adding to today";

  } else {

    selectedDateLabel.textContent =
      formatLongDate(
        selectedDate
      );

    selectedDateSubLabel.textContent =
      "";

    diaryHeading.textContent =
      formatLongDate(
        selectedDate
      );

    addFoodDateLabel.textContent =
      `Adding to ${formatShortDate(
        selectedDate
      )}`;

  }


  /*
    Keep date picker synced.
  */

  datePicker.value =
    selectedDate;


  /*
    Do not allow selecting
    future dates.
  */

  datePicker.max =
    today;


  /*
    Disable next arrow when
    already viewing today.
  */

  nextDayButton.disabled =
    isToday;


  /*
    Today button is unnecessary
    while already on today.
  */

  todayButton.disabled =
    isToday;

}


// =========================================
// PREVIOUS DAY
// =========================================

previousDayButton.addEventListener(
  "click",
  function () {

    selectedDate =
      changeDateByDays(
        selectedDate,
        -1
      );

    updateDateDisplay();

    loadSelectedDate();

  }
);


// =========================================
// NEXT DAY
// =========================================

nextDayButton.addEventListener(
  "click",
  function () {

    const today =
      getLocalDate();


    const nextDate =
      changeDateByDays(
        selectedDate,
        1
      );


    /*
      Prevent future navigation.
    */

    if (
      nextDate > today
    ) {

      return;

    }


    selectedDate =
      nextDate;


    updateDateDisplay();

    loadSelectedDate();

  }
);


// =========================================
// TODAY BUTTON
// =========================================

todayButton.addEventListener(
  "click",
  function () {

    selectedDate =
      getLocalDate();

    updateDateDisplay();

    loadSelectedDate();

  }
);


// =========================================
// DATE PICKER
// =========================================

datePicker.addEventListener(
  "change",
  function () {

    if (!datePicker.value) {
      return;
    }


    const today =
      getLocalDate();


    /*
      Extra protection against
      future dates.
    */

    if (
      datePicker.value > today
    ) {

      selectedDate =
        today;

    } else {

      selectedDate =
        datePicker.value;

    }


    updateDateDisplay();

    loadSelectedDate();

  }
);


// =========================================
// INDEXED DB
// =========================================

/*
  IMPORTANT:

  This intentionally keeps the SAME
  database name and version as V2.

  This means existing V2 diary entries
  on the same browser/origin can continue
  to be used.
*/

const databaseRequest =
  indexedDB.open(
    "FoodTrackerV2",
    1
  );


databaseRequest.onupgradeneeded =
  function (event) {

    const database =
      event.target.result;


    /*
      This is mainly for fresh installs.

      Existing V2 installations already
      have this store.
    */

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


    updateDateDisplay();

    loadSelectedDate();

  };


databaseRequest.onerror =
  function () {

    alert(
      "The local food diary could not be opened."
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


  /*
    If the user manually edits the
    food name after selecting a food,
    stop treating it as that database food.
  */

  selectedFood = null;


  suggestionsElement.innerHTML =
    "";


  nutritionInfo.classList.add(
    "hidden"
  );


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
      .slice(
        0,
        8
      );


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
        food.type ===
        "weight"
      ) {

        info.textContent =
          `${food.calories} kcal / 100g`;

      } else {

        info.textContent =
          `${food.calories} kcal / ${food.unit}`;

      }


      button.appendChild(
        name
      );


      button.appendChild(
        info
      );


      button.addEventListener(
        "click",
        function () {

          selectFood(
            food
          );

        }
      );


      suggestionsElement.appendChild(
        button
      );

    });

}


// =========================================
// SELECT FOOD
// =========================================

function selectFood(
  food
) {

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
// NUTRITION INFORMATION
// =========================================

function displayNutritionReference(
  food
) {

  nutritionInfo.classList.remove(
    "hidden"
  );


  if (
    food.type ===
    "weight"
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
    !Number.isFinite(
      amount
    ) ||
    amount < 0
  ) {

    return;

  }


  let calories =
    0;

  let protein =
    0;


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
    Math.round(
      calories
    );


  proteinInput.value =
    protein.toFixed(
      1
    );

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
      "The food diary is still loading."
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
    !Number.isFinite(
      calories
    ) ||
    calories < 0
  ) {

    alert(
      "Enter valid calories."
    );

    return;

  }


  if (
    !Number.isFinite(
      protein
    ) ||
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


  /*
    IMPORTANT:

    The food is saved against
    selectedDate, NOT automatically
    against today.

    This allows historical diary editing.
  */

  const item = {

    date:
      selectedDate,

    meal:
      mealInput.value,

    food:
      foodName,

    amount:
      Number.isFinite(
        amount
      )
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


  store.add(
    item
  );


  transaction.oncomplete =
    function () {

      clearForm();

      loadSelectedDate();

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

  selectedFood =
    null;


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
// LOAD SELECTED DIARY DATE
// =========================================

function loadSelectedDate() {

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
      selectedDate
    );


  request.onsuccess =
    function () {

      const items =
        request.result;


      /*
        Old V2 records should already
        contain createdAt.

        The fallback prevents problems
        if one doesn't.
      */

      items.sort(
        function (
          a,
          b
        ) {

          return (
            (a.createdAt || 0) -
            (b.createdAt || 0)
          );

        }
      );


      displayFoodLog(
        items
      );

    };

}


// =========================================
// DISPLAY FOOD LOG
// =========================================

function displayFoodLog(
  items
) {

  foodList.innerHTML =
    "";


  let totalCalories =
    0;

  let totalProtein =
    0;


  items.forEach(
    function (item) {

      totalCalories +=
        Number(
          item.calories
        ) || 0;


      totalProtein +=
        Number(
          item.protein
        ) || 0;

    }
  );


  totalCaloriesElement.textContent =
    Math.round(
      totalCalories
    );


  totalProteinElement.textContent =
    totalProtein.toFixed(
      1
    );


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

        Nothing logged for this day.

        <br>

        You can add food above.

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
    function (meal) {

      const mealItems =
        items.filter(
          function (item) {

            return (
              item.meal === meal
            );

          }
        );


      if (
        mealItems.length === 0
      ) {

        return;

      }


      createMealGroup(
        meal,
        mealItems
      );

    }
  );

}


// =========================================
// CREATE MEAL GROUP
// =========================================

function createMealGroup(
  meal,
  mealItems
) {

  const group =
    document.createElement(
      "div"
    );


  group.className =
    "meal-group";


  const headingRow =
    document.createElement(
      "div"
    );


  headingRow.className =
    "meal-title-row";


  const title =
    document.createElement(
      "div"
    );


  title.className =
    "meal-title";


  title.textContent =
    meal;


  /*
    Calculate the meal calorie total.
  */

  const mealCalories =
    mealItems.reduce(
      function (
        total,
        item
      ) {

        return (
          total +
          (
            Number(
              item.calories
            ) || 0
          )
        );

      },
      0
    );


  const mealTotal =
    document.createElement(
      "div"
    );


  mealTotal.className =
    "meal-total";


  mealTotal.textContent =
    `${Math.round(
      mealCalories
    )} kcal`;


  headingRow.appendChild(
    title
  );


  headingRow.appendChild(
    mealTotal
  );


  group.appendChild(
    headingRow
  );


  mealItems.forEach(
    function (item) {

      group.appendChild(
        createFoodElement(
          item
        )
      );

    }
  );


  foodList.appendChild(
    group
  );

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


  /*
    LEFT SIDE
  */

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
    item.amount !== null &&
    item.amount !== undefined
  ) {

    const amount =
      document.createElement(
        "div"
      );


    amount.className =
      "food-amount";


    amount.textContent =
      `${item.amount} ${item.unit || ""}`;


    details.appendChild(
      amount
    );

  }


  /*
    RIGHT SIDE
  */

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
      Number(
        item.calories
      ) || 0
    )} kcal`;


  const protein =
    document.createElement(
      "div"
    );


  protein.className =
    "food-protein";


  protein.textContent =
    `${(
      Number(
        item.protein
      ) || 0
    ).toFixed(
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
    function () {

      deleteFood(
        item.id
      );

    }
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

function deleteFood(
  id
) {

  if (!db) {
    return;
  }


  const confirmed =
    confirm(
      "Delete this food from the diary?"
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


  store.delete(
    id
  );


  transaction.oncomplete =
    function () {

      loadSelectedDate();

    };

}


// =========================================
// CLOSE AUTOCOMPLETE
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


// =========================================
// INITIAL DATE DISPLAY
// =========================================

updateDateDisplay();
