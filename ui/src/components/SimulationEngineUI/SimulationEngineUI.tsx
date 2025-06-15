import React, { useState, useRef } from 'react';
import simulationBannerIcon from '../../assets/figma_components/0:119.svg';
import styles from './SimulationEngineUI.module.css';

// Types for simulation data
interface SimulationStep {
  id: string;
  label: string;
  from: string;
  to: string;
  edgeLabel: string;
  type?: string;
  message?: string;
}
interface SimulationFlow {
  id: string;
  label: string;
  description: string;
  steps: SimulationStep[];
}
interface ProjectData {
  diagram: string; // stringified JSON
  simulation?: { flows: SimulationFlow[] };
}

// Helper to parse diagram JSON
function parseDiagram(diagramStr: string) {
  try {
    return JSON.parse(diagramStr);
  } catch {
    return { nodes: [], edges: [] };
  }
}

// Helper to get all node labels involved in a flow
function getInvolvedNodeLabels(flow: SimulationFlow) {
  const set = new Set<string>();
  flow.steps.forEach(step => {
    set.add(step.from);
    set.add(step.to);
  });
  return Array.from(set);
}

const SimulationEngineUI: React.FC<{ projectData: ProjectData }> = ({ projectData }) => {
  console.log('[SimulationEngineUI] MOUNT', projectData);
  const [selectedFlow, setSelectedFlow] = useState<SimulationFlow | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const stepTimeout = useRef<number | null>(null);

  const diagram = parseDiagram(projectData.diagram);
  const flows = projectData.simulation?.flows || [];

  // Debug logs for diagram and flows
  React.useEffect(() => {
    console.log('[SimulationEngineUI] Parsed diagram:', diagram);
    console.log('[SimulationEngineUI] Simulation flows:', flows);
  }, [diagram, flows]);

  // Helpers to get node/edge IDs for DOM
  function getNodeId(label: string) {
    return `node_${label.replace(/\s+/g, '_')}`;
  }
  function getEdgeId(edgeLabel: string) {
    return `edge_${edgeLabel.replace(/\s+/g, '_')}`;
  }

  // Animation helpers
  function highlightBox(nodeId: string) {
    console.log('[SimulationEngineUI] Highlight node:', nodeId);
    document.querySelectorAll('.sim-node').forEach(b => b.classList.remove('active'));
    const el = document.getElementById(nodeId);
    if (el) el.classList.add('active');
  }
  function highlightArrow(edgeId: string) {
    console.log('[SimulationEngineUI] Highlight edge:', edgeId);
    document.querySelectorAll('.sim-edge').forEach(a => a.classList.remove('active-arrow'));
    const el = document.getElementById(edgeId);
    if (el) el.classList.add('active-arrow');
  }
  function clearHighlights() {
    document.querySelectorAll('.sim-node').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.sim-edge').forEach(a => a.classList.remove('active-arrow'));
  }

  // Animation runner
  async function runSimulation(flow: SimulationFlow) {
    console.log('[Simulation] Starting simulation for flow:', flow.id);
    setIsAnimating(true);
    setCurrentStep(-1);
    clearHighlights();
    for (let i = 0; i < flow.steps.length; i++) {
      setCurrentStep(i);
      const step = flow.steps[i];
      console.log(`[Simulation] Step ${i + 1}/${flow.steps.length}:`, step);
      console.log('[Simulation] Step from:', step.from, 'to:', step.to, 'edgeLabel:', step.edgeLabel);
      highlightBox(getNodeId(step.to)); // Only highlight 'to' node
      highlightArrow(getEdgeId(step.edgeLabel));
      // Wait 1000ms per step
      await new Promise(res => {
        stepTimeout.current = window.setTimeout(res, 1000);
      });
      clearHighlights();
    }
    setIsAnimating(false);
    setCurrentStep(-1);
    console.log('[Simulation] Simulation ended for flow:', flow.id);
  }

  // Compute bounding box for involved nodes and auto-scale/center
  function getDiagramTransform(flow: SimulationFlow) {
    if (!diagram.nodes || diagram.nodes.length === 0) return { scale: 1, translateX: 0, translateY: 0 };
    const involvedLabels = flow ? getInvolvedNodeLabels(flow) : diagram.nodes.map((n: any) => n.data.label);
    const involvedNodes = diagram.nodes.filter((n: any) => involvedLabels.includes(n.data.label));
    if (involvedNodes.length === 0) return { scale: 1, translateX: 0, translateY: 0 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    involvedNodes.forEach((n: any) => {
      minX = Math.min(minX, n.position.x);
      minY = Math.min(minY, n.position.y);
      maxX = Math.max(maxX, n.position.x + (n.width || 120));
      maxY = Math.max(maxY, n.position.y + (n.height || 40));
    });
    const padding = 40;
    minX -= padding; minY -= padding; maxX += padding; maxY += padding;
    const viewW = 1200, viewH = 500;
    const diagW = maxX - minX, diagH = maxY - minY;
    const scale = Math.min(viewW / diagW, viewH / diagH, 1);
    const translateX = (viewW - diagW * scale) / 2 - minX * scale;
    const translateY = (viewH - diagH * scale) / 2 - minY * scale;
    console.log('[Diagram] Bounding box:', { minX, minY, maxX, maxY, diagW, diagH, scale, translateX, translateY });
    return { scale, translateX, translateY };
  }

  // Render diagram: only show the edge for the current step during animation
  function renderDiagram() {
    if (!diagram.nodes || !diagram.edges) return <div>No diagram data</div>;
    const flow = selectedFlow;
    const involvedLabels = flow ? getInvolvedNodeLabels(flow) : diagram.nodes.map((n: any) => n.data.label);
    const involvedNodes = diagram.nodes.filter((n: any) => involvedLabels.includes(n.data.label));
    const { scale, translateX, translateY } = getDiagramTransform(flow!);
    // Only show the edge for the current step if animating
    let visibleEdges: any[] = [];
    if (isAnimating && currentStep >= 0 && flow) {
      const step = flow.steps[currentStep];
      visibleEdges = diagram.edges.filter((e: any) => e.label === step.edgeLabel);
    } else if (flow) {
      // Show all edges in the flow when not animating
      const edgeLabels = new Set(flow.steps.map(s => s.edgeLabel));
      visibleEdges = diagram.edges.filter((e: any) => edgeLabels.has(e.label));
    } else {
      visibleEdges = diagram.edges;
    }
    return (
      <div className={styles['sim-diagram-container']} style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <svg width="100%" height="500" viewBox={`0 0 1200 500`} style={{ display: 'block', width: '100%', maxWidth: 1200 }}>
          <g transform={`translate(${translateX},${translateY}) scale(${scale})`}>
            {/* Render edges as arrows */}
            {visibleEdges.map((edge: any) => {
              const fromNode = diagram.nodes.find((n: any) => n.id === edge.source);
              const toNode = diagram.nodes.find((n: any) => n.id === edge.target);
              if (!fromNode || !toNode) return null;
              const x1 = fromNode.position.x + (fromNode.width || 120) / 2;
              const y1 = fromNode.position.y + (fromNode.height || 40) / 2;
              const x2 = toNode.position.x + (toNode.width || 120) / 2;
              const y2 = toNode.position.y + (toNode.height || 40) / 2;
              return (
                <g key={edge.id}>
                  <line
                    id={getEdgeId(edge.label)}
                    className={`sim-edge ${styles['sim-edge']}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#1976d2"
                    strokeWidth={isAnimating ? 4 : 2}
                    markerEnd="url(#arrowhead)"
                  />
                  {/* Edge label */}
                  <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} fontSize="13" fill="#333" textAnchor="middle">{edge.label}</text>
                </g>
              );
            })}
            {/* Render nodes as rectangles */}
            {involvedNodes.map((node: any) => (
              <g key={node.id}>
                <rect
                  id={getNodeId(node.data.label)}
                  className={`sim-node ${styles['sim-node']}`}
                  x={node.position.x}
                  y={node.position.y}
                  width={node.width || 120}
                  height={node.height || 40}
                  rx={12}
                  fill="#fff"
                  stroke="#1976d2"
                  strokeWidth={isAnimating ? 4 : 2}
                  style={{ filter: 'drop-shadow(0 2px 4px #0001)' }}
                />
                <text
                  x={node.position.x + (node.width || 120) / 2}
                  y={node.position.y + (node.height || 40) / 2 + 5}
                  fontSize="15"
                  fill="#222"
                  textAnchor="middle"
                >{node.data.label}</text>
                {/* Optionally, show a small icon for the node type */}
              </g>
            ))}
            {/* Arrowhead marker */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" markerUnits="strokeWidth">
                <polygon points="0 0, 10 3.5, 0 7" fill="#1976d2" />
              </marker>
            </defs>
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Simulation</h2>
      {flows.length === 0 ? (
        <div>No simulation flows defined in this project.</div>
      ) : (
        <div>
          <div style={{ marginBottom: 16 }}>
            <b>Select a flow to simulate:</b>
            <ul className={styles['sim-flow-list']}>
              {flows.map(flow => (
                <li key={flow.id}>
                  <span style={{ fontWeight: selectedFlow?.id === flow.id ? 'bold' : undefined }}>{flow.label}</span>
                  <button
                    disabled={isAnimating}
                    onClick={() => {
                      setSelectedFlow(flow);
                      setCurrentStep(-1);
                      setIsAnimating(false);
                      console.log('[Simulation] Flow selected:', flow.id);
                    }}
                  >View</button>
                  <button
                    disabled={isAnimating}
                    onClick={async () => {
                      setSelectedFlow(flow);
                      setCurrentStep(-1);
                      setIsAnimating(false);
                      console.log('[Simulation] Flow selected for simulation:', flow.id);
                      await runSimulation(flow);
                    }}
                  >Simulate</button>
                </li>
              ))}
            </ul>
          </div>
          {selectedFlow && (
            <div>
              <div style={{ marginBottom: 8 }}><b>{selectedFlow.label}</b>: {selectedFlow.description}</div>
              {renderDiagram()}
              {isAnimating && currentStep >= 0 && (
                <div className={styles['sim-step-label']}>
                  Step {currentStep + 1}: {selectedFlow.steps[currentStep]?.label}
                  {selectedFlow.steps[currentStep]?.message && (
                    <span style={{ marginLeft: 16, color: '#555', fontStyle: 'italic' }}>
                      [{selectedFlow.steps[currentStep]?.type}] {selectedFlow.steps[currentStep]?.message}
                    </span>
                  )}
                </div>
              )}
              {!isAnimating && currentStep === -1 && (
                <div style={{ margin: '12px 0', color: '#888' }}>Click Simulate to animate this flow.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimulationEngineUI;
