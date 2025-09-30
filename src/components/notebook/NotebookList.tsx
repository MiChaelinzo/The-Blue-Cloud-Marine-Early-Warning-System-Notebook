import React, { useState } from 'react';
import { Plus, FileText, Trash2, Calendar } from 'lucide-react';
import { Notebook } from './types';
import { NotebookStorage } from './NotebookStorage';

interface NotebookListProps {
  notebooks: Notebook[];
  activeNotebookId: string | null;
  onNotebookSelect: (notebookId: string) => void;
  onNotebookCreate: (notebook: Notebook) => void;
  onNotebookDelete: (notebookId: string) => void;
}

export const NotebookList: React.FC<NotebookListProps> = ({
  notebooks,
  activeNotebookId,
  onNotebookSelect,
  onNotebookCreate,
  onNotebookDelete,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCreateNotebook = () => {
    if (newNotebookName.trim()) {
      const notebook = NotebookStorage.createNotebook(newNotebookName.trim());
      onNotebookCreate(notebook);
      setNewNotebookName('');
      setShowCreateModal(false);
    }
  };

  const handleDeleteNotebook = (notebookId: string) => {
    if (deleteConfirm === notebookId) {
      onNotebookDelete(notebookId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(notebookId);
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const sortedNotebooks = [...notebooks].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-blue-400/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Notebooks</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-400/30 transition-colors"
            title="Create New Notebook"
          >
            <Plus className="h-4 w-4 text-blue-400" />
          </button>
        </div>
        
        <div className="text-sm text-blue-300/70">
          {notebooks.length} notebook{notebooks.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Notebook List */}
      <div className="flex-1 overflow-y-auto p-2">
        {sortedNotebooks.length === 0 ? (
          <div className="text-center py-8 text-blue-300/70">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No notebooks yet</p>
            <p className="text-xs mt-1">Create your first notebook to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedNotebooks.map((notebook) => (
              <div
                key={notebook.id}
                className={`group relative p-3 rounded-lg border cursor-pointer transition-all ${
                  activeNotebookId === notebook.id
                    ? 'bg-blue-500/20 border-blue-400/50 text-white'
                    : 'bg-slate-700/30 border-slate-600/30 text-blue-200 hover:bg-slate-700/50 hover:border-slate-500/50'
                }`}
                onClick={() => onNotebookSelect(notebook.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate mb-1">
                      {notebook.name}
                    </h3>
                    <div className="flex items-center text-xs opacity-70 space-x-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(notebook.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <span>{notebook.cells.length} cell{notebook.cells.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotebook(notebook.id);
                    }}
                    className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all ${
                      deleteConfirm === notebook.id
                        ? 'bg-red-500/20 text-red-400'
                        : 'hover:bg-red-500/20 text-slate-400 hover:text-red-400'
                    }`}
                    title={deleteConfirm === notebook.id ? 'Click again to confirm' : 'Delete notebook'}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Notebook Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-blue-400/30 rounded-lg p-6 w-96 mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Notebook</h3>
            
            <input
              type="text"
              value={newNotebookName}
              onChange={(e) => setNewNotebookName(e.target.value)}
              placeholder="Enter notebook name..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateNotebook();
                if (e.key === 'Escape') setShowCreateModal(false);
              }}
            />
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNotebook}
                disabled={!newNotebookName.trim()}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:text-slate-400 text-white rounded-lg transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};