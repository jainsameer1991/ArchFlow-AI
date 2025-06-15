import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import CanvasUI from './components/CanvasUI/CanvasUI';
import AIAssistantPanel from './components/AIAssistantPanel/AIAssistantPanel';
import SimulationEngineUI from './components/SimulationEngineUI/SimulationEngineUI';
import DocumentationPanel from './components/DocumentationPanel/DocumentationPanel';
import NewProjectStarter from './components/NewProjectStarter';
import BlankDiagram from './components/BlankDiagram';
import DiagramEditor from './components/DiagramEditor';
import { Box } from '@mui/material';
import NavBar from './components/NavBar';
import MermaidTest from './components/MermaidTest';
// import Sidebar from './components/Sidebar';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can log error info here
    // console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <Box sx={{ p: 4, color: 'red' }}>Something went wrong: {this.state.error?.toString()}</Box>;
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/mermaid-test') {
    return <MermaidTest />;
  }
  const showAIPanel = !['/', '/dashboard', '/new-project'].includes(location.pathname);
  const isDashboard = ['/', '/dashboard'].includes(location.pathname);
  return (
    <ErrorBoundary>
      <NavBar />
      {isDashboard ? (
        <Box component="main" sx={{ p: 3, minWidth: 0, overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/canvas" element={<CanvasUI />} />
            <Route path="/ai-assistant" element={<AIAssistantPanel />} />
            <Route path="/simulation" element={<SimulationEngineUI />} />
            <Route path="/documentation" element={<DocumentationPanel />} />
            <Route path="/new-project" element={<NewProjectStarter fullWidth={showAIPanel} />} />
            <Route path="/blank-diagram" element={<BlankDiagram fullWidth={showAIPanel} />} />
            <Route path="/diagram" element={<DiagramEditor />} />
            <Route path="/mermaid-test" element={<MermaidTest />} />
          </Routes>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', height: '100vh' }}>
          {/* <Sidebar /> */}
          <Box component="main" sx={{ p: 3, flex: 1, minWidth: 0, height: '100vh', overflow: 'auto' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/canvas" element={<CanvasUI />} />
              <Route path="/ai-assistant" element={<AIAssistantPanel />} />
              <Route path="/simulation" element={<SimulationEngineUI />} />
              <Route path="/documentation" element={<DocumentationPanel />} />
              <Route path="/new-project" element={<NewProjectStarter fullWidth={showAIPanel} />} />
              <Route path="/blank-diagram" element={<BlankDiagram fullWidth={showAIPanel} />} />
              <Route path="/diagram" element={<DiagramEditor />} />
              <Route path="/mermaid-test" element={<MermaidTest />} />
            </Routes>
          </Box>
          {showAIPanel && (
            <Box sx={{ width: 340, borderLeft: '1px solid #eee', height: '100vh', bgcolor: '#fafbfc', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
              <AIAssistantPanel />
            </Box>
          )}
        </Box>
      )}
    </ErrorBoundary>
  );
};

export default App;
