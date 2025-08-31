import React, { useState } from 'react';
import { Box, Cherry as Sphere, Cylinder, Cone, Plane, Palette, Play, Sun, Camera } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: 'mesh' | 'material' | 'light' | 'animation';
  icon: React.ComponentType<any>;
  preview?: string;
  data?: any;
}

interface AssetLibraryProps {
  onAssetDrag: (asset: Asset) => void;
}

const AssetLibrary: React.FC<AssetLibraryProps> = ({ onAssetDrag }) => {
  const [activeCategory, setActiveCategory] = useState<string>('meshes');

  const meshAssets: Asset[] = [
    { id: 'box', name: 'Box', type: 'mesh', icon: Box },
    { id: 'sphere', name: 'Sphere', type: 'mesh', icon: Sphere },
    { id: 'cylinder', name: 'Cylinder', type: 'mesh', icon: Cylinder },
    { id: 'cone', name: 'Cone', type: 'mesh', icon: Cone },
    { id: 'plane', name: 'Plane', type: 'mesh', icon: Plane },
  ];

  const materialAssets: Asset[] = [
    { id: 'red-material', name: 'Red Material', type: 'material', icon: Palette, data: { color: '#ff4444' } },
    { id: 'blue-material', name: 'Blue Material', type: 'material', icon: Palette, data: { color: '#4444ff' } },
    { id: 'green-material', name: 'Green Material', type: 'material', icon: Palette, data: { color: '#44ff44' } },
    { id: 'gold-material', name: 'Gold Material', type: 'material', icon: Palette, data: { color: '#ffd700' } },
  ];

  const lightAssets: Asset[] = [
    { id: 'directional-light', name: 'Directional Light', type: 'light', icon: Sun },
    { id: 'point-light', name: 'Point Light', type: 'light', icon: Camera },
  ];

  const animationAssets: Asset[] = [
    { id: 'rotate-animation', name: 'Rotate', type: 'animation', icon: Play },
    { id: 'scale-animation', name: 'Scale', type: 'animation', icon: Play },
  ];

  const categories = [
    { id: 'meshes', name: 'Meshes', assets: meshAssets },
    { id: 'materials', name: 'Materials', assets: materialAssets },
    { id: 'lights', name: 'Lights', assets: lightAssets },
    { id: 'animations', name: 'Animations', assets: animationAssets },
  ];

  const handleDragStart = (e: React.DragEvent, asset: Asset) => {
    e.dataTransfer.setData('application/json', JSON.stringify(asset));
    onAssetDrag(asset);
  };

  const currentAssets = categories.find(cat => cat.id === activeCategory)?.assets || [];

  return (
    <div className="w-80 h-full bg-slate-900 border-r border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Asset Library</h2>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {currentAssets.map(asset => (
            <div
              key={asset.id}
              draggable
              onDragStart={(e) => handleDragStart(e, asset)}
              className="bg-slate-800 rounded-lg p-4 cursor-grab active:cursor-grabbing border border-slate-700 hover:border-slate-600 hover:bg-slate-750 transition-all duration-200 group"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-slate-600 transition-colors">
                  <asset.icon className="w-6 h-6 text-slate-300" />
                </div>
                <span className="text-sm text-slate-200 text-center font-medium">
                  {asset.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetLibrary;