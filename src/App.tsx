  if (location.pathname === '/blank-diagram') {
    if (maximized) {
      // Maximized: Only show editor + AI assistant + maximize/restore button
      return (
        <Box sx={{ minHeight: '100vh', width: '100vw', boxSizing: 'border-box' }}>
          <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'row', background: '#f8f9fa' }}>
            <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <IconButton
                onClick={() => { setMaximized(false); setDiagramKey(k => k + 1); }}
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
                  onClick={() => { setMaximized(true); setDiagramKey(k => k + 1); }}
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