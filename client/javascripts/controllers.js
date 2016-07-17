app.controller("NutritionController", ['NutritionService', function(NutritionService) {
  const vm = this;
  vm.form = {
    amt: 100,
    units: 'g'
  };
  vm.foodData;
  vm.results;
  vm.macros;
  vm.calories;
  vm.vitamins;
  vm.minerals;
  vm.search = { placeholder: 'Search for food' };

  vm.submit = function(id) {
    var id = id || '01009';
    NutritionService.getData(id).then(function(data) {
      vm.foodData = data.data.parsed_body.report.food;
      vm.macros = NutritionService.getMacros(vm.foodData);
      vm.minerals = NutritionService.getMinerals(vm.foodData);
      vm.vitamins = NutritionService.getVitamins(vm.foodData);
      vm.calories = NutritionService.getCalories(vm.foodData);
      vm.results = data.data.parsed_body.report.food.name;
    });
  }

  vm.getSuggestions = function() {
    NutritionService.getSuggestions(vm.form.query).then(function(data) {
      vm.search.suggestions = data.data.parsed_body.list.item;
    });
  }    
}]);

app.controller("EvalController", ['NutritionService', 'EvalService', 'ConversionService', '$route', function(NutritionService, EvalService, ConversionService, $route, ngAnimate) {
  const vm = this;
  vm.form = {
    amt: 100,
    units: 'g'
  };
  vm.options = ['g', 'oz', 'fl oz']
  vm.foodData;
  vm.results;
  vm.macros;
  vm.calories;
  vm.vitamins;
  vm.minerals;
  vm.search = { placeholder: 'Search for food' };

  vm.data = { foods: [], totals: {macros: {}, vitamins: {}, minerals: {}, calories: {}}};

  vm.add = function(id, amt, units) {
    var id = id || '01009';
    NutritionService.getData(id).then(function(data) {
      vm.foodData = data.data.parsed_body.report.food;
      window.foodData = vm.foodData;
      vm.foodData.amt = vm.form.amt;
      vm.foodData.userUnits = vm.form.units;
      // vm.foodData.amt = amt;
      // vm.foodData.units = units;
      vm.macros = NutritionService.getMacros(vm.foodData);
      vm.minerals = NutritionService.getMinerals(vm.foodData);
      vm.vitamins = NutritionService.getVitamins(vm.foodData);
      vm.calories = NutritionService.getCalories(vm.foodData);
      vm.results = data.data.parsed_body.report.food.name;

      // Updating data
      vm.data.foods.push(vm.foodData);
      vm.data.totals.macros = EvalService.addNutrients(vm.data.totals.macros, 
                                                       vm.macros, 
                                                       vm.form.amt,
                                                       vm.form.units,
                                                       ConversionService.toGrams);
      vm.data.totals.calories = EvalService.addCalories(vm.data.totals.calories, 
                                                        vm.calories,
                                                        vm.form.amt,
                                                        vm.form.units,
                                                        ConversionService.toGrams);
      vm.data.totals.minerals = EvalService.addNutrients(vm.data.totals.minerals, 
                                                         vm.minerals,
                                                         vm.form.amt,
                                                         vm.form.units,
                                                         ConversionService.toGrams);
      vm.data.totals.vitamins = EvalService.addNutrients(vm.data.totals.vitamins, 
                                                         vm.vitamins,
                                                         vm.form.amt,
                                                         vm.form.units,
                                                         ConversionService.toGrams);
      vm.data.totals.water = vm.data.totals.macros["Water"];
      console.log("changed", vm.data.totals);
    });
  }

  vm.clear = function() {
    $route.reload()
  }

  vm.remove = function(food) {
    NutritionService.getData(food.ndbno).then(function(data) {

      var foodData = data.data.parsed_body.report.food;      
      var removeMacros = NutritionService.getMacros(foodData);
      var removeMinerals = NutritionService.getMinerals(foodData);
      var removeVitamins = NutritionService.getVitamins(foodData);
      var removeCalories = NutritionService.getCalories(foodData);

      vm.data.totals.macros = EvalService.subtractNutrients(vm.data.totals.macros, 
                                                       removeMacros, 
                                                       food.amt,
                                                       food.userUnits,
                                                       ConversionService.toGrams);
      
      vm.data.totals.minerals = EvalService.subtractNutrients(vm.data.totals.minerals, 
                                                         removeMinerals,
                                                         food.amt,
                                                         food.userUnits,
                                                         ConversionService.toGrams);

      vm.data.totals.vitamins = EvalService.subtractNutrients(vm.data.totals.vitamins, 
                                                         removeVitamins,
                                                         food.amt,
                                                         food.userUnits,
                                                         ConversionService.toGrams);

      vm.data.totals.calories = EvalService.subtractCalories(vm.data.totals.calories,
                                                             removeCalories,
                                                             food.amt,
                                                             food.userUnits,
                                                             ConversionService.toGrams);

      vm.data.totals.water = vm.data.totals.macros["Water"];

      vm.data.foods.splice(vm.data.foods.indexOf(food), 1);
    });
  }


  vm.getSuggestions = function() {
    NutritionService.getSuggestions(vm.form.query).then(function(data) {
      window.suggests = data.data.parsed_body
      console.log(data.data.parsed_body.list.item)
      vm.search.suggestions = data.data.parsed_body.list.item;
      // vm.search.suggestions = data.data.parsed_body.list.item;
    });
  }

    // vm.myInterval = 3000;
    // var slides = vm.slides = [];
    // vm.addSlide = function() {
    //   var newWidth = 600 + slides.length + 1;
    //   slides.push({
    //     image: 'http://placekitten.com/' + newWidth + '/300',
    //     text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
    //       ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
    //   });
    // };
    // for (var i=0; i<4; i++) {
    //   vm.addSlide();
    // }
}])

// app.controller('CarouselDemoCtrl', function ($scope) {
//   $scope.myInterval = 3000;
//   var slides = $scope.slides = [];
//   $scope.addSlide = function() {
//     var newWidth = 600 + slides.length + 1;
//     slides.push({
//       image: 'http://placekitten.com/' + newWidth + '/300',
//       text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
//         ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
//     });
//   };
//   for (var i=0; i<4; i++) {
//     $scope.addSlide();
//   }
// });
