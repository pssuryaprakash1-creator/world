import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText } from 'lucide-react';
import { SceneManager } from './SceneManager';

interface SavedScene {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface LoadSceneModalProps {
  isOpen: boolean;
  onClose: () => void;
  sceneManager: SceneManager | null;
}

const LoadSceneModal: React.FC<LoadSceneModalProps> = ({ isOpen, onClose, sceneManager }) => {
  const [scenes, setScenes] = useState<SavedScene[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && sceneManager) {
      loadScenes();
    }
  }, [isOpen, sceneManager]);

  const loadScenes = async () => {
    if (!sceneManager) return;
    
    setLoading(true);
    try {
      const sceneList = await sceneManager.listScenes();
      setScenes(sceneList);
    } catch (error) {
      console.error('Failed to load scenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadScene = async (sceneId: string) => {
    if (!sceneManager) return;
    
    try {
      await sceneManager.loadScene(sceneId);
      onClose();
    } catch (error) {
      console.error('Failed to load scene:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg w-96 max-h-96 overflow-hidden border border-slate-700">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Load Scene</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="text-center text-slate-400 py-8">Loading scenes...</div>
          ) : scenes.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No saved scenes found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {scenes.map(scene => (
                <button
                  key={scene.id}
                  onClick={() => handleLoadScene(scene.id)}
                  className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors border border-slate-600"
                >
                  <div className="text-white font-medium">{scene.name}</div>
                  <div className="text-sm text-slate-400 flex items-center space-x-2 mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(scene.updated_at).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadSceneModal;