import "./style.css";
import * as d3 from "d3";


//i want this project to look cool so I should focus on doing this thing well it does not make any sense to not focus on things that you care about stop getting distracted
const body = d3.select("body").style("padding", "30px");

const width =600, height = 400, margin_left=50, margin_right=50, margin_top=50, margin_bottom=50;
const title = body
  .append("h1")
  .style("font-size", "16px")
  .text("Dead Tree Complaints across the Boroughs: Resolved vs Unresolved");

const svg = body
  .append("svg")
  .attr("viewBox", "0 0 600 400")
  .attr("width", width)
  .attr("height", height)
  .style("background", "#111")
  .style("box-shadow", "0px 1px 2px #DDDDDD");

  const marking_colour="#999";
  const resolved_colour="#576336";
  const unresolved_colour="#805f4a";

// json from API
const json = await d3.json('https://data.cityofnewyork.us/resource/erm2-nwe9.json?$query=SELECT%0A%20%20%60unique_key%60%2C%0A%20%20%60created_date%60%2C%0A%20%20%60closed_date%60%2C%0A%20%20%60descriptor%60%2C%0A%20%20%60incident_zip%60%2C%0A%20%20%60facility_type%60%2C%0A%20%20%60status%60%2C%0A%20%20%60due_date%60%2C%0A%20%20%60resolution_description%60%2C%0A%20%20%60resolution_action_updated_date%60%2C%0A%20%20%60borough%60%2C%0A%20%20%60park_borough%60%0AWHERE%20caseless_contains(%60complaint_type%60%2C%20%22Dead%2FDying%20Tree%22)%0AORDER%20BY%20%60created_date%60%20DESC%20NULL%20FIRST');
// console.log(json)
//i am grouping all the data by borough first
const data = d3.group([...json], (v) => v.length, (d) => d['borough']);
console.log(data)
//now I should group all the data by whether they are closed or not.
//i want it in an array of 5 boroughs, 
const brohs=[ "Manhattan", "Brooklyn", "Queens","Bronx", "Staten Island" ];
var boroughs =[], status=[], usable_data=[];
boroughs[0]= data.get(undefined).get("MANHATTAN");
boroughs[1]= data.get(undefined).get("BROOKLYN");
boroughs[2]= data.get(undefined).get("QUEENS");
boroughs[3]= data.get(undefined).get("BRONX");
boroughs[4]= data.get(undefined).get("STATEN ISLAND");
console.log(boroughs)


for(let i=0; i<5; i++)
{
  //  status[i] = d3.group([...boroughs[i]], (v) => v.length, (d) => d['status'])
  status[i] = d3.rollup(boroughs[i], (v) => v.length, (d) => d['status'])

 usable_data[i]={ borough: brohs[i], open: status[i].get('In Progress'), closed: status[i].get('Closed')  }
 console.log(usable_data[i])
}
const stack_on=['open', 'closed'];
const stack = d3.stack().keys(stack_on);
const stackedData = stack(usable_data);
window.data =usable_data;

const axes_layer=svg.append('g');
const bars_layer=svg.append('g');


// Scales


const xScale = d3
  .scaleBand()
  .domain(usable_data.map(d => d.borough))  // Map the boroughs to xScale
  .range([margin_left, width - margin_right])
  .paddingInner(0.1)
  .paddingOuter(0.1);

const maxValue = d3.max(usable_data, d => d.open + d.closed);
const bark =3;
const yScale = d3
  .scaleLinear()
  .domain([0, maxValue])
  .range([height - margin_bottom, margin_top])
  .nice();

const colorScale = d3
  .scaleOrdinal()
  .domain(stack_on)  // The two stack categories: open and closed
  .range([unresolved_colour, resolved_colour]);

// Draw the stacked bars
let cornerRadius =10;
bars_layer
  .selectAll('g')
  .data(stackedData)
  .enter()
  .append('g')
  .attr('fill', (d, i) => colorScale(stack_on[i]))
  .selectAll('rect')
  .data(d => d)
  .enter()
  .append('rect')
  .attr('x', (d, i) => d[0] ? xScale(d.data.borough) : (xScale(d.data.borough) + (width - 3 * margin_right) / 15)) 
  .attr('y', yScale(0)) 
  .attr('height', 0) 
  .attr('width', (d, i) => d[0] ? xScale.bandwidth() : xScale.bandwidth() / bark) 
  .attr('rx', (d, i) => d[0] ? cornerRadius : 0) 
  .attr('ry', cornerRadius) 
  .transition() 
  .duration(2000) 
  .ease(d3.easeBack) 
  .attr('y', d => yScale(d[1])) 
  .attr('height', d => {
    const height = yScale(d[0]) - yScale(d[1]);  // Calculate height

    // Only apply if the height is positive, otherwise set height to 0
    return height > 0 ? height : 0;
  });


// Add axes

axes_layer.append('g')
  .attr('transform', `translate(0, ${height - margin_bottom})`)
  .call(d3.axisBottom(xScale))
  .selectAll('path, line')   // Select all the axis lines (path and ticks)
  .attr('stroke', marking_colour)    // Change the axis line color to dark grey
  
 
axes_layer.selectAll('.tick text')
  .attr('fill', marking_colour); 

axes_layer.append('g')
  .attr('transform', `translate(${margin_left}, 0)`)
  .call(d3.axisLeft(yScale))
  .selectAll('path, line')   
  .attr('stroke', marking_colour)   
  .selectAll('text')         
  .attr('fill', marking_colour)   
  

axes_layer.selectAll('.tick text')
  .attr('fill', marking_colour); 

  //have to make a legend.
  //this is only half the sotry, because I don't know how many trees there are in each 

axes_layer.append('g')
  .attr('transform', `translate(${margin_left}, 0)`)
  .call(d3.axisLeft(yScale))
  .selectAll('path, line')  
  .attr('stroke', marking_colour)    
  .selectAll('text')        
  .attr('fill', marking_colour)  
  
axes_layer.selectAll('.tick text')  // Select all the tick text elements (x-axis)
  .attr('fill', marking_colour);  

// Create the legend group
const legend = svg.append("g")
  .attr("transform", `translate(${width - margin_right - 150}, ${margin_top})`); // Adjust position as needed

// Legend data
const legendData = [
  { label: "Resolved Complaints", color: resolved_colour }, // color for 'closed'
  { label: "Unresolved Complaints", color: unresolved_colour },   // color for 'open'
];

// Legend item size and spacing
const legendRectSize = 18;
const legendSpacing = 10;
const legendXOffset = 5;

// Create a group for each legend item
legend.selectAll("g")
  .data(legendData)
  .enter()
  .append("g")
  .attr("transform", (d, i) => `translate(0, ${i * (legendRectSize + legendSpacing)})`); // Spacing for legend items

// Append rounded rectangles for each legend item
legend.selectAll("g")
  .append("rect")
  .attr("width", legendRectSize)
  .attr("height", legendRectSize)
  .attr("rx", 5)  // Rounded corners for rectangles
  .attr("ry", 5)  // Rounded corners for rectangles
  .attr("fill", d => d.color);

// Append labels next to the rectangles
legend.selectAll("g")
  .append("text")
  .attr("x", legendRectSize + legendXOffset) // Position text to the right of the rectangle
  .attr("y", legendRectSize - 7) // Center text vertically within the rectangle
  .text(d => d.label)
  .style("fill", marking_colour) // Use the same color for the text as the axis marks
  .style("font-size", "12px")  // Adjust font size as needed
  .attr("alignment-baseline", "middle"); // Align text with the middle of the rectangles




