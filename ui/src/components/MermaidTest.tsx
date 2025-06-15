import React from 'react';
import Mermaid from './Mermaid';

const MermaidTest: React.FC = () => {
  return (
    <div style={{ background: '#fff', padding: 16 }}>
      <Mermaid chart={`graph TD; A-->B; B-->C; C-->A;`} />
      <Mermaid chart={`sequenceDiagram\nAlice->>Bob: Hello Bob, how are you?\nBob-->>Alice: I am good thanks!`} />
    </div>
  );
};

export default MermaidTest; 