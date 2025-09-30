import React, { useState, useCallback, useEffect } from 'react';
import { Save, Download, Plus } from 'lucide-react';
import { Notebook, Cell } from './types';
import { NotebookStorage } from './NotebookStorage';
import { CodeCell } from './CodeCell';
import { MarkdownCell } from './MarkdownCell';

interface NotebookEditorProps {
  notebook: Notebook;
  onNotebookUpdate: (notebook: Notebook) => void;
}

export const NotebookEditor: React.FC<NotebookEditorProps> = ({
  notebook,
  onNotebookUpdate,
}) => {
  const [isModified, setIsModified] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [executingCells, setExecutingCells] = useState<Set<string>>(new Set());

  // Auto-save functionality with debouncing
  useEffect(() => {
    if (isModified) {
      const timeoutId = setTimeout(() => {
        onNotebookUpdate(notebook);
        setIsModified(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [notebook, isModified, onNotebookUpdate]);

  const updateNotebook = useCallback((updates: Partial<Notebook>) => {
    const updatedNotebook = {
      ...notebook,
      ...updates,
      updatedAt: new Date(),
    };
    onNotebookUpdate(updatedNotebook);
    setIsModified(true);
  }, [notebook, onNotebookUpdate]);

  const handleCellUpdate = useCallback((cellId: string, updates: Partial<Cell>) => {
    const updatedCells = notebook.cells.map(cell =>
      cell.id === cellId ? { ...cell, ...updates } : cell
    );
    updateNotebook({ cells: updatedCells });
  }, [notebook.cells, updateNotebook]);

  const handleAddCell = useCallback((type: 'code' | 'markdown', afterCellId?: string) => {
    const newCell: Cell = {
      id: `cell-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      type,
      content: type === 'code' 
        ? '// Enter your code here\n' 
        : '# New Markdown Cell\n\nEnter your markdown content here...',
      metadata: {}
    };

    let updatedCells;
    if (afterCellId) {
      const insertIndex = notebook.cells.findIndex(cell => cell.id === afterCellId) + 1;
      updatedCells = [
        ...notebook.cells.slice(0, insertIndex),
        newCell,
        ...notebook.cells.slice(insertIndex)
      ];
    } else {
      updatedCells = [...notebook.cells, newCell];
    }

    updateNotebook({ cells: updatedCells });
  }, [notebook.cells, updateNotebook]);

  const handleDeleteCell = useCallback((cellId: string) => {
    if (notebook.cells.length <= 1) return; // Prevent deleting the last cell
    
    const updatedCells = notebook.cells.filter(cell => cell.id !== cellId);
    updateNotebook({ cells: updatedCells });
  }, [notebook.cells, updateNotebook]);

  const handleMoveCellUp = useCallback((cellId: string) => {
    const cellIndex = notebook.cells.findIndex(cell => cell.id === cellId);
    if (cellIndex <= 0) return;

    const updatedCells = [...notebook.cells];
    [updatedCells[cellIndex - 1], updatedCells[cellIndex]] = 
    [updatedCells[cellIndex], updatedCells[cellIndex - 1]];
    
    updateNotebook({ cells: updatedCells });
  }, [notebook.cells, updateNotebook]);

  const handleMoveCellDown = useCallback((cellId: string) => {
    const cellIndex = notebook.cells.findIndex(cell => cell.id === cellId);
    if (cellIndex >= notebook.cells.length - 1) return;

    const updatedCells = [...notebook.cells];
    [updatedCells[cellIndex], updatedCells[cellIndex + 1]] = 
    [updatedCells[cellIndex + 1], updatedCells[cellIndex]];
    
    updateNotebook({ cells: updatedCells });
  }, [notebook.cells, updateNotebook]);

  const handleExecuteCell = useCallback(async (cellId: string) => {
    const cell = notebook.cells.find(c => c.id === cellId);
    if (!cell || cell.type !== 'code') return;

    setExecutingCells(prev => new Set(prev).add(cellId));

    try {
      const startTime = Date.now();
      
      // Create a safe execution environment
      const result = await executeCode(cell.content);
      const executionTime = Date.now() - startTime;

      handleCellUpdate(cellId, {
        output: {
          type: result.error ? 'error' : 'text',
          content: result.error || result.output,
          executionTime
        },
        metadata: {
          ...cell.metadata,
          executionCount: (cell.metadata.executionCount || 0) + 1
        }
      });
    } catch (error) {
      handleCellUpdate(cellId, {
        output: {
          type: 'error',
          content: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      });
    } finally {
      setExecutingCells(prev => {
        const newSet = new Set(prev);
        newSet.delete(cellId);
        return newSet;
      });
    }
  }, [notebook.cells, handleCellUpdate]);

  const handleSave = useCallback(() => {
    onNotebookUpdate(notebook);
    setIsModified(false);
  }, [notebook, onNotebookUpdate]);

  const handleExport = (format: 'json' | 'markdown') => {
    const content = NotebookStorage.exportNotebook(notebook, format);
    const filename = `${notebook.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format === 'json' ? 'json' : 'md'}`;
    const mimeType = format === 'json' ? 'application/json' : 'text/markdown';
    
    NotebookStorage.downloadFile(content, filename, mimeType);
    setShowExportModal(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          handleSave();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-blue-400/20 bg-slate-800/30 gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-white truncate">{notebook.name}</h1>
          {isModified && (
            <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded whitespace-nowrap">
              Unsaved changes
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-400 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span className="text-sm hidden sm:inline">Save</span>
          </button>
          
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-600/20 hover:bg-slate-600/30 border border-slate-500/30 rounded-lg text-slate-400 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Cells */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {notebook.cells.map((cell, index) => (
            <div key={cell.id} className="group">
              {cell.type === 'code' ? (
                <CodeCell
                  cell={cell}
                  isExecuting={executingCells.has(cell.id)}
                  onUpdate={(updates) => handleCellUpdate(cell.id, updates)}
                  onExecute={() => handleExecuteCell(cell.id)}
                  onDelete={() => handleDeleteCell(cell.id)}
                  onMoveUp={index > 0 ? () => handleMoveCellUp(cell.id) : undefined}
                  onMoveDown={index < notebook.cells.length - 1 ? () => handleMoveCellDown(cell.id) : undefined}
                  canDelete={notebook.cells.length > 1}
                />
              ) : (
                <MarkdownCell
                  cell={cell}
                  onUpdate={(updates) => handleCellUpdate(cell.id, updates)}
                  onDelete={() => handleDeleteCell(cell.id)}
                  onMoveUp={index > 0 ? () => handleMoveCellUp(cell.id) : undefined}
                  onMoveDown={index < notebook.cells.length - 1 ? () => handleMoveCellDown(cell.id) : undefined}
                  canDelete={notebook.cells.length > 1}
                />
              )}
              
              {/* Add Cell Button */}
              <div className="flex justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddCell('code', cell.id)}
                    className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded text-xs text-blue-400 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Code</span>
                  </button>
                  <button
                    onClick={() => handleAddCell('markdown', cell.id)}
                    className="flex items-center space-x-1 px-2 py-1 bg-slate-600/20 hover:bg-slate-600/30 border border-slate-500/30 rounded text-xs text-slate-400 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Markdown</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Final Add Cell Button */}
          <div className="flex justify-center pt-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
              <button
                onClick={() => handleAddCell('code')}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-400 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Code Cell</span>
              </button>
              <button
                onClick={() => handleAddCell('markdown')}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-600/20 hover:bg-slate-600/30 border border-slate-500/30 rounded-lg text-slate-400 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Markdown Cell</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-blue-400/30 rounded-lg p-6 w-96 mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Export Notebook</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => handleExport('json')}
                className="w-full p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-left transition-colors"
              >
                <div className="font-medium text-white">JSON Format</div>
                <div className="text-sm text-blue-300/70">Complete notebook data with metadata</div>
              </button>
              
              <button
                onClick={() => handleExport('markdown')}
                className="w-full p-3 bg-slate-600/20 hover:bg-slate-600/30 border border-slate-500/30 rounded-lg text-left transition-colors"
              >
                <div className="font-medium text-white">Markdown Format</div>
                <div className="text-sm text-slate-300/70">Human-readable format for sharing</div>
              </button>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple code execution function (runs in main thread - for demo purposes)
async function executeCode(code: string): Promise<{ output: string; error?: string }> {
  try {
    // Create a safe execution context
    const logs: string[] = [];
    const originalConsoleLog = console.log;
    
    // Override console.log to capture output
    console.log = (...args: unknown[]) => {
      logs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
    };

    try {
      // Import marine data helpers for notebook context
      const { MarineDataAnalyzer } = await import('./MarineDataHelpers');
      
      // Create enhanced execution context with marine helpers
      const enhancedCode = `
        // Marine Data Analysis Helpers
        const MarineAnalyzer = ${MarineDataAnalyzer.toString()};
        const calculateDensity = MarineAnalyzer.calculateDensity;
        const calculateDistance = MarineAnalyzer.calculateDistance;
        const calculateShannonDiversity = MarineAnalyzer.calculateShannonDiversity;
        const findThermoclineDepth = MarineAnalyzer.findThermoclineDepth;
        const analyzeOilSpillRisk = MarineAnalyzer.analyzeOilSpillRisk;
        const generateOceanData = MarineAnalyzer.generateSampleOceanData;
        const generateSpeciesData = MarineAnalyzer.generateSampleSpeciesData;
        
        // User code
        ${code}
      `;
      
      // Execute the enhanced code
      const result = new Function(enhancedCode)();
      
      // Restore console.log
      console.log = originalConsoleLog;
      
      // Return captured logs or result
      if (logs.length > 0) {
        return { output: logs.join('\n') };
      } else if (result !== undefined) {
        return { output: typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result) };
      } else {
        return { output: 'Code executed successfully (no output)' };
      }
    } catch (error) {
      console.log = originalConsoleLog;
      throw error;
    }
  } catch (error) {
    return { 
      output: '', 
      error: error instanceof Error ? error.message : 'Unknown execution error' 
    };
  }
}