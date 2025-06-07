import React from 'react';
import canvasIcon from '../../assets/figma_components/0:117.svg';

const CanvasUI: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img src={canvasIcon} alt="Canvas Icon" style={{ position: 'absolute', top: 20, left: 20, opacity: 0.2, width: 120, height: 120 }} />
      Canvas UI (Diagramming interface)
    </div>
  );
};

export default CanvasUI;
