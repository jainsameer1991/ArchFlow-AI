import React, { useCallback, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemButton, ListItemText, IconButton, Typography, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ComponentPalette from './ComponentPalette';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Define nodeTypes and edgeTypes outside the component to avoid React Flow warning
const nodeTypes = {};
const edgeTypes = {};

interface DiagramEditorProps {
  diagram?: any;
}

const DiagramEditor = forwardRef<any, DiagramEditorProps>((props, ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [editWorkflowName, setEditWorkflowName] = useState(false);
  const [tempWorkflowName, setTempWorkflowName] = useState(workflowName);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [workflows, setWorkflows] = useState<string[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveAsName, setSaveAsName] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expose get/set methods for project import/export
  useImperativeHandle(ref, () => ({
    getDiagramState: () => ({ nodes, edges, workflowName }),
    setDiagramState: (state: any) => {
      if (state.nodes) setNodes(state.nodes);
      if (state.edges) setEdges(state.edges);
      if (state.workflowName) setWorkflowName(state.workflowName);
    },
  }), [nodes, edges, workflowName]);

  const onConnect = useCallback(
    (params: Edge | any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Workflow actions (dummy for now)
  const handleNewWorkflow = () => {
    setNodes([]);
    setEdges([]);
    setWorkflowName('Untitled Workflow');
  };
  const handleSaveWorkflow = () => {
    setSnackbar({ open: true, message: 'Workflow saved (not implemented)!' });
  };
  const handleAddNode = () => {
    setNodes((nds) => [
      ...nds,
      {
        id: `${nds.length + 1}`,
        type: 'default',
        position: { x: Math.random() * 250, y: Math.random() * 250 },
        data: { label: `Service ${nds.length + 1}` },
      } as Node,
    ]);
  };
  const handleOpenWorkflow = () => setLoadDialogOpen(true);
  const handleSaveDialogSave = () => {
    setWorkflowName(saveAsName);
    setSaveDialogOpen(false);
    setSnackbar({ open: true, message: 'Workflow saved as ' + saveAsName });
  };

  // Rehydrate from diagram prop
  React.useEffect(() => {
    console.log('[DiagramEditor] MOUNT or diagram prop changed', { diagram: props.diagram });
    if (typeof props.diagram === 'object' && props.diagram) {
      console.log('[DiagramEditor] Hydrating from diagram prop:', props.diagram);
      if (Array.isArray(props.diagram.nodes) && Array.isArray(props.diagram.edges)) {
        setNodes(props.diagram.nodes);
        setEdges(props.diagram.edges);
        console.log('[DiagramEditor] setNodes/Edges', props.diagram.nodes, props.diagram.edges);
      } else {
        setNodes([]);
        setEdges([]);
        console.log('[DiagramEditor] setNodes/Edges to empty array');
      }
      if (props.diagram.workflowName) {
        setWorkflowName(props.diagram.workflowName);
        console.log('[DiagramEditor] setWorkflowName', props.diagram.workflowName);
      } else {
        setWorkflowName('Untitled Workflow');
        console.log('[DiagramEditor] setWorkflowName to Untitled Workflow');
      }
    } else {
      setNodes([]);
      setEdges([]);
      setWorkflowName('Untitled Workflow');
      console.log('[DiagramEditor] diagram prop is not object, reset to empty');
    }
  }, [props.diagram]);

  return (
    <Box sx={{ display: 'flex', height: '100%', width: '100%', background: '#f0f2f5', minWidth: 0, minHeight: 0 }}>
      <ComponentPalette />
      <Box sx={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, height: '100%' }}>
        {/* Top bar with workflow actions */}
        <Box sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: '#fff',
          boxShadow: 1,
          position: 'sticky',
          top: 0,
          zIndex: 2,
          width: '100%',
          minWidth: 0,
          overflowX: 'auto',
          flexWrap: 'wrap',
        }}>
          {editWorkflowName ? (
            <>
              <TextField
                value={tempWorkflowName}
                onChange={e => setTempWorkflowName(e.target.value)}
                size="small"
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') { setWorkflowName(tempWorkflowName); setEditWorkflowName(false); } }}
              />
              <Button onClick={() => { setWorkflowName(tempWorkflowName); setEditWorkflowName(false); }} size="small">Save</Button>
            </>
          ) : (
            <>
              <span style={{ fontWeight: 'bold', fontSize: 20 }}>{workflowName}</span>
              <IconButton size="small" onClick={() => { setTempWorkflowName(workflowName); setEditWorkflowName(true); }}><EditIcon fontSize="small" /></IconButton>
            </>
          )}
          <Button variant="outlined" onClick={handleNewWorkflow}>New Workflow</Button>
          <Button variant="contained" onClick={handleSaveWorkflow}>Save Workflow</Button>
          <Button variant="contained" onClick={handleAddNode}>Add Service Node</Button>
          <input
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={() => {}}
          />
          <Button variant="outlined" onClick={handleOpenWorkflow}>Open Workflow</Button>
          <Button variant="outlined" color="info" onClick={() => setSnackbar({ open: true, message: 'Manual JSON not implemented!' })}>
            Syntax Overview / Manual JSON
          </Button>
          <Button variant="outlined" color="success" onClick={() => setSnackbar({ open: true, message: 'Copy Workflow JSON not implemented!' })}>Copy Workflow JSON</Button>
        </Box>
        {/* Canvas area with grid, zoom, minimap */}
        <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, position: 'relative', overflowY: 'scroll', overflowX: 'auto', display: 'flex', '::-webkit-scrollbar': { width: 10 }, '::-webkit-scrollbar-thumb': { background: '#d0d0d0', borderRadius: 5 }, scrollbarWidth: 'auto', scrollbarColor: '#d0d0d0 #fafbfc' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            style={{ minWidth: 800, minHeight: 600 }}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </Box>
        {/* Load Workflow Dialog */}
        <Dialog open={loadDialogOpen} onClose={() => setLoadDialogOpen(false)}>
          <DialogTitle>Load Workflow</DialogTitle>
          <DialogContent>
            <List>
              {workflows.map((wf) => (
                <ListItem key={wf} disablePadding>
                  <ListItemButton onClick={() => setSnackbar({ open: true, message: 'Load workflow not implemented!' })}>
                    <ListItemText primary={wf} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLoadDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
        {/* Save Workflow Dialog */}
        <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
          <DialogTitle>Save Workflow</DialogTitle>
          <DialogContent>
            <TextField
              label="Workflow Name"
              value={saveAsName}
              onChange={e => setSaveAsName(e.target.value)}
              fullWidth
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveDialogSave} disabled={!saveAsName.trim()}>Save</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={() => setSnackbar({ open: false, message: '' })}
          message={snackbar.message}
        />
      </Box>
    </Box>
  );
});

export default DiagramEditor; 