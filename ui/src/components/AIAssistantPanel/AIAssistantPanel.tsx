import React from 'react';
import aiBannerIcon from '../../assets/figma_components/0:119.svg';

const AIAssistantPanel: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img src={aiBannerIcon} alt="AI Banner" style={{ position: 'absolute', top: 10, right: 10, width: 80, height: 80, opacity: 0.15 }} />
      AI Assistant Panel (Chat with AI, request components, generate docs)
    </div>
  );
};

export default AIAssistantPanel;
