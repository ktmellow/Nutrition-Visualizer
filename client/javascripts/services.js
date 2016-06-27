app.service("NutritionService", function($http) {
  return {
    getSuggestions: function(query) {
      return $http.get('http://localhost:3000/food/suggest?q=' + encodeURIComponent(query));
    },

    // Makes request to backend with sample API request
    getData: function(id) {
      // TO DO: 
      // Form validations?

      return $http.get('http://localhost:3000/food/data?id='+id);
    },

    // Collects only the data necessary for the data visualization
    getNutrients: function(data) {
      return data.nutrients;
    },

    // Collects only macronutrients
    getMacros: function(data) {
      var macroNames = ['Protein', 'Total lipid (fat)', 'Ash', 'Carbohydrate, by difference', 
                        'Fiber, total dietary', 'Sugars, total', 'Water']
      return data.nutrients.filter(function(nutrient) {
        return macroNames.indexOf(nutrient.name)  !== -1;
      })
    },

    // Collects only vitamins
    getMinerals: function(data) {

      // Essential minerals except molybdenum (not found)
      var mineralNames = ["Calcium, Ca", "Fluoride, F", "Copper, Cu", "Iron, Fe", "Potassium, K", "Phosphorus, P",
                          "Magnesium, Mg", "Manganese, Mn", "Selenium, Se", "Sodium, Na", "Zinc, Zn"]
      return data.nutrients.filter(function(nutrient) {
        return mineralNames.indexOf(nutrient.name)  !== -1;
      })
    },

    getVitamins: function(data) {

      // Essential vitamins except biotin (not found)
      var vitaminNames = ["Vitamin A, RAE", "Vitamin A, IU", 
                          "Vitamin B-6", "Vitamin B-6, added", "Vitamin B-12", "Vitamin B-12, added",
                          "Vitamin D", "Vitamin D (D2 + D3)", "Vitamin D3 (cholecalciferol)",
                          "Vitamin E, added", "Folate, DFE", "Folate, food", "Folate, total", 
                          "Vitamin K (phylloquinone)", "Riboflavin", "Thiamin", "Folic acid",
                           "Niacin", "Choline", "Choline, total", "Pantothenic acid", "Carotene, beta", 
                           "Carotene, alpha"]
      return data.nutrients.filter(function(nutrient) {
        return vitaminNames.indexOf(nutrient.name)  !== -1;
      })
    }  

  }
})

