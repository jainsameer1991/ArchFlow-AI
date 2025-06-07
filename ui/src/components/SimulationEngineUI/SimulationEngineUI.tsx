import React from 'react';
import simulationBannerIcon from '../../assets/figma_components/0:119.svg';

const SimulationEngineUI: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img src={simulationBannerIcon} alt="Simulation Banner" style={{ position: 'absolute', top: 10, right: 10, width: 80, height: 80, opacity: 0.15 }} />
      Simulation Engine UI (Visualize data/request flow, metrics)
    </div>
  );
};

export default SimulationEngineUI;
