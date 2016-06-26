// Display Pie Chart of Macronutrients
// Following tutorial from 
// http://zeroviscosity.com/d3-js-step-by-step/step-1-a-basic-pie-chart
app.directive("pie", function(){
  return {
    templateUrl: "/client/partials/pie.html",
    restrict: 'AE',
    scope: {
      dataset: '<',
      pieType: '<'
    },
    controller: function(){},
    controllerAs: 'vm',
    bindToController: true,
    link: function(scope, element, attrs, vm) {

      var dataset = vm.dataset;

      var colors;
      var macroColors = ['#ECD078', '#D95B43', '#C02942', '#542437', '#53777A', '#CFF09E', '#A8DBA8', '#3B8686'];

      if (vm.pieType === "macroPie") {
        colors = macroColors;
      } else {
        // Use a different color pallet in the future.
        colors = macroColors;
      }

      var color = d3.scale.ordinal().range(colors); 

       var height = 360;
       var width = 360;
       var radius = Math.min(width, height) / 2;
       var donutWidth = 100;
       
       dataset.forEach(function(d) {
         d.enabled = true;
       });

       // Creates a canvas and sets placeholder values
       var svg = d3.select('div')
         .append('svg')
         .attr('width', width)
         .attr('height', height)
         .append('g')
         .attr('transform', 'translate(' + (width / 2) + 
           ',' + (height / 2) + ')');

       // Determine nutrient radius
       var arc = d3.svg.arc()
         .innerRadius(radius - donutWidth)
         .outerRadius(radius);

       // Determine value from dataset
       var pie = d3.layout.pie()
         .value(function(d) { return +d.value; })
         .sort(null);

       // Use the above to create pie chart
       var path = svg.selectAll('path')
         .data(pie(dataset))
         .enter()
         .append('path')
         .attr('d', arc)
         .attr('fill', function(d, i) { 
           return color(colors[i]);
         });

       // Adds tooltip on mouseover. 
       path.on('mouseover', function(d) {
         var total = d3.sum(dataset.map(function(d) {
           return (d.enabled) ? d.value : 0;
         }));
         var percent = Math.round(1000 * d.value / total) / 10;
         tooltip.select('.label').html(d.data.name);
         tooltip.select('.percent').html(percent + '%')
         tooltip.style('display', 'block');
       })
       .each(function(d) { this._current = d; });     

       path.on('mouseout', function() {
         tooltip.style('display', 'none');
       });

       // Tooltip will move with mouse
       path.on('mousemove', function(d) {
         tooltip.style('top', (d3.event.layerY + 10) + 'px')
           .style('left', (d3.event.layerX + 10) + 'px');
       });

       // Creating Legend
       var legendRectSize = 9;
       var legendSpacing = 4;

       // Creates placeholder for legend rectangles
       var legend = svg.selectAll('.legend')
         .data(color.domain())
         .enter()
         .append('g')
         .attr('class', 'legend')
         .attr('transform', function(d, i) {
           var height = legendRectSize + legendSpacing;
           var offset =  height * color.domain().length / 2;
           var h = -5.5 * legendRectSize;
           var v = i * height - offset;
           return 'translate(' + h + ',' + v + ')';
         });

       // Fills the legend rectangles with color and adds event listeners
       legend.append('rect')
         .attr('width', legendRectSize)
         .attr('height', legendRectSize)
         .style('fill', color)
         .style('stroke', color)

         .on('click', function(label) {
           var rect = d3.select(this);
           var enabled = true;

           // If total enabled segments are < 2, cannot disable any more
           var totalEnabled = d3.sum(dataset.map(function(d) {
             return (d.enabled) ? 1 : 0;
           }))
           if (rect.attr('class') === 'disabled') {
             rect.attr('class', '');
           } else {
             if (totalEnabled < 2) return;
             rect.attr('class', 'disabled');
             enabled = false;
           }


           // The 'rect' only has color value, so must check which
           // rect was clicked based on color. (Not ideal.)
           pie.value(function(d, i) {
             if (colors[i] === label) {
               d.enabled = enabled;
             } 
             return (d.enabled) ? d.value : 0;
           });

           path = path.data(pie(dataset));

           path.transition()
             .duration(750)
             .attrTween('d', function(d) {
               // debugger
               var interpolate = d3.interpolate(this._current, d)
               this._current = interpolate(0);
               return function(t) {
                 return arc(interpolate(t));
               }
             })
         });

       // Adds text for legend
       legend.append('text')
         .attr('x', legendRectSize + legendSpacing)
         .attr('y', legendRectSize - legendSpacing + 3)
         .text(function(d, i) { return dataset[i].name.toLowerCase(); 
       });

      // Adds tooltip
       var tooltip = d3.select('div')
         .append('div')          
         .attr('class', 'tooltip');
       tooltip.append('div').attr('class', 'label');
       tooltip.append('div').attr('class', 'count'); 
       tooltip.append('div').attr('class', 'percent'); 
    }
  }
})


// app.directive('barsChart', function ($parse) {

//   var directiveDefinitionObject = {
//     restrict: 'E',
//     replace: false,
//     scope: {
//       data: '<'
//     },
//     link: function (scope, element, attrs) {
//       var data = attrs.chartData.split(',');
//      //in D3, any selection[0] contains the group
//      //selection[0][0] is the DOM node
//      //but we won't need that this time
//       var chart = d3.select(element[0]);
//      //to our original directive markup bars-chart
//      //we add a div with out chart stling and bind each
//      //data entry to the chart
//       chart.append("div").attr("class", "chart")
//         .selectAll('div')
//         .data(data).enter().append("div")
//         .transition().ease("elastic")
//         .style("width", function(d) { return d + "%"; })
//         .text(function(d) { return d + "%"; });
//       } 
//     };
//     return directiveDefinitionObject;
//  });
