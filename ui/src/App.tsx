import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import CanvasUI from './components/CanvasUI/CanvasUI';
import AIAssistantPanel from './components/AIAssistantPanel/AIAssistantPanel';
import SimulationEngineUI from './components/SimulationEngineUI/SimulationEngineUI';
import DocumentationPanel from './components/DocumentationPanel/DocumentationPanel';
import NewProjectStarter from './components/NewProjectStarter';
import ArchFlowEditor from './components/ArchFlowEditor';
import DiagramEditor from './components/DiagramEditor';
import { Box, Button } from '@mui/material';
import NavBar from './components/NavBar';
import MermaidTest from './components/MermaidTest';
import IconButton from '@mui/material/IconButton';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
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
  const [loadedProjectData, setLoadedProjectData] = useState<any | null>(null);
  const [loadingProject, setLoadingProject] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [maximized, setMaximized] = useState(false);
  const [projectName, setProjectName] = useState('Untitled Project');
  // Project-level state for blank-diagram
  const [prd, setPrd] = useState('');
  const [trd, setTrd] = useState('');
  const [tasks, setTasks] = useState('');
  const [simulation, setSimulation] = useState<any>(null);
  const [editorKey, setEditorKey] = useState(0);
  // Ref for diagram editor in ArchFlowEditor
  const diagramRef = React.useRef<any>(null);
  // Used to ensure diagram is set after DiagramEditor remounts
  const [pendingDiagram, setPendingDiagram] = useState<any>(null);
  // Persist the loaded diagram for remounts/maximize
  const [currentDiagram, setCurrentDiagram] = useState<any>(null);
  // Used to force remount of DiagramEditor for hydration
  const [diagramKey, setDiagramKey] = useState(0);
  // Preserve active tab and docTab across remounts
  const [tab, setTab] = useState(0);
  const [docTab, setDocTab] = useState(0);

  // Load project data on mount (for simulation tab)
  useEffect(() => {
    if (location.pathname === '/simulation' && !loadedProjectData && !loadingProject) {
      setLoadingProject(true);
      fetch('/slack.archflow')
        .then(async (resp) => {
          if (!resp.ok) throw new Error('File not found');
          const text = await resp.text();
          let project: any;
          try {
            const jsYaml = await import('js-yaml');
            project = jsYaml.load(text);
          } catch (yamlErr) {
            try {
              project = JSON.parse(text);
            } catch (jsonErr) {
              setProjectError('Could not parse .archflow file');
              setLoadingProject(false);
              return;
            }
          }
          setLoadedProjectData(project);
          setLoadingProject(false);
        })
        .catch((err) => {
          setProjectError('Could not load .archflow: ' + err.message);
          setLoadingProject(false);
        });
    }
  }, [location.pathname, loadedProjectData, loadingProject]);

  // Restore Load Example (slack.archflow) functionality
  const handleLoadSlackArchflow = async () => {
    try {
      const response = await fetch('/slack.archflow');
      if (!response.ok) throw new Error('File not found');
      const text = await response.text();
      let project: any;
      try {
        const jsYaml = await import('js-yaml');
        project = jsYaml.load(text);
      } catch (yamlErr) {
        try {
          project = JSON.parse(text);
        } catch (jsonErr) {
          alert('Could not parse .archflow file');
          return;
        }
      }
      setProjectName(project.project?.name || project.projectName || 'Untitled Project');
      const doc = project.documentation || {};
      setPrd(doc.prd || '');
      setTrd(doc.trd || '');
      setTasks(doc.tasks || doc.task_list?.toString() || '');
      setSimulation(project.simulation || null);
      // Set diagram after remount
      let diagram = null;
      if (typeof project.diagram === 'string') {
        try {
          diagram = JSON.parse(project.diagram.trim());
        } catch (e) {
          alert('Diagram JSON parse error: ' + (e as Error).message);
          diagram = {};
        }
      } else if (project.diagram) {
        diagram = project.diagram;
      } else if (project.architecture) {
        diagram = project.architecture;
      }
      setCurrentDiagram(diagram);
      setPendingDiagram(diagram);
      setEditorKey(k => k + 1);
      setDiagramKey(k => k + 1);
      console.log('[App] diagramKey incremented (load example)', diagramKey + 1);
    } catch (err) {
      alert('Could not load slack.archflow: ' + (err as Error).message);
    }
  };

  // Set diagram after DiagramEditor remounts
  useEffect(() => {
    if (pendingDiagram && diagramRef.current && diagramRef.current.setDiagramState) {
      diagramRef.current.setDiagramState(pendingDiagram);
      setPendingDiagram(null);
    }
  }, [editorKey, pendingDiagram]);

  if (location.pathname === '/mermaid-test') {
    return <MermaidTest />;
  }
  const showAIPanel = !['/', '/dashboard', '/new-project'].includes(location.pathname);
  const isDashboard = ['/', '/dashboard'].includes(location.pathname);
  // Debug ref for main Box
  const mainBoxRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (mainBoxRef.current) {
      const rect = mainBoxRef.current.getBoundingClientRect();
      console.log('[App.tsx] Main Box rect:', rect);
    }
    const handleResize = () => {
      if (mainBoxRef.current) {
        const rect = mainBoxRef.current.getBoundingClientRect();
        console.log('[App.tsx] Main Box rect on resize:', rect);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Debug log for AI panel
  console.log('[App.tsx] showAIPanel:', showAIPanel, 'pathname:', location.pathname);

  // Top bar actions for /blank-diagram
  const renderBlankDiagramTopBar = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #eee', bgcolor: '#fff', zIndex: 20 }}>
      <Box sx={{ flex: 1 }}>
        <span style={{ fontWeight: 700, fontSize: 22 }}>{projectName}</span>
      </Box>
      <Button variant="contained" sx={{ mx: 1 }} onClick={() => {/* TODO: Save handler */}}>Save Project</Button>
      <Button variant="outlined" sx={{ mx: 1 }} onClick={() => {/* TODO: Import handler */}}>Import Project</Button>
      <Button variant="outlined" sx={{ mx: 1 }} onClick={() => {/* TODO: Export handler */}}>Export Project</Button>
      <Button variant="outlined" color="secondary" sx={{ mx: 1 }} onClick={handleLoadSlackArchflow}>Load Example</Button>
    </Box>
  );

  if (location.pathname === '/blank-diagram') {
    if (maximized) {
      // Maximized: Only show editor + AI assistant + maximize/restore button
      return (
        <Box sx={{ minHeight: '100vh', width: '100vw', boxSizing: 'border-box' }}>
          <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'row', background: '#f8f9fa' }}>
            <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <IconButton
                onClick={() => { console.log('Restore clicked'); setMaximized(false); setDiagramKey(k => { console.log('[App] diagramKey incremented (restore)', k + 1); return k + 1; }); }}
                size="large"
                sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10, bgcolor: 'white', boxShadow: 1 }}
                title={'Restore'}
              >
                <FullscreenExitIcon />
              </IconButton>
              <Box sx={{ width: '100%', height: '100%', minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <ArchFlowEditor
                  key={diagramKey}
                  projectName={projectName}
                  setProjectName={setProjectName}
                  prd={prd}
                  setPrd={setPrd}
                  trd={trd}
                  setTrd={setTrd}
                  tasks={tasks}
                  setTasks={setTasks}
                  simulation={simulation}
                  setSimulation={setSimulation}
                  editorKey={editorKey}
                  setEditorKey={setEditorKey}
                  diagramRef={diagramRef}
                  currentDiagram={currentDiagram}
                  tab={tab}
                  setTab={setTab}
                  docTab={docTab}
                  setDocTab={setDocTab}
                />
              </Box>
            </Box>
            {showAIPanel && (
              <Box sx={{ width: 340, borderLeft: '1px solid #eee', minHeight: 0, bgcolor: '#fafbfc', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                <AIAssistantPanel />
              </Box>
            )}
          </Box>
        </Box>
      );
    } else {
      // Normal: Show NavBar, top bar, editor + AI assistant + maximize button
      return (
        <Box sx={{ minHeight: '100vh', width: '100vw', boxSizing: 'border-box' }}>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar />
            {renderBlankDiagramTopBar()}
            <Box sx={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'row', minHeight: 0, minWidth: 0 }}>
              <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <IconButton
                  onClick={() => { console.log('Maximize clicked'); setMaximized(true); setDiagramKey(k => { console.log('[App] diagramKey incremented (maximize)', k + 1); return k + 1; }); }}
                  size="large"
                  sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10, bgcolor: 'white', boxShadow: 1 }}
                  title={'Maximize'}
                >
                  <FullscreenIcon />
                </IconButton>
                <Box sx={{ width: '100%', height: '100%', minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <ArchFlowEditor
                    key={diagramKey}
                    projectName={projectName}
                    setProjectName={setProjectName}
                    prd={prd}
                    setPrd={setPrd}
                    trd={trd}
                    setTrd={setTrd}
                    tasks={tasks}
                    setTasks={setTasks}
                    simulation={simulation}
                    setSimulation={setSimulation}
                    editorKey={editorKey}
                    setEditorKey={setEditorKey}
                    diagramRef={diagramRef}
                    currentDiagram={currentDiagram}
                    tab={tab}
                    setTab={setTab}
                    docTab={docTab}
                    setDocTab={setDocTab}
                  />
                </Box>
              </Box>
              {showAIPanel && (
                <Box sx={{ width: 340, borderLeft: '1px solid #eee', minHeight: 0, bgcolor: '#fafbfc', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                  <AIAssistantPanel />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      );
    }
  }
  return (
    <ErrorBoundary>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavBar />
        {isDashboard ? (
          <Box
            ref={mainBoxRef}
            component="main"
            sx={{
              p: 3,
              minWidth: 0,
              overflow: 'auto',
              width: '100vw',
              boxSizing: 'border-box',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/canvas" element={<CanvasUI />} />
              <Route path="/ai-assistant" element={<AIAssistantPanel />} />
              <Route path="/simulation" element={
                loadingProject ? <div>Loading simulation project...</div> :
                projectError ? <div style={{ color: 'red' }}>{projectError}</div> :
                loadedProjectData ? <SimulationEngineUI projectData={loadedProjectData} /> :
                <div>No project data loaded.</div>
              } />
              <Route path="/documentation" element={<DocumentationPanel />} />
              <Route path="/diagram" element={<DiagramEditor />} />
              <Route path="/mermaid-test" element={<MermaidTest />} />
            </Routes>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
            <Box
              ref={mainBoxRef}
              component="main"
              sx={{
                p: 3,
                flex: 1,
                minWidth: 0,
                overflow: 'auto',
                boxSizing: 'border-box',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/canvas" element={<CanvasUI />} />
                <Route path="/ai-assistant" element={<AIAssistantPanel />} />
                <Route path="/simulation" element={
                  loadingProject ? <div>Loading simulation project...</div> :
                  projectError ? <div style={{ color: 'red' }}>{projectError}</div> :
                  loadedProjectData ? <SimulationEngineUI projectData={loadedProjectData} /> :
                  <div>No project data loaded.</div>
                } />
                <Route path="/documentation" element={<DocumentationPanel />} />
                <Route path="/new-project" element={<NewProjectStarter fullWidth={true} />} />
                <Route path="/blank-diagram" element={<ArchFlowEditor
                  key={diagramKey}
                  projectName={projectName}
                  setProjectName={setProjectName}
                  prd={prd}
                  setPrd={setPrd}
                  trd={trd}
                  setTrd={setTrd}
                  tasks={tasks}
                  setTasks={setTasks}
                  simulation={simulation}
                  setSimulation={setSimulation}
                  editorKey={editorKey}
                  setEditorKey={setEditorKey}
                  diagramRef={diagramRef}
                  currentDiagram={currentDiagram}
                  tab={tab}
                  setTab={setTab}
                  docTab={docTab}
                  setDocTab={setDocTab}
                />} />
                <Route path="/diagram" element={<DiagramEditor />} />
                <Route path="/mermaid-test" element={<MermaidTest />} />
              </Routes>
            </Box>
            {showAIPanel && (
              <Box sx={{ width: 340, borderLeft: '1px solid #eee', minHeight: 0, bgcolor: '#fafbfc', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                <AIAssistantPanel />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </ErrorBoundary>
  );
};

export default App;
