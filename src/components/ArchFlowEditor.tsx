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