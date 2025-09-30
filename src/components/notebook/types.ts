export interface Notebook {
  id: string;
  name: string;
  cells: Cell[];
  createdAt: Date;
  updatedAt: Date;
  metadata: NotebookMetadata;
}

export interface Cell {
  id: string;
  type: 'code' | 'markdown';
  content: string;
  output?: CellOutput;
  metadata: CellMetadata;
}

export interface CellOutput {
  type: 'text' | 'error' | 'html';
  content: string;
  executionTime?: number;
}

export interface NotebookMetadata {
  language: string;
  kernelName: string;
}

export interface CellMetadata {
  executionCount?: number;
  collapsed?: boolean;
}

export interface NotebookStorage {
  notebooks: Record<string, Notebook>;
  activeNotebookId: string | null;
}