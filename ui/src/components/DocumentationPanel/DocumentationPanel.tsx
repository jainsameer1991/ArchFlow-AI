import React from 'react';
import docBannerIcon from '../../assets/figma_components/0:118.svg';

const DocumentationPanel: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img src={docBannerIcon} alt="Documentation Banner" style={{ position: 'absolute', top: 10, right: 10, width: 80, height: 80, opacity: 0.15 }} />
      Documentation Panel (Preview, edit, export PRD/TRD)
    </div>
  );
};

export default DocumentationPanel;
