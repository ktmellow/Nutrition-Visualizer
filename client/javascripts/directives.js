// Display Pie Chart of Macronutrients
// Following tutorial from 
// http://zeroviscosity.com/d3-js-step-by-step/step-1-a-basic-pie-chart
app.directive("fdPie", function() {
  
  // Draws the pie chart.
  var draw = function(dataset, pieType, element) {
    function toArray(dataset) {
      var newDataset = [];
      for(var nutrient in dataset) {
        newDataset.push(dataset[nutrient]);
      }
      return newDataset;
    }
    dataset = toArray(dataset);

    var colors;
    var macroColors = ['#0084A3', '#D95B43', '#ECD078', '#C02942', '#542437', '#53777A', '#CFF09E', '#3B8686'];
    if (pieType === "macroPie") {
      colors = macroColors;
    } else {
      // Use a different color pallet for a different pie chart type.
      // colors = macroColors;
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
     var svg = d3.select(element[0])
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

      path.transition()
      .ease('circle')
        .duration(function(d, i){ return 600; })
        .attrTween('d', function(d) {
             var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
             return function(t) {
                 d.endAngle = i(t);
               return arc(d);
             }
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
     var tooltip = d3.select(element[0])
       .append('div')          
       .attr('class', 'tooltip');
     tooltip.append('div').attr('class', 'label');
     tooltip.append('div').attr('class', 'count'); 
     tooltip.append('div').attr('class', 'percent');   
  }

  return {
    templateUrl: "/client/partials/pie.html",
    restrict: 'AE',
    scope: {
      dataset: '<',
      pieType: '<'
    },
    compile: function(element, attrs, transclude) {
      return function(scope, element, attrs) {

        // Watch the dataset
        scope.$watch('dataset', function(newVal, oldVal, scope) {
          
          // Updates pie chart
          d3.select('svg').remove();
          draw(scope.dataset, scope.pieType, element);   
        }, true)
      }
    }
  }
});

app.directive("fdGauges", function(){
  return {
    templateUrl: "/client/partials/gauges.html",
    restrict: 'AE',
    scope: {
      dataset: '<',
      gaugeType: '<'
    }
  }
});

app.directive("fdGauge", function(){
  return {
    templateUrl: "/client/partials/gauge.html",
    restrict: 'AE',
    scope: {
      dataset: '<',
      gaugeType: '<'
    },
    compile: function(element, attrs, transclude) {
      function draw(dataset, gaugeType, element){
        
        var size = 70,
            thickness = 25;

        var color = d3.scale.linear()
          .domain([0, 17, 33, 50, 67, 83, 150, 200])
          .range(['#F9F9CF','#fdffa5', '#fffa9e', '#f8ff9e', '#E2FF9E','#C4ED68', '#9ED54C', '#B21EB2']);

        var arc = d3.svg.arc()
          .innerRadius(size - thickness)
          .outerRadius(size)
          .startAngle(-Math.PI / 2)

        var svg = d3.select(element[0]).append('svg')
            .attr('width', size * 2)
            .attr('height', size + 20)
            .attr('class', 'gauge');

        var chart = svg.append('g')
            .attr('transform', 'translate(' + size + ',' + size + ')')

        var background = chart.append('path')
            .datum({
                endAngle: Math.PI / 2
            })
            .attr('class', 'background')
            .attr('d', arc);

        var foreground = chart.append('path')
            .datum({
                endAngle: -Math.PI / 2
            })
            .style('fill', '#db2828')
            .attr('d', arc)
            .attr('class', 'foreground');

        var value = svg.append('g')
            .attr('transform', 'translate(' + size + ',' + (size * 0.9) + ')')
            .append('text')
            .text(0)
            .attr('text-anchor', 'middle')
            .attr('class', 'value');

        var scale = svg.append('g')
            .attr('transform', 'translate(' + size + ',' + (size + 15) + ')')
            .attr('class', 'scale');

        scale.append('text')
            .text('>100%')
            .attr('text-anchor', 'middle')
            .attr('x', (size - thickness / 2));

        scale.append('text')
            .text('0%')
            .attr('text-anchor', 'middle')
            .attr('x', -(size - thickness / 2));


        update(getDri(dataset), element, dataset);

        function getDri(dataset) {
          function grams(value, units) {
            if (units == 'mg') {
              return value * .001;
            } else if (units == 'mcg') {
              return 0.000001 * value;
            } else if (units == 'µg') {
              return 0.000001 * value;
            } else if (units == 'IU') {
              return value; 
            } else if (units == 'u00b5g') {
              return value * 0.000001;
            } else {
              return value;
            }
          }
          var gramsDri = grams(dataset.dri.value, dataset.dri.units);
          var gramsServing = grams(dataset.value, dataset.unit);
          return 100 * gramsServing / gramsDri;
        }

        function update(percent_dri, element, dataset) {
            percent_dri = d3.format('.1f')(percent_dri);
            foreground.transition()
                .duration(750)
                .style('fill', function() {
                    return color(percent_dri);
                })
                .call(arcTween, percent_dri);

            value.transition()
                .duration(750)
                .call(textTween, percent_dri);

            // Creates tooltip
            var tooltip = d3.select(element[0])
              .append('div')          
              .attr('class', 'tooltip'); 
            tooltip.append('div').attr('class', 'percent');   
            
            // Adds tooltip on mouseover. 
            d3.select(element[0]).select('.foreground').on('mouseover', function(d) {
              tooltip.select('.percent').html(dataset.value + " " + dataset.unit);
              tooltip.style('display', 'block');
            });

            d3.select(element[0]).select('.foreground').on('mouseout', function() {
              tooltip.style('display', 'none');
            });

            // Tooltip will move with mouse
            d3.select(element[0]).select('.foreground').on('mousemove', function(d) {
              tooltip.style('top', (d3.event.layerY + 10) + 'px')
                .style('left', (d3.event.layerX + 10) + 'px');
            });            

            // Adds tooltip on mouseover. 
            d3.select(element[0]).select('.background').on('mouseover', function(d) {
              tooltip.select('.percent').html(dataset.value + " " + dataset.unit);
              tooltip.style('display', 'block');
            });

            d3.select(element[0]).select('.background').on('mouseout', function() {
              tooltip.style('display', 'none');
            });

            // Tooltip will move with mouse
            d3.select(element[0]).select('.background').on('mousemove', function(d) {
              tooltip.style('top', (d3.event.layerY + 10) + 'px')
                .style('left', (d3.event.layerX + 10) + 'px');
            });
        }

        function arcTween(transition, v) {
            var newAngle = Math.min(v / 100 * Math.PI - Math.PI / 2, Math.PI/2);
            transition.attrTween('d', function(d) {
                var interpolate = d3.interpolate(d.endAngle, newAngle);
                return function(t) {
                    d.endAngle = interpolate(t);
                    return arc(d);
                };
            });
        }

        function textTween(transition, v) {
            transition.tween('text', function() {
                var interpolate = d3.interpolate(this.innerHTML, v),
                    split = (v + '').split('.'),
                    round = (split.length > 1) ? Math.pow(10, split[1].length) : 1;
                return function(t) {
                    this.innerHTML = d3.format('.1f')(Math.round(interpolate(t) * round) / round) + '<tspan>%</tspan>';
                };
            });
        }

      }

      return function(scope, element, attrs) {

        scope.$watch('dataset', function(newVal, oldVal, scope) {
          d3.select(element[0]).select('svg').remove();
          try { draw(scope.dataset, scope.barType, element); } catch (ignore) {};
        }, true)

      } // end return function
    } // end compile
  }
});

app.directive("fdFill", function(FillChartService, $compile, $location){
  return {
    templateUrl: "/client/partials/fill.html",
    scope: {
      dataset: '<',
      fillType: '<',
    },
    restrict: 'AE',
    link: function(){
    },
    compile: function(element, attrs, transclude) {
      function draw(dataset, fillType, element){
        if ( fillType === "water" ) {
          d3.select(element[0]).append('svg').call(FillChartService.liquidfillgauge, dataset.value, {
            circleThickness: 0.1,
            waveAnimateTime: 2000,
            waveCount: 2,
            waveHeight: 0.05,
            textSize: 0.6,
            minValue: 0.3,
            maxValue: 1900,
            displayPercent: false,
            circleColor: "#117899",
            waveColor: "#1395BA"
          }, element, fillType);
        } else if ( fillType === "calories" ) {

          // TO DO: change maxValue if man 
          d3.select(element[0]).append('svg').call(FillChartService.liquidfillgauge, dataset.value, {
            circleThickness: 0.1,
            circleColor: "#D94E1F",
            textColor: "#E9705B",
            waveTextColor: "#e83f25",
            waveColor: "#FFDDDD",
            textVertPosition: 0.52,
            waveAnimateTime: 5000,
            waveHeight: 0,
            waveAnimate: false,
            waveCount: 2,
            waveOffset: 0.25,
            textSize: 0.6,
            minValue: 0.3,
            maxValue: 2000,
            displayPercent: false
          }, element, fillType);
        } else {
          d3.select(element[0]).append('svg').call(FillChartService.liquidfillgauge, 120, {
            circleThickness: 0.1,
            circleColor: "#E9705B",
            textColor: "#FF4444",
            waveTextColor: "#FFAAAA",
            waveColor: "#FFDDDD",
            textVertPosition: 0.52,
            waveAnimateTime: 5000,
            waveHeight: 0,
            waveAnimate: false,
            waveCount: 2,
            waveOffset: 0.25,
            textSize: 1.2,
            minValue: 30,
            maxValue: 150,
            displayPercent: false
          }, element, fillType);
        }
      }      
      return function(scope, element, attrs) {

        scope.$watch('dataset.value', function(newVal, oldVal, scope) {
          d3.select(element[0]).select('svg').remove()
          draw(scope.dataset, scope.fillType, element, scope);
        }, true)

      } // end return function
    }, // end compile
  }
});

app.directive("fdVbar", function() {
  return {
    templateUrl: "/client/partials/vbar.html",
    scope: {
      dataset: '<',
      barType: '<'
    },
    restrict: 'AE',
    compile: function(element, attrs) {
      function draw(dataset, gaugeType, element) {
        
        dataset = toArray(dataset);
        
        var w = 175;
        var h = 175;
        var barPad = 1;
        var barPad = 1;
        var marginAxis = 50;

        var color = d3.scale.ordinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var yScale = d3.scale.linear()
          .domain([0, d3.max(dataset, function(d) { 
            var percent = d.value / d.dri.value;
            return d.value / d.dri.value; 
          })]).range([0, h]); // values proportioned to pixel size of svg

        var svg = d3.select(element[0]).append('svg')
          .attr('height', h + 1.5*marginAxis + 2)
          .attr('width', w + marginAxis + barPad*4);  

        var rects = svg.selectAll('rect');
        rects.data(dataset)
          .enter()
          .append('rect')
          .attr('x', function(d, i) {
            return (i * (w/dataset.length)) + marginAxis + 2*barPad;
          })
          .attr('width', w/dataset.length - barPad)
          .attr('height', yScale(0))
          .attr('y', h - yScale(0)) 
          .attr('fill', 'coral')    
          .transition()
                .delay(function(d, i) { return i * 750/dataset.length; })
                .duration(750)
          .attr('height', function(d){ return yScale(d.value / d.dri.value); })
          .attr('y', function(d) {
            return h - yScale(d.value / d.dri.value);
          });             
     
        var axisYScale = d3.scale.linear()
          .domain([0, d3.max(dataset, function(d) { 
            var percent = d.value / d.dri.value;
            return d.value / d.dri.value; 
          })]).range([h, 0]);
        
        var xScale = d3.scale.ordinal()
          .domain(dataset.map(function(d){ 
            if(d.name == "Carbohydrate, by difference") {
              return "Carbohydrates";
            } else if (d.name == "Fiber, total dietary") {
              return "Fiber";
            } else if (d.name == "Sugars, total") {
              return "Sugars";
            } else if (d.name == "Total lipid (fat)") {
              return "Fats + Lipids"
            } else {
              return d.name; 
            }
          }))
          .rangePoints([-marginAxis*0.25, w-marginAxis*0.25 + 3], 1);

        // Define X Axis
        var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom");

        // Create X Axis
        d3.select(element[0]).select('svg').append("g")
          .attr("class", "x axis")
          .attr('transform', `translate(${1.3*marginAxis-2},${h+1})`)
          .attr('stroke', 1)
          .call(xAxis)
          .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-25)";
            });

        d3.selectAll('.x axis').selectAll('text')
          .attr('transform', function(d) {
            return "rotate(65)";
          });

        //Define Y axis
        var yAxis = d3.svg.axis()
          .scale(axisYScale)
          .orient("left")
          .ticks(10, '%');

        //Create Y axis
        d3.select(element[0]).select('svg').append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (marginAxis) + ", 1)")
            .call(yAxis)
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -marginAxis + 2)
                .attr("x", -h/2 + 0.5* marginAxis)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("% DRI");
        
        // Adds tooltip
         var tooltip = d3.select(element[0])
           .append('div')          
           .attr('class', 'tooltip');
         tooltip.append('div').attr('class', 'label');
         tooltip.append('div').attr('class', 'count'); 
         tooltip.append('div').attr('class', 'percent');  

        // Adds tooltip on mouseover. 
        svg.selectAll('rect').on('mouseover', function(d) {
          var total = d3.sum(dataset.map(function(d) {
            return (d.enabled) ? d.value : 0;
          }));
          var percent = Math.round(1000 * d.value / total) / 10;
          tooltip.select('.label').html(d.name);
          tooltip.select('.count').html(d.value + " " + d.unit)
          tooltip.select('.percent').html( d3.format('.2f')(d.value/d.dri.value * 100) + '%')
          tooltip.style('display', 'block');
        })
        .each(function(d) { this._current = d; });     

        svg.selectAll('rect').on('mouseout', function() {
          tooltip.style('display', 'none');
        });

        // Tooltip will move with mouse
        svg.selectAll('rect').on('mousemove', function(d) {
          tooltip.style('top', (d3.event.layerY + 10) + 'px')
            .style('left', (d3.event.layerX + 10) + 'px');
        });

        function toArray(dataset) {
          arr = [];
          for (var key in dataset) {
            if(key !== "Ash") arr.push(dataset[key]);
          }
          return arr;
        }
      }
      return function(scope, element, attrs) {
        scope.$watch('dataset', function() {
          d3.select(element[0]).select('svg').remove();
          draw(scope.dataset, scope.barType, element);
        }, true);
        

      }
    }
  }
});

app.directive("fdBullets", function() {
  return {
    templateUrl: "/client/partials/bullets.html", 
    scope: {
      dataset: '<', 
      bulletType: '<'
    }, 
    restrict: 'AE',
    compile: function(element, attrs) {
      
    }
  }
});

app.directive("fdBullet", function() {
  return {
    templateUrl: "/client/partials/bullet.html",
    scope: {
      dataset: '<',
    },
    restrict: 'AE',
    compile: function(element, attrs) {
      d3.bullet = function() {
          var orient = "left"; // TODO top & bottom
          var reverse = false;
          var duration = 0;
          var ranges = bulletRanges;
          var markers = bulletMarkers;
          var measures = bulletMeasures;
          var tickFormat = null;

          // For each small multiple…
          function bullet(g) {
            g.each(function(datum, i) {
              var rangez = ranges.call(this, datum, i).slice().sort(d3.descending);
              var markerz = markers.call(this, datum, i).slice().sort(d3.descending);
              var measurez = measures.call(this, datum, i).slice().sort(d3.descending);
              var g = d3.select(this);

              // Compute the new x-scale.
              var x1 = d3.scale.linear()
                .domain([0, Math.max(rangez[0], markerz[0], measurez[0])])
                .range(reverse ? [width, 0] : [0, width]);

              // Retrieve the old x-scale, if this is an update.
              var x0 = this.__chart__ || d3.scale.linear()
                .domain([0, Infinity])
                .range(x1.range());

              // Stash the new scale.
              this.__chart__ = x1;

              // Derive width-scales from the x-scales.
              var w0 = bulletWidth(x0);
              var w1 = bulletWidth(x1);

              // Update the range rects.
              var range = g.selectAll("rect.range").data(rangez);

              range.enter().append("rect")
                .attr("class", function(d, i) {
                  return "range s" + i;
                })
                .attr("width", w0)
                .attr("height", height)
                .attr("x", reverse ? x0 : 0)
                .transition()
                .duration(duration)
                .attr("width", w1)
                .attr("x", reverse ? x1 : 0);

              range.transition()
                .duration(duration)
                .attr("x", reverse ? x1 : 0)
                .attr("width", w1)
                .attr("height", height);

              // Update the measure rects.
              var measure = g.selectAll("rect.measure")
                .data(measurez);

              measure.enter().append("rect")
                .attr("class", function(d, i) {
                  return "measure s" + i;
                })
                .attr("width", w0)
                .attr("height", height / 3)
                .attr("x", reverse ? x0 : 0)
                .attr("y", height / 3)
                .transition()
                .duration(duration)
                .attr("width", w1)
                .attr("x", reverse ? x1 : 0);

              measure.transition()
                .duration(duration)
                .attr("width", w1)
                .attr("height", height / 3)
                .attr("x", reverse ? x1 : 0)
                .attr("y", height / 3);

              // Update the marker lines.
              var marker = g.selectAll("line.marker")
                .data(markerz);

              marker.enter().append("line")
                .attr("class", "marker")
                .attr("x1", x0)
                .attr("x2", x0)
                .attr("y1", height / 6)
                .attr("y2", height * 5 / 6)
                .transition()
                .duration(duration)
                .attr("x1", x1)
                .attr("x2", x1);

              marker.transition()
                .duration(duration)
                .attr("x1", x1)
                .attr("x2", x1)
                .attr("y1", height / 6)
                .attr("y2", height * 5 / 6);

              // Compute the tick format.
              var format = tickFormat || x1.tickFormat(8);

              // Update the tick groups.
              var tick = g.selectAll("g.tick")
                .data(x1.ticks(8), function(d) {
                  return this.textContent || format(d);
                });

              // Initialize the ticks with the old scale, x0.
              var tickEnter = tick.enter().append("g")
                .attr("class", "tick")
                .attr("transform", bulletTranslate(x0))
                .style("opacity", 1e-6);

              tickEnter.append("line")
                .attr("y1", height)
                .attr("y2", height * 7 / 6);

              tickEnter.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "1em")
                .attr("y", height * 7 / 6)
                .text(format);

              // Transition the entering ticks to the new scale, x1.
              tickEnter.transition()
                .duration(duration)
                .attr("transform", bulletTranslate(x1))
                .style("opacity", 1);

              // Transition the updating ticks to the new scale, x1.
              var tickUpdate = tick.transition()
                .duration(duration)
                .attr("transform", bulletTranslate(x1))
                .style("opacity", 1);

              tickUpdate.select("line")
                .attr("y1", height)
                .attr("y2", height * 7 / 6);

              tickUpdate.select("text")
                .attr("y", height * 7 / 6);

              // Transition the exiting ticks to the new scale, x1.
              tick.exit().transition()
                .duration(duration)
                .attr("transform", bulletTranslate(x1))
                .style("opacity", 1e-6)
                .remove();
            });
            d3.timer.flush();
          }

          // left, right, top, bottom
          bullet.orient = function(x) {
            if (!arguments.length) return orient;
            orient = x;
            reverse = orient == "right" || orient == "bottom";
            return bullet;
          };

          // ranges (bad, satisfactory, good)
          bullet.ranges = function(x) {
            if (!arguments.length) return ranges;
            ranges = x;
            return bullet;
          };

          // markers (previous, goal)
          bullet.markers = function(x) {
            if (!arguments.length) return markers;
            markers = x;
            return bullet;
          };

          // measures (actual, forecast)
          bullet.measures = function(x) {
            if (!arguments.length) return measures;
            measures = x;
            return bullet;
          };

          bullet.width = function(x) {
            if (!arguments.length) return width;
            width = x;
            return bullet;
          };

          bullet.height = function(x) {
            if (!arguments.length) return height;
            height = x;
            return bullet;
          };

          bullet.tickFormat = function(x) {
            if (!arguments.length) return tickFormat;
            tickFormat = x;
            return bullet;
          };

          bullet.duration = function(x) {
            if (!arguments.length) return duration;
            duration = x;
            return bullet;
          };

          return bullet;
        };

        function bulletRanges(d) {
          return d.ranges;
        }

        function bulletMarkers(d) {
          return d.markers;
        }

        function bulletMeasures(d) {
          return d.measures;
        }

        function bulletTranslate(x) {
          return function(d) {
            return "translate(" + x(d) + ",0)";
          };
        }

        function bulletWidth(x) {
          var x0 = x(0);
          return function(d) {
            return Math.abs(x(d) - x0);
          };


        }

      function draw(dataset, element) {
        var margin = {
          top: 5,
          right: 20,
          bottom: 20,
          left: 60
        };

        var width = 300 - margin.left - margin.right;
        var height = 60 - margin.top - margin.bottom;

        var chart = d3.bullet()
          .width(width)
          .height(height);

        var data = [{
          "title": (d3.format('.2r')(dataset.value)),
          "subtitle": dataset.unit,
          "ranges": [dataset.dri.value*.2, dataset.dri.value, Math.max(1.4*dataset.dri.value, dataset.value)],
          "measures": [dataset.value],
          "markers": [1.1* dataset.dri.value]
        }];

        var svg = d3.select(element[0]).selectAll("svg")
          .data(data)
          .enter().append("svg")
          .attr("class", "bullet")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .call(chart);

        var title = svg.append("g")
          .style("text-anchor", "end")
          .attr("transform", "translate(-6," + height / 2 + ")");

        title.append("text")
          .attr("class", "title")
          .text(function(d) {
            return d.title;
          });

        title.append("text")
          .attr("class", "subtitle")
          .attr("dy", "1em")
          .text(function(d) {
            return d.subtitle;
          });

        // Adds tooltip
                var tooltip = d3.select(element[0])
                  .append('div')          
                  .attr('class', 'tooltip');
                tooltip.append('div').attr('class', 'label');
                tooltip.append('div').attr('class', 'count'); 
                tooltip.append('div').attr('class', 'percent');  

               // Adds tooltip on mouseover. 
               d3.select(element[0]).select('.measure').on('mouseover', function(d) {
                 tooltip.select('.label').html(dataset.name);
                 tooltip.select('.count').html(dataset.value + " " + dataset.unit)
                 tooltip.select('.percent').html( d3.format('.2f')(dataset.value/dataset.dri.value * 100) + '%')
                 tooltip.style('display', 'block');
               })

               d3.select(element[0]).select('.measure').on('mouseout', function() {
                 tooltip.style('display', 'none');
               });

               // Tooltip will move with mouse
               d3.select(element[0]).select('.measure').on('mousemove', function(d) {
                 tooltip.style('top', (d3.event.layerY + 10) + 'px')
                   .style('left', (d3.event.layerX + 10) + 'px');
               });

      }

      return function(scope, element, attrs) {
        scope.$watch('dataset', function() {
          d3.select(element[0]).select('svg').remove();
          try { draw(scope.dataset, element); } catch(ignore) {};
        }, true);
      }
    }
  }
});

app.directive("fdSearch", function() { 
  return {
    templateUrl: "/client/partials/search.html",
    scope: {
      form: '=',
      submit: '<',
      getSuggestions: '<',
      search: '<'
    },
    restrict: 'AE'
  } 
});

app.directive('slider', function($timeout) {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      dataset: '=',
      type: '<'
    },
    // scope undefined, not passed in correctly
    link: function(scope, elem, attrs) {
      scope.currentIndex = 0; // Initially the index is at the first image

      scope.next = function() {
        scope.currentIndex+3 < scope.dataset.length - 1 ? scope.currentIndex+=3 : scope.currentIndex = 0;
      };

      scope.prev = function() {
        scope.currentIndex > 0 ? scope.currentIndex-=3 : scope.currentIndex = scope.dataset.length - 1;
      };

      scope.$watch('currentIndex', function() {
        scope.dataset.forEach(function(data) {
          data.visible = false; // make every image invisible
        });

        scope.dataset[scope.currentIndex].visible = true; // make the current image visible
        if(scope.dataset.length > scope.currentIndex+1) {scope.dataset[scope.currentIndex+1].visible = true;}
        if(scope.dataset.length > scope.currentIndex+2) {scope.dataset[scope.currentIndex+2].visible = true;}
      });
    },
    templateUrl: '/client/partials/slider.html'
  };
});

app.directive('counter', function($timeout) {
  return {
    restrict: 'E',
    replace: false,
    scope: {
      countmax: '<',
      header: '<',
      units: '<'
    },
    templateUrl: '/client/partials/counter.html',
    link: function(scope, element, attr) {

      var timer;
      var increment;
        scope.count = 0;

        var updateCounter = function() {
            increment = Math.floor(Math.random() * (8)) + 1;
            if(scope.count + increment > scope.countmax) { 
              scope.count = scope.countmax; 
            } else {
              scope.count += increment;
            }
            timer = $timeout(updateCounter, 0);
            if(scope.count === scope.countmax) {
              $timeout.cancel(timer)
            }
        };
        updateCounter();
    }
  }

})
