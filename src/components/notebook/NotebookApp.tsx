import React, { useState, useEffect } from 'react';
import { NotebookList } from './NotebookList';
import { NotebookEditor } from './NotebookEditor';
import { NotebookStorage } from './NotebookStorage';
import { Notebook } from './types';

export const NotebookApp: React.FC = () => {
  const [notebooks, setNotebooks] = useState<Record<string, Notebook>>({});
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load notebooks from storage on mount
    const loadNotebooks = async () => {
      try {
        const storage = NotebookStorage.load();
        setNotebooks(storage.notebooks);
        setActiveNotebookId(storage.activeNotebookId);
      } catch (error) {
        console.error('Failed to load notebooks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotebooks();
  }, []);

  const handleNotebookSelect = (notebookId: string) => {
    setActiveNotebookId(notebookId);
    NotebookStorage.setActiveNotebook(notebookId);
  };

  const handleNotebookCreate = (notebook: Notebook) => {
    const updatedNotebooks = { ...notebooks, [notebook.id]: notebook };
    setNotebooks(updatedNotebooks);
    setActiveNotebookId(notebook.id);
    NotebookStorage.save({ notebooks: updatedNotebooks, activeNotebookId: notebook.id });
  };

  const handleNotebookDelete = (notebookId: string) => {
    const updatedNotebooks = { ...notebooks };
    delete updatedNotebooks[notebookId];
    
    const newActiveId = activeNotebookId === notebookId 
      ? Object.keys(updatedNotebooks)[0] || null 
      : activeNotebookId;
    
    setNotebooks(updatedNotebooks);
    setActiveNotebookId(newActiveId);
    NotebookStorage.save({ notebooks: updatedNotebooks, activeNotebookId: newActiveId });
  };

  const handleNotebookUpdate = (notebook: Notebook) => {
    const updatedNotebooks = { ...notebooks, [notebook.id]: notebook };
    setNotebooks(updatedNotebooks);
    NotebookStorage.save({ notebooks: updatedNotebooks, activeNotebookId });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeNotebook = activeNotebookId ? notebooks[activeNotebookId] : null;

  return (
    <div className="flex flex-col lg:flex-row h-full bg-slate-900/50 backdrop-blur-sm rounded-lg border border-blue-400/20">
      {/* Mobile/Tablet: Collapsible sidebar */}
      <div className="lg:w-80 w-full lg:border-r border-b lg:border-b-0 border-blue-400/20 bg-slate-800/50 lg:h-full h-64 lg:block">
        <NotebookList
          notebooks={Object.values(notebooks)}
          activeNotebookId={activeNotebookId}
          onNotebookSelect={handleNotebookSelect}
          onNotebookCreate={handleNotebookCreate}
          onNotebookDelete={handleNotebookDelete}
        />
      </div>
      
      {/* Main editor area */}
      <div className="flex-1 min-h-0">
        {activeNotebook ? (
          <NotebookEditor
            notebook={activeNotebook}
            onNotebookUpdate={handleNotebookUpdate}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-blue-200 p-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">No Notebook Selected</h3>
              <p className="text-blue-300/70 text-sm lg:text-base">Create a new notebook or select an existing one to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};