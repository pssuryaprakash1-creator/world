import React from 'react';
import { AbstractMesh } from '@babylonjs/core';
import { Settings, Move3D, RotateCcw, Scale, Trash2 } from 'lucide-react';

interface PropertiesPanelProps {
  selectedMesh: AbstractMesh | null;
  onDeleteMesh: () => void;
  onUpdateSceneData: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedMesh, onDeleteMesh, onUpdateSceneData }) => {
  if (!selectedMesh) {
    return (
      <div className="w-80 h-full bg-slate-900 border-l border-slate-700 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select an object to edit properties</p>
        </div>
      </div>
    );
  }

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (selectedMesh) {
      selectedMesh.position[axis] = value;
      onUpdateSceneData();
    }
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (selectedMesh) {
      selectedMesh.rotation[axis] = (value * Math.PI) / 180; // Convert to radians
      onUpdateSceneData();
    }
  };

  const handleScaleChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (selectedMesh) {
      selectedMesh.scaling[axis] = value;
      onUpdateSceneData();
    }
  };

  return (
    <div className="w-80 h-full bg-slate-900 border-l border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-2">Properties</h2>
        <p className="text-sm text-slate-400">Editing: {selectedMesh.name}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Transform Section */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-2 mb-4">
            <Move3D className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-medium text-white">Position</h3>
          </div>
          <div className="space-y-3">
            {['x', 'y', 'z'].map(axis => (
              <div key={axis} className="flex items-center space-x-3">
                <label className="text-sm font-medium text-slate-300 w-6">{axis.toUpperCase()}</label>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.1"
                  value={selectedMesh.position[axis as keyof Vector3]}
                  onChange={(e) => handlePositionChange(axis as 'x' | 'y' | 'z', parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="number"
                  value={selectedMesh.position[axis as keyof Vector3].toFixed(1)}
                  onChange={(e) => handlePositionChange(axis as 'x' | 'y' | 'z', parseFloat(e.target.value))}
                  className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rotation Section */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-2 mb-4">
            <RotateCcw className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-medium text-white">Rotation</h3>
          </div>
          <div className="space-y-3">
            {['x', 'y', 'z'].map(axis => (
              <div key={axis} className="flex items-center space-x-3">
                <label className="text-sm font-medium text-slate-300 w-6">{axis.toUpperCase()}</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={(selectedMesh.rotation[axis as keyof Vector3] * 180) / Math.PI}
                  onChange={(e) => handleRotationChange(axis as 'x' | 'y' | 'z', parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="number"
                  value={Math.round((selectedMesh.rotation[axis as keyof Vector3] * 180) / Math.PI)}
                  onChange={(e) => handleRotationChange(axis as 'x' | 'y' | 'z', parseFloat(e.target.value))}
                  className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scale Section */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-2 mb-4">
            <Scale className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-medium text-white">Scale</h3>
          </div>
          <div className="space-y-3">
            {['x', 'y', 'z'].map(axis => (
              <div key={axis} className="flex items-center space-x-3">
                <label className="text-sm font-medium text-slate-300 w-6">{axis.toUpperCase()}</label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={selectedMesh.scaling[axis as keyof Vector3]}
                  onChange={(e) => handleScaleChange(axis as 'x' | 'y' | 'z', parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="number"
                  value={selectedMesh.scaling[axis as keyof Vector3].toFixed(1)}
                  onChange={(e) => handleScaleChange(axis as 'x' | 'y' | 'z', parseFloat(e.target.value))}
                  className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4">
          <button
            onClick={onDeleteMesh}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete Object</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;