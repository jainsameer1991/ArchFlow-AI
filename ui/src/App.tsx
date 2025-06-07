import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import CanvasUI from './components/CanvasUI/CanvasUI';
import AIAssistantPanel from './components/AIAssistantPanel/AIAssistantPanel';
import SimulationEngineUI from './components/SimulationEngineUI/SimulationEngineUI';
import DocumentationPanel from './components/DocumentationPanel/DocumentationPanel';
import NewProjectStarter from './components/NewProjectStarter';
import BlankDiagram from './components/BlankDiagram';
import { Box } from '@mui/material';
import NavBar from './components/NavBar';
// import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Box sx={{ display: 'flex' }}>
        {/* <Sidebar /> */}
        <Box component="main" sx={{ p: 3, flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/canvas" element={<CanvasUI />} />
            <Route path="/ai-assistant" element={<AIAssistantPanel />} />
            <Route path="/simulation" element={<SimulationEngineUI />} />
            <Route path="/documentation" element={<DocumentationPanel />} />
            <Route path="/new-project" element={<NewProjectStarter />} />
            <Route path="/blank-diagram" element={<BlankDiagram />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
