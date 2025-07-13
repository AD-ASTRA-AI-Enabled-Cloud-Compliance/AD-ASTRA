'use client'

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useRulesData } from '@/hooks/useRulesData';
import { extractNodesAndLinks } from '@/lib/functions';

const D3Force = () => {
    const { dataRules, loading, error, refetch } = useRulesData();
    const data = extractNodesAndLinks(dataRules, 'model', 'framework');
    console.log('DAta extrated nodes', data)
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const colors = [
    "#6a89cc",
    "#60a3bc",
    "#e55039",
    "#3c6382",
    "#0c2461",
    ];
    const subjectColorMap: Record<string, string> = {};
    let colorIndex = 0;
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Get initial container size
        const getSize = () => ({
            width: container.clientWidth,
            height: container.clientHeight
        });

        let { width, height } = getSize();

        // Clear any existing SVG content
        d3.select(svgRef.current).selectAll("*").remove();

        // Data preparation
        const datad = {
            "nodes": [
                {
                    "id": "gemma3:12b",
                    "type": "model"
                },
                {
                    "id": "GDPR",
                    "type": "framework"
                },
                {
                    "id": "llama3:latest",
                    "type": "model"
                },
                {
                    "id": "gemma:2b",
                    "type": "model"
                },
                {
                    "id": "ISO-127001",
                    "type": "framework"
                },
                {
                    "id": "gemma:7b",
                    "type": "model"
                },
                {
                    "id": "PCI",
                    "type": "framework"
                },
                {
                    "id": "codeup:latest",
                    "type": "model"
                }
            ],
            "links": [
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "ISO-127001",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:7b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "ISO-127001",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "PCI",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "PCI",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "PCI",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:7b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "PCI",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "codeup:latest",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "codeup:latest",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "PCI",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "PCI",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:7b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "PCI",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "ISO-127001",
                    "value": 1
                },
                {
                    "source": "codeup:latest",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "PCI",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "PCI",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "PCI",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "PCI",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "PCI",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "PCI",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:7b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "PCI",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:7b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "ISO-127001",
                    "value": 1
                },
                {
                    "source": "gemma:7b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:7b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "ISO-127001",
                    "value": 1
                },
                {
                    "source": "llama3:latest",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:7b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:2b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma3:12b",
                    "target": "GDPR",
                    "value": 1
                },
                {
                    "source": "gemma:7b",
                    "target": "GDPR",
                    "value": 1
                }
            ]
        }

        // Setup SVG with container dimensions
        const svg = d3.select(svgRef.current)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', [0, 0, width, height]);

        const g = svg.append('g');
        svg.call(d3.zoom().on('zoom', (event) => {
            g.attr('transform', event.transform);
        }));

        // Create simulation with dynamic center
        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links)
                .id((d: any) => d.id)
                .distance(40))
            .force("charge", d3.forceManyBody()
                .strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(50));

        const updateSimulation = () => {
            simulation
                .force("center", d3.forceCenter(width / 2, height / 2))
                .restart();
        };

        // Handle resize
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width: newWidth, height: newHeight } = entry.contentRect;
                width = newWidth;
                height = newHeight;
                svg.attr('viewBox', [0, 0, width, height]);
                updateSimulation();
            }
        });

        resizeObserver.observe(container);

        // Draw links
        const links = g.selectAll(".link")
            .data(data.links)
            .join("line")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", 1);

        // Draw nodes
        const nodes = g.selectAll(".node")
            .data(data.nodes)
            .join("circle")
            .attr("fill", (d: any) => {
                if (d.type === "model") {
                    return "#dfe4ea"; // model type
                }
        
                // Assign subject colors
                if (!subjectColorMap[d.id]) {
                    subjectColorMap[d.id] = colors[colorIndex % colors.length];
                    colorIndex++;
                }
        
                return subjectColorMap[d.id];
            })
            .attr("r", (d: any) => {
                if (d.type === "model") {
                    return 10;
                } else {
                    return 15;
                }
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // Add labels
        const labels = g.selectAll(".label")
            .data(data.nodes)
            .join("text")
            .text((d: any) => d.id)
            .attr("font-size", "14px")
            .attr("font-weight", "600")
            .attr("fill", "#2d3748");

        // Update positions on tick
        simulation.on("tick", () => {
            links
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            nodes
                .attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y);

            labels
                .attr("x", (d: any) => d.x)
                .attr("y", (d: any) => d.y);
        });

        // Drag functions
        function dragstarted(event: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event: any) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event: any) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return () => resizeObserver.disconnect();
    }, [data]);

    return (
        <div ref={containerRef} className="w-full h-full">
            {loading == false &&
                <svg ref={svgRef} className="w-full h-full"></svg>
            }
        </div>
    );
};

export default D3Force;