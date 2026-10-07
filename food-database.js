/*
  Food Tracker V2
  Local Nutrition Database

  Foods using:
      type: "weight"

  store nutrition per 100g.

  Foods using:
      type: "item"

  store nutrition per individual item.
*/


const FOOD_DATABASE = [

  // ========================================
  // FRUIT
  // ========================================

  {
    name: "Banana",
    category: "Fruit",

    type: "weight",
    unit: "g",

    calories: 89,
    protein: 1.1,

    defaultAmount: 120
  },

  {
    name: "Apple",
    category: "Fruit",

    type: "weight",
    unit: "g",

    calories: 52,
    protein: 0.3,

    defaultAmount: 180
  },


  // ========================================
  // FISH
  // ========================================

  {
    name: "Salmon",
    category: "Fish",

    type: "weight",
    unit: "g",

    calories: 208,
    protein: 20,

    defaultAmount: 150
  },


  // ========================================
  // EGGS
  // ========================================

  {
    name: "Egg",
    category: "Eggs",

    type: "item",
    unit: "egg",

    calories: 72,
    protein: 6.3,

    defaultAmount: 1
  },


  // ========================================
  // CARBOHYDRATES
  // ========================================

  {
    name: "Cooked white rice",
    category: "Carbohydrates",

    type: "weight",
    unit: "g",

    calories: 130,
    protein: 2.7,

    defaultAmount: 150
  },

  {
    name: "Cooked brown rice",
    category: "Carbohydrates",

    type: "weight",
    unit: "g",

    calories: 123,
    protein: 2.7,

    defaultAmount: 150
  },

  {
    name: "New potatoes",
    category: "Carbohydrates",

    type: "weight",
    unit: "g",

    calories: 87,
    protein: 1.9,

    defaultAmount: 200
  },

  {
    name: "Bagel",
    category: "Bread",

    type: "item",
    unit: "bagel",

    calories: 250,
    protein: 9,

    defaultAmount: 1
  },

  {
    name: "Breadstick",
    category: "Bread",

    type: "item",
    unit: "breadstick",

    calories: 40,
    protein: 1.2,

    defaultAmount: 1
  },


  // ========================================
  // DAIRY
  // ========================================

  {
    name: "Cream cheese",
    category: "Dairy",

    type: "weight",
    unit: "g",

    calories: 225,
    protein: 5.5,

    defaultAmount: 40
  },

  {
    name: "Greek yoghurt",
    category: "Dairy",

    type: "weight",
    unit: "g",

    calories: 97,
    protein: 9,

    defaultAmount: 150
  },

  {
    name: "Natural yoghurt",
    category: "Dairy",

    type: "weight",
    unit: "g",

    calories: 63,
    protein: 5.3,

    defaultAmount: 150
  },

  {
    name: "Cheddar cheese",
    category: "Dairy",

    type: "weight",
    unit: "g",

    calories: 402,
    protein: 25,

    defaultAmount: 30
  },


  // ========================================
  // VEGETARIAN PROTEIN
  // ========================================

  {
    name: "Hummus",
    category: "Vegetarian Protein",

    type: "weight",
    unit: "g",

    calories: 166,
    protein: 7.9,

    defaultAmount: 50
  },

  {
    name: "Tofu",
    category: "Vegetarian Protein",

    type: "weight",
    unit: "g",

    calories: 144,
    protein: 17,

    defaultAmount: 150
  },

  {
    name: "Cooked lentils",
    category: "Vegetarian Protein",

    type: "weight",
    unit: "g",

    calories: 116,
    protein: 9,

    defaultAmount: 150
  },

  {
    name: "Cooked chickpeas",
    category: "Vegetarian Protein",

    type: "weight",
    unit: "g",

    calories: 164,
    protein: 8.9,

    defaultAmount: 150
  },

  {
    name: "Edamame",
    category: "Vegetarian Protein",

    type: "weight",
    unit: "g",

    calories: 121,
    protein: 12,

    defaultAmount: 100
  },


  // ========================================
  // VEGETABLES
  // ========================================

  {
    name: "Broccoli",
    category: "Vegetables",

    type: "weight",
    unit: "g",

    calories: 35,
    protein: 2.4,

    defaultAmount: 100
  },

  {
    name: "Tenderstem broccoli",
    category: "Vegetables",

    type: "weight",
    unit: "g",

    calories: 35,
    protein: 3,

    defaultAmount: 100
  },

  {
    name: "Tomato",
    category: "Vegetables",

    type: "weight",
    unit: "g",

    calories: 18,
    protein: 0.9,

    defaultAmount: 80
  },

  {
    name: "Cucumber",
    category: "Vegetables",

    type: "weight",
    unit: "g",

    calories: 15,
    protein: 0.7,

    defaultAmount: 80
  },

  {
    name: "Lettuce",
    category: "Vegetables",

    type: "weight",
    unit: "g",

    calories: 15,
    protein: 1.4,

    defaultAmount: 50
  },

  {
    name: "Spinach",
    category: "Vegetables",

    type: "weight",
    unit: "g",

    calories: 23,
    protein: 2.9,

    defaultAmount: 100
  },


  // ========================================
  // DRINKS
  // ========================================

  {
    name: "Black coffee",
    category: "Drinks",

    type: "item",
    unit: "cup",

    calories: 3,
    protein: 0.3,

    defaultAmount: 1
  }

];