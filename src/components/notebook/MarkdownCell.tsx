import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Eye, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Cell } from './types';

interface MarkdownCellProps {
  cell: Cell;
  onUpdate: (updates: Partial<Cell>) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canDelete: boolean;
}

export const MarkdownCell: React.FC<MarkdownCellProps> = ({
  cell,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [renderedContent, setRenderedContent] = useState('');

  useEffect(() => {
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    // Render markdown content
    const renderMarkdown = async () => {
      try {
        const html = await marked(cell.content);
        setRenderedContent(html);
      } catch (error) {
        console.error('Error rendering markdown:', error);
        setRenderedContent('<p>Error rendering markdown content</p>');
      }
    };

    renderMarkdown();
  }, [cell.content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ content: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
    }
    
    // Handle tab indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onUpdate({ content: newValue });
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="border border-slate-600/30 rounded-lg bg-slate-800/30 overflow-hidden">
      {/* Cell Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-700/30 border-b border-slate-600/30">
        <div className="text-xs text-slate-400">Markdown Cell</div>
        
        <div className="flex items-center space-x-1">
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
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center space-x-1 px-2 py-1 border rounded transition-colors ${
              isEditing
                ? 'bg-green-500/20 border-green-400/30 text-green-400'
                : 'bg-blue-500/20 border-blue-400/30 text-blue-400 hover:bg-blue-500/30'
            }`}
            title={isEditing ? 'Preview (Shift+Enter)' : 'Edit'}
          >
            {isEditing ? (
              <>
                <Eye className="h-3 w-3" />
                <span className="text-xs">Preview</span>
              </>
            ) : (
              <>
                <Edit className="h-3 w-3" />
                <span className="text-xs">Edit</span>
              </>
            )}
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

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <textarea
            value={cell.content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            className="w-full h-48 bg-slate-700/50 border border-slate-600/50 rounded-lg p-3 text-slate-200 font-mono text-sm resize-none focus:outline-none focus:border-blue-400/50"
            placeholder="Enter markdown content..."
            autoFocus
          />
        ) : (
          <div 
            className="prose prose-invert prose-blue max-w-none"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
            style={{
              // Custom styles for the rendered markdown
              color: '#e2e8f0',
            }}
          />
        )}
      </div>

      {/* Help text when editing */}
      {isEditing && (
        <div className="px-4 pb-3 text-xs text-slate-400">
          <div className="bg-slate-700/30 rounded p-2">
            <div className="font-medium mb-1">Markdown Tips:</div>
            <div className="space-y-1">
              <div># Header 1, ## Header 2, ### Header 3</div>
              <div>**bold**, *italic*, `code`</div>
              <div>- List item, 1. Numbered list</div>
              <div>[Link](url), ![Image](url)</div>
              <div>Press Shift+Enter to preview</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};