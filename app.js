import * as d3 from "d3";
import { triTable } from "three/examples/jsm/objects/MarchingCubes.js";

const initialTime = Date.now();

const body = d3.select('body');

const clock = body.append('div').attr('id', 'clock');
const timestamp = clock.append('div').attr('id', 'timestamp');
const svg= clock.append('svg')
.attr('viewBox', '0 0 1920 1080')
.attr('width', 1920)
.attr('height', 1080);

const octpoints1 = [];
const octpoints2 = [];
const octpoints3 = [];
const hourpoints = [];
var radius=100, cx=960, cy=540;
const triangleCenter = [cx, cy];

//array for the octagons
for (let i = 0; i < 8; i++)
    {
        const angle = (Math.PI / 4) * i; // Angle for each vertex
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        octpoints1.push([x, y]);
        const x2 = cx + (radius*2) * Math.cos(angle);
        const y2 = cy + (radius*2) * Math.sin(angle);
        octpoints2.push([x2, y2]);
        const x3 = cx + (radius*3) * Math.cos(angle);
        const y3 = cy + (radius*3) * Math.sin(angle);
        octpoints3.push([x3, y3]);
    }
    var zone1hour, zone2hour, zone3hour;
  

//find the /8 time zones
function zones(hours)
{
    switch (Math.floor(hours / 8)) {
        case 0:
            zone3hour = hours % 8;
            zone2hour = 0;
            zone1hour = 0;
            break;
    
        case 1:
            zone3hour = 1;
            zone2hour = hours % 8;
            zone1hour = 0;
            break;
    
        case 2:
            zone3hour = 1;
            zone2hour = 1;
            zone1hour = hours % 8;
            break;
    
       
    }
}

function drawOcts(octpoints, oct, colour)
{
    oct= svg.append('path');
    oct
    .attr('d', `M${octpoints.map(p => p.join(',')).join('L')}Z`)
    .attr('fill', colour)
    .attr('opacity', 0.5);
}

function loop()
 {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
   //const mili = date.getMilliseconds();
    const delta = (Date.now() - initialTime);
    timestamp.html(`${hours}:${minutes}:${seconds} [Frame: ${delta}]`)
    const tri =svg.append("path");

    zones(5);
    const oct1 = null, oct2 = null, oct3 = null;

    drawOcts(octpoints3, oct3, 'purple');
     drawHours(zone3hour, (radius*3));


  
    drawOcts(octpoints2, oct2, 'teal');
    drawHours(zone2hour, (radius*2));



    drawOcts(octpoints1, oct1, 'black');
    drawHours(zone1hour, radius );



    window.requestAnimationFrame(loop);
}

loop();


function drawHours(hour_normalised, radius)
{

    var angle= -Math.PI/2;
    for(var i=0; i<=hour_normalised; i++)
    {
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        angle = angle+(Math.PI/4); // Angle for each vertex
        hourpoints.push([x, y]);
    }


    let point1=[cx + radius * Math.cos(-Math.PI/2), cy + radius * Math.sin(-Math.PI/2)];
    let point2=hourpoints[0];
    
    for(var i=0; i<(hour_normalised+2); i++)
    {
        svg.append('path')
       .attr('d', `M${triangleCenter.join(',')}L${point1.join(',')}L${point2.join(',')}Z`)
       .attr('fill', 'white')
       .attr('opacity', 0.7);    
        point1=point2;
        point2=hourpoints[i];
        
    }

}


