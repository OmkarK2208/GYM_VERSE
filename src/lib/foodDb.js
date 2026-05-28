// Nutrition data per 100g: [calories, protein(g)]
const FOODS = {
  // Proteins
  "chicken breast": [165, 31], "grilled chicken": [165, 31], "chicken": [239, 27],
  "chicken thigh": [209, 26], "chicken wings": [203, 30], "tandoori chicken": [148, 22],
  "egg": [155, 13], "boiled egg": [155, 13], "scrambled egg": [149, 10], "omelette": [154, 11],
  "egg white": [52, 11], "paneer": [265, 18], "cottage cheese": [98, 11],
  "tofu": [76, 8], "fish": [206, 22], "salmon": [208, 20], "tuna": [130, 29],
  "prawns": [99, 24], "shrimp": [99, 24], "mutton": [294, 25], "lamb": [294, 25],
  "beef": [250, 26], "pork": [242, 27], "turkey": [135, 30],
  "whey protein": [400, 80], "protein shake": [120, 24], "protein bar": [350, 20],

  // Dairy
  "milk": [42, 3], "whole milk": [61, 3], "curd": [60, 3], "yogurt": [59, 10],
  "greek yogurt": [97, 9], "cheese": [402, 25], "butter": [717, 1],
  "ghee": [900, 0], "buttermilk": [40, 3], "lassi": [75, 3],

  // Grains & Rice
  "rice": [130, 3], "white rice": [130, 3], "brown rice": [112, 2],
  "roti": [300, 9], "chapati": [300, 9], "naan": [260, 9], "paratha": [326, 7],
  "bread": [265, 9], "whole wheat bread": [247, 13], "oats": [389, 17], "oatmeal": [71, 3],
  "pasta": [131, 5], "noodles": [138, 5], "maggi": [400, 9],
  "poha": [130, 3], "upma": [150, 4], "idli": [39, 2], "dosa": [168, 4],
  "dal": [116, 9], "lentils": [116, 9], "rajma": [127, 9], "chole": [164, 9],
  "moong dal": [105, 7], "toor dal": [120, 8], "khichdi": [115, 5],

  // Fruits
  "banana": [89, 1], "apple": [52, 0], "mango": [60, 1], "orange": [47, 1],
  "grapes": [69, 1], "watermelon": [30, 1], "papaya": [43, 0], "pineapple": [50, 1],
  "strawberry": [32, 1], "blueberry": [57, 1], "pomegranate": [83, 2],
  "dates": [277, 2], "dry fruits": [520, 15], "almonds": [579, 21],
  "peanuts": [567, 26], "cashews": [553, 18], "walnuts": [654, 15],
  "peanut butter": [588, 25],

  // Vegetables
  "potato": [77, 2], "sweet potato": [86, 2], "broccoli": [34, 3],
  "spinach": [23, 3], "palak": [23, 3], "carrot": [41, 1], "cucumber": [15, 1],
  "tomato": [18, 1], "onion": [40, 1], "capsicum": [20, 1], "mushroom": [22, 3],
  "corn": [86, 3], "peas": [81, 5], "beans": [31, 2], "cabbage": [25, 1],
  "cauliflower": [25, 2], "lady finger": [33, 2], "bhindi": [33, 2],

  // Indian Dishes
  "biryani": [200, 8], "chicken biryani": [220, 12], "veg biryani": [180, 5],
  "dal rice": [140, 6], "rajma chawal": [160, 8], "butter chicken": [175, 14],
  "palak paneer": [170, 10], "paneer butter masala": [230, 12],
  "chole bhature": [420, 12], "samosa": [262, 6], "vada pav": [290, 7],
  "pav bhaji": [250, 7], "dosa masala": [190, 5], "aloo paratha": [270, 6],
  "dal makhani": [140, 7], "kadhi": [80, 3], "pulao": [160, 4],
  "fried rice": [170, 5], "thali": [600, 20],

  // Snacks & Fast Food
  "pizza": [266, 11], "burger": [295, 17], "french fries": [312, 3],
  "sandwich": [250, 10], "wrap": [220, 12], "momos": [200, 10],
  "bhel puri": [170, 5], "pani puri": [180, 4], "pakoda": [270, 6],
  "chips": [536, 7], "biscuit": [440, 7], "cake": [257, 4],
  "chocolate": [546, 5], "ice cream": [207, 3], "brownie": [466, 6],
  "donut": [452, 5], "cookie": [488, 5],

  // Beverages
  "tea": [2, 0], "coffee": [2, 0], "green tea": [1, 0],
  "juice": [45, 0], "orange juice": [45, 1], "coconut water": [19, 0],
  "cold coffee": [90, 3], "milkshake": [112, 4], "smoothie": [80, 3],
  "soda": [41, 0], "energy drink": [45, 0],

  // Supplements
  "creatine": [0, 0], "bcaa": [0, 0], "mass gainer": [450, 25],
};

export function lookupFood(name) {
  if (!name) return null;
  const key = name.toLowerCase().trim();

  // Exact match
  if (FOODS[key]) return { name: key, cal: FOODS[key][0], pro: FOODS[key][1] };

  // Partial match
  for (const [food, vals] of Object.entries(FOODS)) {
    if (key.includes(food) || food.includes(key)) {
      return { name: food, cal: vals[0], pro: vals[1] };
    }
  }
  return null;
}

export function calcNutrition(name, weightGrams) {
  const food = lookupFood(name);
  if (!food || !weightGrams) return null;
  const w = parseFloat(weightGrams);
  return {
    calories: Math.round((food.cal * w) / 100),
    protein: Math.round((food.pro * w) / 100),
    per100: { cal: food.cal, pro: food.pro },
    matchedFood: food.name,
  };
}

export function searchFoods(query, limit = 6) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();
  const results = [];
  for (const [food, vals] of Object.entries(FOODS)) {
    if (food.includes(q) || q.includes(food)) {
      results.push({ name: food, cal: vals[0], pro: vals[1] });
      if (results.length >= limit) break;
    }
  }
  return results;
}
