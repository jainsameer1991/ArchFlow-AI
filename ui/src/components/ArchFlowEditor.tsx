import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, Tabs, Tab, Button, Divider, Stack, Paper, IconButton } from '@mui/material';
import DiagramEditor from './DiagramEditor';
import MDEditor from '@uiw/react-md-editor';
import Mermaid from './Mermaid';
import mermaid from 'mermaid';
import SimulationEngineUI from './SimulationEngineUI/SimulationEngineUI';

// Add a type for the project state
interface ArchflowProject {
  projectName: string;
  diagram: any;
  simulation: any;
  documentation: {
    prd: string;
    trd: string;
    tasks: string;
  };
}

interface ArchFlowEditorProps {
  fullWidth?: boolean;
  projectName: string;
  setProjectName: (name: string) => void;
  prd: string;
  setPrd: (prd: string) => void;
  trd: string;
  setTrd: (trd: string) => void;
  tasks: string;
  setTasks: (tasks: string) => void;
  simulation: any;
  setSimulation: (sim: any) => void;
  editorKey: number;
  setEditorKey: (k: (prev: number) => number) => void;
  diagramRef: React.RefObject<any>;
  currentDiagram?: any;
  tab: number;
  setTab: (tab: number) => void;
  docTab: number;
  setDocTab: (tab: number) => void;
}

const extractCode = (children: React.ReactNode): string => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractCode).join('');
  if (typeof children === 'object' && children && 'props' in children) return extractCode((children as any).props.children);
  return '';
};

const MermaidCodeBlock = ({ children, className }: { children?: React.ReactNode; className?: string }) => {
  const code = extractCode(children).replace(/^[\n]+|[\n]+$/g, '');
  if (className?.includes('language-mermaid')) {
    return <Mermaid chart={code} />;
  }
  return <pre className={className}><code>{children}</code></pre>;
};

// Utility to ensure all code blocks are preceded by a blank line
const normalizeMarkdown = (md: string) =>
  md.replace(/([^\n])\n(```)/g, '$1\n\n$2');

const ArchFlowEditor = forwardRef<any, ArchFlowEditorProps>(({
  fullWidth,
  projectName,
  setProjectName,
  prd,
  setPrd,
  trd,
  setTrd,
  tasks,
  setTasks,
  simulation,
  setSimulation,
  editorKey,
  setEditorKey,
  diagramRef,
  currentDiagram,
  tab,
  setTab,
  docTab,
  setDocTab
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    setDiagramState: (state: any) => diagramRef.current?.setDiagramState?.(state),
  }));

  useEffect(() => {
    if (tab === 2 && previewRef.current) {
      const observer = new MutationObserver(() => {
        mermaid.run();
      });
      observer.observe(previewRef.current, { childList: true, subtree: true });
      // Initial run in case .mermaid divs are already present
      mermaid.run();
      return () => observer.disconnect();
    }
  }, [tab, prd, trd, tasks, docTab]);

  // Restore diagram on remount or when currentDiagram changes
  useEffect(() => {
    if (currentDiagram && diagramRef.current && diagramRef.current.setDiagramState) {
      diagramRef.current.setDiagramState(currentDiagram);
    }
  }, [currentDiagram, editorKey]);

  // Export project as .archflow file
  const handleExportProject = () => {
    const diagramState = diagramRef.current?.getDiagramState?.() || {};
    const project: ArchflowProject = {
      projectName,
      diagram: diagramState,
      simulation,
      documentation: { prd, trd, tasks },
    };
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName ? projectName.replace(/\s+/g, '_') : 'archflow_project'}.archflow`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  // Import project from .archflow file
  const handleImportProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const project: ArchflowProject = JSON.parse(event.target?.result as string);
        setProjectName(project.projectName || 'Untitled Project');
        setPrd(normalizeMarkdown(project.documentation.prd || ''));
        setTrd(normalizeMarkdown(project.documentation.trd || ''));
        setTasks(normalizeMarkdown(project.documentation.tasks || ''));
        setEditorKey(k => k + 1);
        setSimulation(project.simulation || null);
        diagramRef.current?.setDiagramState?.(project.diagram || {});
      } catch (err) {
        alert('Invalid .archflow file');
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be uploaded again
    e.target.value = '';
  };

  // Load example project from /slack.archflow
  const handleLoadSlackArchflow = async () => {
    try {
      const response = await fetch('/slack.archflow');
      if (!response.ok) throw new Error('File not found');
      const text = await response.text();
      let project: any;
      try {
        // Try YAML first (since .archflow is YAML)
        const jsYaml = await import('js-yaml');
        project = jsYaml.load(text);
        console.log('Loaded project object:', project);
        console.log('Type of project.diagram:', typeof project.diagram);
        console.log('Value of project.diagram:', project.diagram);
      } catch (yamlErr) {
        console.error('YAML parsing error:', yamlErr);
        alert('YAML parsing error: ' + (yamlErr as Error).message);
        try {
          // Fallback to JSON
          project = JSON.parse(text);
          console.log('Loaded project object (JSON fallback):', project);
          console.log('Type of project.diagram:', typeof project.diagram);
          console.log('Value of project.diagram:', project.diagram);
        } catch (jsonErr) {
          console.error('JSON parsing error:', jsonErr);
          alert('JSON parsing error: ' + (jsonErr as Error).message);
          return;
        }
      }
      setProjectName(project.project?.name || project.projectName || 'Untitled Project');
      const doc = project.documentation || project.documentation || {};
      setPrd(normalizeMarkdown(doc.prd || ''));
      setTrd(normalizeMarkdown(doc.trd || ''));
      setTasks(normalizeMarkdown(doc.tasks || doc.task_list?.toString() || ''));
      setEditorKey(k => k + 1);
      setSimulation(project.simulation || null);
      // Diagram loading logic
      if (typeof project.diagram === 'string') {
        try {
          console.log('Loaded diagram string:', project.diagram);
          const diagramJson = JSON.parse(project.diagram.trim());
          diagramRef.current?.setDiagramState?.(diagramJson);
        } catch (e) {
          alert('Diagram JSON parse error: ' + (e as Error).message);
          // fallback: if it's a file reference (should not happen now)
          if (project.diagram.includes('.json')) {
            const diagramResp = await fetch('/' + project.diagram.replace(/^!!import\s+/, '').replace(/['"]/g, '').trim());
            if (diagramResp.ok) {
              const diagramJson = await diagramResp.json();
              diagramRef.current?.setDiagramState?.(diagramJson);
            }
          } else {
            diagramRef.current?.setDiagramState?.({});
          }
        }
      } else if (project.diagram) {
        diagramRef.current?.setDiagramState?.(project.diagram);
      } else if (project.architecture) {
        diagramRef.current?.setDiagramState?.(project.architecture);
      }
    } catch (err) {
      alert('Could not load slack.archflow: ' + (err as Error).message);
    }
  };

  // Save project (for now, just triggers export)
  const handleSaveProject = () => {
    handleExportProject();
  };

  return (
    <Box
      sx={{ width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}
    >
      {/* Project-level top bar removed; projectName is now managed by parent */}
      <Paper elevation={2} sx={{ flex: 1, minHeight: 0, height: '100%', p: 0, display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden', bgcolor: '#fff', boxSizing: 'border-box' }}>
        <Box sx={{ pt: 2, flexShrink: 0 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="DIAGRAM" sx={{ fontWeight: 600 }} />
            <Tab label="SIMULATION" sx={{ fontWeight: 600 }} />
            <Tab label="DOCUMENTATION" sx={{ fontWeight: 600 }} />
          </Tabs>
          <Divider sx={{ mb: 3 }} />
        </Box>
        <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {tab === 0 && (
            <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex', height: '100%', width: '100%', overflow: 'auto' }}>
              <DiagramEditor ref={diagramRef} diagram={currentDiagram} />
            </Box>
          )}
          {tab === 1 && (
            <Box sx={{ flex: 1, minHeight: 0, borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
              {currentDiagram && simulation ? (
                <SimulationEngineUI projectData={{ diagram: JSON.stringify(currentDiagram), simulation }} />
              ) : (
                <Typography variant="h6" color="text.secondary" sx={{ m: 2 }}>No simulation data loaded.</Typography>
              )}
            </Box>
          )}
          {tab === 2 && (
            <Box ref={previewRef} sx={{ flex: 1, minHeight: 0, borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Tabs value={docTab} onChange={(_, v) => setDocTab(v)} sx={{ mb: 2 }}>
                <Tab label="PRD" sx={{ fontWeight: 600 }} />
                <Tab label="TRD" sx={{ fontWeight: 600 }} />
                <Tab label="Taskslist" sx={{ fontWeight: 600 }} />
              </Tabs>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, overflow: 'auto', p: 2 }}>
                {docTab === 0 && (
                  <MDEditor
                    key={editorKey + '-prd'}
                    value={prd}
                    onChange={v => v !== undefined && setPrd(v)}
                    height={"100%"}
                    preview="edit"
                    previewOptions={{
                      components: {
                        code: MermaidCodeBlock
                      }
                    }}
                  />
                )}
                {docTab === 1 && (
                  <MDEditor
                    key={editorKey + '-trd'}
                    value={trd}
                    onChange={v => v !== undefined && setTrd(v)}
                    height={"100%"}
                    preview="edit"
                    previewOptions={{
                      components: {
                        code: MermaidCodeBlock
                      }
                    }}
                  />
                )}
                {docTab === 2 && (
                  <MDEditor
                    key={editorKey + '-tasks'}
                    value={tasks}
                    onChange={v => v !== undefined && setTasks(v)}
                    height={"100%"}
                    preview="edit"
                    previewOptions={{
                      components: {
                        code: MermaidCodeBlock
                      }
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
});

ArchFlowEditor.displayName = 'ArchFlowEditor';

export default ArchFlowEditor; 