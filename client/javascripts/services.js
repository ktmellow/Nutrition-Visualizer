app.service("NutritionService", function($http) {
  return {

    // Makes request to backend with sample API request
    getData: function() {
      // TO DO: 
      // Form validations

      return $http.get('http://localhost:3000/foodData')
    },

    // Collects only the data necessary for the data visualization
    getNutrients: function(data) {
      return data.nutrients;
    },

    // Collects only macronutrients
    getMacros: function(data) {
      return data.nutrients.slice(3,9).concat(data.nutrients[0])
    }
  }
})

