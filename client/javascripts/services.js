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
      return data.nutrients.slice(3,9).concat(data.nutrients[0])
    }
  }
})

