import React, { useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { Play, Trash2, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { Cell } from './types';

interface CodeCellProps {
  cell: Cell;
  isExecuting: boolean;
  onUpdate: (updates: Partial<Cell>) => void;
  onExecute: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canDelete: boolean;
}

export const CodeCell: React.FC<CodeCellProps> = ({
  cell,
  isExecuting,
  onUpdate,
  onExecute,
  onDelete,
  onMoveUp,
  onMoveDown,
  canDelete,
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onUpdate({ content: value });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      onExecute();
    }
  };

  const handleEditorMount = (editor: any, monaco: unknown) => {
    editorRef.current = editor;
    
    // Add Shift+Enter shortcut
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      onExecute();
    });
  };

  const formatExecutionTime = (time?: number) => {
    if (!time) return '';
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  };

  return (
    <div className="border border-slate-600/30 rounded-lg bg-slate-800/30 overflow-hidden">
      {/* Cell Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 sm:px-4 py-2 bg-slate-700/30 border-b border-slate-600/30 gap-2">
        <div className="flex items-center space-x-2">
          <div className="text-xs text-slate-400">
            In [{cell.metadata.executionCount || ' '}]:
          </div>
          {cell.output?.executionTime && (
            <div className="text-xs text-blue-400">
              {formatExecutionTime(cell.output.executionTime)}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1 flex-shrink-0">
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              className="p-1 hover:bg-slate-600/50 rounded text-slate-400 hover:text-white transition-colors"
              title="Move cell up"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          )}
          
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              className="p-1 hover:bg-slate-600/50 rounded text-slate-400 hover:text-white transition-colors"
              title="Move cell down"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={onExecute}
            disabled={isExecuting}
            className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 disabled:bg-slate-600/20 border border-blue-400/30 disabled:border-slate-500/30 rounded text-blue-400 disabled:text-slate-400 transition-colors"
            title="Run cell (Shift+Enter)"
          >
            {isExecuting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Play className="h-3 w-3" />
            )}
            <span className="text-xs">Run</span>
          </button>
          
          {canDelete && (
            <button
              onClick={onDelete}
              className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400 transition-colors"
              title="Delete cell"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Code Editor */}
      <div className="relative" onKeyDown={handleKeyDown}>
        <Editor
          height="200px"
          defaultLanguage="javascript"
          value={cell.content}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: window.innerWidth < 640 ? 12 : 14,
            lineNumbers: window.innerWidth < 640 ? 'off' : 'on',
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'none',
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            padding: { top: 12, bottom: 12 },
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>

      {/* Output */}
      {cell.output && (
        <div className="border-t border-slate-600/30">
          <div className="px-4 py-2 bg-slate-700/20">
            <div className="text-xs text-slate-400 mb-2">
              Out [{cell.metadata.executionCount || ' '}]:
            </div>
            <div className={`font-mono text-sm p-3 rounded border ${
              cell.output.type === 'error'
                ? 'bg-red-900/20 border-red-500/30 text-red-300'
                : 'bg-slate-800/50 border-slate-600/30 text-slate-200'
            }`}>
              <pre className="whitespace-pre-wrap break-words">
                {cell.output.content}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};