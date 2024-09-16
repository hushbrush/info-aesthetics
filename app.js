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
    

    
    const oct3= svg.append('path');
    oct3
    .attr('d', `M${octpoints3.map(p => p.join(',')).join('L')}Z`)
    .attr('fill', `purple`)
    .attr('opacity', 0.5);
     
    drawHours(zone3hour, (radius*3));


    const oct2= svg.append('path');
    oct2
    .attr('d', `M${octpoints2.map(p => p.join(',')).join('L')}Z`)
    .attr('fill', `teal`)
    .attr('opacity', 0.5);
        
    drawHours(zone2hour, (radius*2));


    const oct1= svg.append('path');
    oct1
    .attr('d', `M${octpoints1.map(p => p.join(',')).join('L')}Z`)
    .attr('fill', 'black')
    .attr('opacity', 0.5);


   drawHours(zone1hour, radius );
console.log(zone1hour, zone2hour, zone3hour)


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



// function drawOcts(radius, color)
// {
//     for (let i = 0; i < 8; i++)
//         {
//             const angle = (Math.PI / 4) * i; // Angle for each vertex
//             const x = cx + radius * Math.cos(angle);
//             const y = cy + radius * Math.sin(angle);
//             octpoints1.push([x, y]);
//             // const x2 = cx + (radius*2) * Math.cos(angle);
//             // const y2 = cy + (radius*2) * Math.sin(angle);
//             // octpoints2.push([x2, y2]);
//             // const x3 = cx + (radius*3) * Math.cos(angle);
//             // const y3 = cy + (radius*3) * Math.sin(angle);
//             // octpoints3.push([x3, y3]);
//         }
//    // const oct1= svg.append('path');
//     svg.append
//     .attr('d', `M${octpoints1.map(p => p.join(',')).join('L')}Z`)
//     .attr('fill', color)
//     .attr(opacity, '0.5');
//     // const oct2= svg.append('path');
//     // const oct3= svg.append('path');

// }


  // // draw unfinished hour: 
    // // zone 1 minutes
    // //figure out how to make this the hour angle later
    
   
    // for(var i=0; i<=min_normalised; i++)
    // {
        
    //     const x = cx + radius * Math.cos(angle);
    //     const y = cy + radius * Math.sin(angle);
    //     console.log("angle: "+angle);
    //     angle = angle+(Math.PI/(60*4)); // Angle for each vertex: 60 parts of eact oct
    //     minpoints.push([x, y]);

    //     //draw a circle at minpoints
        
    //     // svg.append('circle')
    //     //     .attr('x', minpoint[key][0])
    //     //     .attr('y', minpoint[key][1])
    //     //     .attr('r', 100)
    //     //     .attr('fill', 'red')
    //     //     .attr('opacity', '0.5'); 
    // }


    // //finding the last point of the hour to start drawing the minutes on
    // point1=hourpoints[hourpoints.length-1];
    // point2=minpoints[0];
   



    // // for( var j=0; j<min_normalised+2; j++)
    // //     {
    // //         //draw the triangle that divides the oct into 60 parts
    // //         console.log("point1:" +point1+" point2:"+point2);
    // //         svg.append('path')
    // //         .attr('d', `M${triangleCenter.join(',')}L${point1.join(',')}L${point2.join(',')}Z`)
    // //         .attr('fill', 'yellow')
    // //         .attr('opacity', 1); 

    // //         circle
    // //         .attr('cx', point1[0])
    // //         .attr('cy', point1[1])
    // //         .attr('r', 10)
    // //         .attr('fill', 'red'); 

    // //          circle2
    // //         .attr('cx', point2[0])
    // //         .attr('cy', point2[1])
    // //         .attr('r', 10)
    // //         .attr('fill', 'blue'); 

    // //         point1=point2;
    // //         point2=minpoints[j];
            
    // //     }


    //we need 3 ocatgons- 1 for first 8 hours, one for next 8 hours, one for last 8 hours
//first, one loop does the full hours. we want it to iterate starting from the first point, and draw the number of triangles=the number of full hours. 
//so obv hours%8;
//add extra triangle for unfinished hour