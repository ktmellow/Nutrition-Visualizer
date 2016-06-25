app.controller("NutritionController", ['NutritionService', function(NutritionService) {
  const vm = this;
  vm.form = {};
  vm.data;

  vm.submit = function(){
    // console.log(vm.form.query);
    NutritionService.getData().then(function(data) {
      vm.data = data.data.parsed_body.report.food;
      vm.data = NutritionService.getNutrients(vm.data);

      vm.macroData = NutritionService.getMacros(vm.data)
      window.data = vm.data;
      vm.macroPieMaker();
    });
  }

  // Display Pie Chart of Macronutrients
  // Following tutorial from 
  // http://zeroviscosity.com/d3-js-step-by-step/step-1-a-basic-pie-chart
  // TO DO: Move logic to services.js
  vm.macroPieMaker = function() {
    vm.macros = NutritionService.getMacros(data);
    window.macros = vm.macros;

    var macroColors = ['#ECD078', '#D95B43', '#C02942', '#542437', '#53777A', '#CFF09E', '#A8DBA8', '#3B8686'];
    
    var color = d3.scale.ordinal()
      .range(macroColors); 

    var width = 360;
    var height = 360;
    var radius = Math.min(width, height) / 2;

    var svg = d3.select('#macroPie')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) + 
        ',' + (height / 2) + ')');

    var arc = d3.svg.arc()
      .outerRadius(radius);

    var pie = d3.layout.pie()
      .value(function(d) { return +d.value; })
      .sort(null);

    var path = svg.selectAll('path')
      .data(pie(vm.macros))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d, i) { 
        return color(macroColors[i]);
      });
  }
  

  // Display Bar Chart of Vitamins 

  // Display Bar Chart of Minerals



}]);
