import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
// import './App.css';

function App() {
  const svgRef = useRef();
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('workflow_graph.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load graph JSON');
        return res.json();
      })
      .then((graph) => {
        drawGraph(graph);
      })
      .catch((err) => {
        console.error('⚠️ Error loading graph JSON:', err);
        setError(err.message);
      });
  }, []);

  function drawGraph(graph) {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous contents

    const width = 800;
    const height = 600;

    svg.attr('viewBox', [0, 0, width, height]);

    const simulation = d3.forceSimulation(graph.nodes)
      .force('link', d3.forceLink(graph.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(graph.links)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.value || 1));

    const node = svg.append('g')
      .attr('fill', '#000')
      .selectAll('circle')
      .data(graph.nodes)
      .join('circle')
      .attr('r', 10)
      .call(drag(simulation));

    node.append('title').text(d => d.id);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });

    function drag(simulation) {
      return d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        });
    }
  }

  return (
    <div className="App">
      <h1>Repo Workflow Graph</h1>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <svg ref={svgRef} width="100%" height="600"></svg>
      )}
    </div>
  );
}

export default App;
