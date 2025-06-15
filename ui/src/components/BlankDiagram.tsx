import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Button, Divider, Stack, Paper, IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import DiagramEditor from './DiagramEditor';
import MDEditor from '@uiw/react-md-editor';
import Mermaid from './Mermaid';
import mermaid from 'mermaid';

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

interface BlankDiagramProps {
  fullWidth?: boolean;
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

const BlankDiagram: React.FC<BlankDiagramProps> = ({ fullWidth }) => {
  const [tab, setTab] = useState(0);
  const [docTab, setDocTab] = useState(0);
  const [prd, setPrd] = useState<string>('');
  const [trd, setTrd] = useState<string>('');
  const [tasks, setTasks] = useState<string>('');
  const [projectName, setProjectName] = useState('Untitled Project');
  const diagramRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editorKey, setEditorKey] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  // Dummy simulation state for now
  const [simulation, setSimulation] = useState<any>(null);

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
      let project: ArchflowProject;
      try {
        project = JSON.parse(text);
      } catch (jsonErr) {
        // Try to parse as YAML if JSON fails (for .archflow YAML files)
        // For now, just fallback to old logic
        throw jsonErr;
      }
      setProjectName(project.projectName || 'Untitled Project');
      // Support both documentation.prd/trd/tasks and documentation.prd/trd/task_list
      const doc = project.documentation || project.documentation || {};
      setPrd(normalizeMarkdown(doc.prd || ''));
      setTrd(normalizeMarkdown(doc.trd || ''));
      setTasks(normalizeMarkdown(doc.tasks || (doc as any).task_list?.toString() || ''));
      setEditorKey(k => k + 1);
      setSimulation(project.simulation || null);
      diagramRef.current?.setDiagramState?.(project.diagram || {});
    } catch (err) {
      // Try to parse as YAML if not valid JSON
      try {
        // Only import js-yaml if needed
        const jsYaml = await import('js-yaml');
        const response = await fetch('/slack.archflow');
        const text = await response.text();
        const project = jsYaml.load(text) as any;
        setProjectName(project.project?.name || 'Untitled Project');
        const doc = project.documentation || {};
        setPrd(normalizeMarkdown(doc.prd || ''));
        setTrd(normalizeMarkdown(doc.trd || ''));
        setTasks(normalizeMarkdown(doc.tasks || (doc as any).task_list?.toString() || ''));
        setEditorKey(k => k + 1);
        setSimulation(project.simulation || null);
        diagramRef.current?.setDiagramState?.(project.diagram || {});
      } catch (yamlErr) {
        alert('Could not load slack.archflow: ' + (err as Error).message);
      }
    }
  };

  // Save project (for now, just triggers export)
  const handleSaveProject = () => {
    handleExportProject();
  };

  return (
    <Box
      sx={fullWidth
        ? { px: 0, py: 4, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }
        : { maxWidth: 1200, mx: 'auto', px: 3, py: 4, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }
      }
    >
      {/* Project-level top bar */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2, px: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ flex: 1 }}>{projectName}</Typography>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveProject}>Save Project</Button>
        <input
          type="file"
          accept=".archflow,application/json"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleImportProject}
        />
        <Button variant="outlined" startIcon={<UploadIcon />} onClick={() => fileInputRef.current?.click()}>Import Project</Button>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportProject}>Export Project</Button>
        <Button variant="outlined" color="secondary" onClick={handleLoadSlackArchflow}>Load Example (slack.archflow)</Button>
      </Stack>
      <Paper elevation={2} sx={{ flex: 1, p: 0, display: 'flex', flexDirection: 'column', minHeight: 0, borderRadius: 3, overflow: 'hidden', bgcolor: '#fff' }}>
        <Box sx={{ pt: 2, flexShrink: 0 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="DIAGRAM" sx={{ fontWeight: 600 }} />
            <Tab label="SIMULATION" sx={{ fontWeight: 600 }} />
            <Tab label="DOCUMENTATION" sx={{ fontWeight: 600 }} />
          </Tabs>
          <Divider sx={{ mb: 3 }} />
        </Box>
        <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {tab === 0 && (
            <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex', height: '100%', width: '100%', overflow: 'auto' }}>
              <DiagramEditor ref={diagramRef} />
            </Box>
          )}
          {tab === 1 && (
            <Box sx={{ flex: 1, minHeight: 0, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="h6" color="text.secondary">Simulation UI Coming Soon</Typography>
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
};

export default BlankDiagram; 