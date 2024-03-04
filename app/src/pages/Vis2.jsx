import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const Vis2 = () => {
  const chartRef = useRef();
  // percent difference between marked points is saved here
  const [percentDifference, setPercentDifference] = useState(null);

  useEffect(() => {
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const generateRandomData = () => {
      const data = [];
      for (let i = 0; i < 5; i++) {
        data.push({
          label: `Data ${i + 1}`,
          value: Math.round(Math.random() * 100),
        });
      }
      return data;
    };

    const data = generateRandomData();

    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);

    const path = d3.arc().outerRadius(radius - 10).innerRadius(0);

    const arc = svg
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arc
      .append('path')
      .attr('d', path)
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    // Randomly select two data points to mark with a dot
    const randomlyMarkedPoints = d3.shuffle(data).slice(0, 2);

    // Sort the marked points to find which is smaller and which is larger
    const sortedMarkedPoints = randomlyMarkedPoints.sort((a, b) => a.value - b.value);
    const [smallerValue, largerValue] = sortedMarkedPoints.map((point) => point.value);

    // Calculate the rounded percent difference between the two points
    const calculatedPercentDifference =
      Math.round((smallerValue/largerValue) * 100);

    setPercentDifference(calculatedPercentDifference);


    // Add a dot to indicate marked datapoints
    arc
      .filter((d) => randomlyMarkedPoints.includes(d.data))
      .append('circle')
      .attr('cx', (d) => path.centroid(d)[0])
      .attr('cy', (d) => path.centroid(d)[1])
      .attr('r', 5)
      .attr('fill', 'black');

    arc
      .append('text')
      .attr('transform', (d) => `translate(${path.centroid(d)})`)
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle');
  }, []);

  return <div>
            <div ref={chartRef}></div> 
         <div>
            {/* Display the calculated percent difference */}
            Percent Difference: {percentDifference}%
        </div>
        </div>;
};

export default Vis2;

