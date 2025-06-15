import React, { useRef } from 'react';

const Mermaid: React.FC<{ chart: string }> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);
  return <div className="mermaid" ref={ref}>{chart}</div>;
};

export default Mermaid; 