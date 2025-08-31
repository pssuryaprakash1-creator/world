import React, { useState } from 'react';
import { Save, FolderOpen, Download, Upload, Play, Pause, RotateCcw, Code } from 'lucide-react';

interface ToolbarProps {
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onToggleCodeWindow: () => void;
  isCodeWindowVisible: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onLoad,
  onExport,
  onImport,
  onReset,
  isPlaying,
  onTogglePlay,
  onToggleCodeWindow,
  isCodeWindowVisible
}) => {
  const [sceneName, setSceneName] = useState('Untitled Scene');

  return (
    <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-white">3D World Editor</h1>
        <div className="h-6 w-px bg-slate-600"></div>
        <input
          type="text"
          value={sceneName}
          onChange={(e) => setSceneName(e.target.value)}
          className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Scene name"
        />
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onTogglePlay}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isPlaying 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        <div className="h-6 w-px bg-slate-600"></div>

        <button
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>

        <button
          onClick={onLoad}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <FolderOpen className="w-4 h-4" />
          <span>Load</span>
        </button>

        <button
          onClick={onExport}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>

        <button
          onClick={onImport}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Import</span>
        </button>

        <div className="h-6 w-px bg-slate-600"></div>

        <button
          onClick={onToggleCodeWindow}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 ${
            isCodeWindowVisible 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-slate-700 hover:bg-slate-600 text-white'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Code</span>
        </button>

        <button
          onClick={onReset}
          className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors duration-200"
          title="Reset Scene"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;