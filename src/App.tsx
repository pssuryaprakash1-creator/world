import React, { useState, useRef, useCallback } from 'react';
import { Scene, Vector3, AbstractMesh } from '@babylonjs/core';
import BabylonCanvas from './components/BabylonCanvas';
import AssetLibrary from './components/AssetLibrary';
import PropertiesPanel from './components/PropertiesPanel';
import Toolbar from './components/Toolbar';
import LoadSceneModal from './components/LoadSceneModal';
import CodeWindow from './components/CodeWindow';
import { SceneManager } from './components/SceneManager';
import { useSceneOperations } from './hooks/useSceneOperations';

interface Asset {
  id: string;
  name: string;
  type: 'mesh' | 'material' | 'light' | 'animation';
  data?: any;
}

function App() {
  const [scene, setScene] = useState<Scene | null>(null);
  const [sceneManager, setSceneManager] = useState<SceneManager | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showCodeWindow, setShowCodeWindow] = useState(false);
  const [draggedAsset, setDraggedAsset] = useState<Asset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    selectedMesh,
    setSelectedMesh,
    sceneData,
    createMesh,
    applyMaterial,
    createLight,
    applyAnimation,
    deleteMesh,
    resetScene,
    updateSceneData,
    applyCodeChanges
  } = useSceneOperations(scene);

  const handleSceneReady = useCallback((babylonScene: Scene) => {
    setScene(babylonScene);
    setSceneManager(new SceneManager(babylonScene));
  }, []);

  const handleMeshClick = useCallback((mesh: AbstractMesh) => {
    setSelectedMesh(mesh);
  }, [setSelectedMesh]);

  const handleAssetDrag = useCallback((asset: Asset) => {
    setDraggedAsset(asset);
  }, []);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedAsset || !scene) return;

    const canvas = e.currentTarget as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Convert to 3D position (simplified)
    const position = new Vector3(x * 10, 1, y * 10);

    if (draggedAsset.type === 'mesh') {
      const mesh = createMesh(draggedAsset.id, position);
      if (mesh) {
        setSelectedMesh(mesh);
      }
    } else if (draggedAsset.type === 'material' && selectedMesh) {
      applyMaterial(selectedMesh, draggedAsset);
    } else if (draggedAsset.type === 'light') {
      createLight(draggedAsset.id, position);
    } else if (draggedAsset.type === 'animation' && selectedMesh) {
      applyAnimation(selectedMesh, draggedAsset.id);
    }

    setDraggedAsset(null);
  }, [draggedAsset, scene, selectedMesh, createMesh, applyMaterial, createLight, applyAnimation, setSelectedMesh]);

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleSave = useCallback(async () => {
    if (!sceneManager) return;
    
    const sceneName = prompt('Enter scene name:') || 'Untitled Scene';
    await sceneManager.saveScene(sceneName);
  }, [sceneManager]);

  const handleExport = useCallback(() => {
    if (!sceneManager) return;
    sceneManager.exportScene();
  }, [sceneManager]);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && sceneManager) {
      sceneManager.importScene(file);
    }
  }, [sceneManager]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
    // Toggle scene animations
    if (scene) {
      if (isPlaying) {
        scene.animationsEnabled = false;
      } else {
        scene.animationsEnabled = true;
      }
    }
  }, [scene, isPlaying]);

  const handleToggleCodeWindow = useCallback(() => {
    setShowCodeWindow(prev => !prev);
  }, []);

  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
      <Toolbar
        onSave={handleSave}
        onLoad={() => setShowLoadModal(true)}
        onExport={handleExport}
        onImport={handleImport}
        onReset={resetScene}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onToggleCodeWindow={handleToggleCodeWindow}
        isCodeWindowVisible={showCodeWindow}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <AssetLibrary onAssetDrag={handleAssetDrag} />
        
        <div 
          className="flex-1 relative bg-slate-800"
          onDrop={handleCanvasDrop}
          onDragOver={handleCanvasDragOver}
        >
          <BabylonCanvas 
            onSceneReady={handleSceneReady}
            onMeshClick={handleMeshClick}
            selectedMesh={selectedMesh}
          />
          
          {/* Drop overlay */}
          {draggedAsset && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 border-2 border-dashed border-blue-400 flex items-center justify-center pointer-events-none">
              <div className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
                Drop {draggedAsset.name} to add to scene
              </div>
            </div>
          )}
        </div>
        
        <PropertiesPanel
          selectedMesh={selectedMesh}
          onDeleteMesh={deleteMesh}
          onUpdateSceneData={updateSceneData}
        />
      </div>

      <CodeWindow
        sceneData={sceneData}
        onCodeChange={applyCodeChanges}
        isVisible={showCodeWindow}
        onToggleVisibility={handleToggleCodeWindow}
      />

      <LoadSceneModal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        sceneManager={sceneManager}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".babylon,.json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default App;