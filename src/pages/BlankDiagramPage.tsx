  return (
    <Box sx={{ width: '100vw', height: '100vh', minHeight: 0, minWidth: 0, overflow: 'hidden' }}>
      <ArchFlowEditor
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
        diagram={diagram}
        setDiagram={setDiagram}
        maximized={maximized}
        setMaximized={setMaximized}
        aiPanelOpen={aiPanelOpen}
        setAiPanelOpen={setAiPanelOpen}
        diagramKey={diagramKey}
        pendingDiagram={pendingDiagram}
        setPendingDiagram={setPendingDiagram}
      />
    </Box>
  ); 