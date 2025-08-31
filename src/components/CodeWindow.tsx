import React, { useState, useEffect } from 'react';
import { X, Minimize2, Maximize2, Code, Play, Copy } from 'lucide-react';

interface CodeWindowProps {
  scene: any;
  onCodeChange: (code: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const CodeWindow: React.FC<CodeWindowProps> = ({ 
  scene, 
  onCodeChange, 
  isVisible, 
  onToggleVisibility 
}) => {
  const [code, setCode] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (scene) {
      // Generate JavaScript code representation of the scene
      const jsCode = generateJavaScriptCode(scene);
      setCode(formattedCode);
    }
  }, [scene]);

  const generateJavaScriptCode = (babylonScene: any) => {
    if (!babylonScene || !babylonScene.meshes) return '';
    
    const meshes = babylonScene.meshes.filter((mesh: any) => mesh.name !== 'ground');
    
    let code = `// 3D Scene Code - Generated from Babylon.js
import { Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';

export function createScene(engine) {
  const scene = new Scene(engine);
  
  // Camera setup
  const camera = new FreeCamera("camera", new Vector3(0, 5, -10), scene);
  camera.setTarget(Vector3.Zero());
  
  // Lighting
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.4;
  
  // Ground
  const ground = MeshBuilder.CreateGround("ground", { width: 30, height: 30 }, scene);
  
`;

    meshes.forEach((mesh: any, index: number) => {
      const meshType = mesh.name.split('_')[0];
      const varName = `${meshType}${index + 1}`;
      
      code += `  // ${mesh.name}\n`;
      
      switch (meshType) {
        case 'box':
          code += `  const ${varName} = MeshBuilder.CreateBox("${mesh.name}", { size: 2 }, scene);\n`;
          break;
        case 'sphere':
          code += `  const ${varName} = MeshBuilder.CreateSphere("${mesh.name}", { diameter: 2 }, scene);\n`;
          break;
        case 'cylinder':
          code += `  const ${varName} = MeshBuilder.CreateCylinder("${mesh.name}", { height: 3, diameter: 2 }, scene);\n`;
          break;
        case 'cone':
          code += `  const ${varName} = MeshBuilder.CreateCylinder("${mesh.name}", { height: 3, diameterTop: 0, diameterBottom: 2 }, scene);\n`;
          break;
        case 'plane':
          code += `  const ${varName} = MeshBuilder.CreatePlane("${mesh.name}", { size: 2 }, scene);\n`;
          break;
      }
      
      if (mesh.position) {
        code += `  ${varName}.position = new Vector3(${mesh.position.x.toFixed(2)}, ${mesh.position.y.toFixed(2)}, ${mesh.position.z.toFixed(2)});\n`;
      }
      
      if (mesh.rotation) {
        code += `  ${varName}.rotation = new Vector3(${mesh.rotation.x.toFixed(2)}, ${mesh.rotation.y.toFixed(2)}, ${mesh.rotation.z.toFixed(2)});\n`;
      }
      
      if (mesh.scaling) {
        code += `  ${varName}.scaling = new Vector3(${mesh.scaling.x.toFixed(2)}, ${mesh.scaling.y.toFixed(2)}, ${mesh.scaling.z.toFixed(2)});\n`;
      }
      
      if (mesh.material && mesh.material.diffuseColor) {
        const color = mesh.material.diffuseColor;
        code += `  const ${varName}Material = new StandardMaterial("${mesh.name}_material", scene);\n`;
        code += `  ${varName}Material.diffuseColor = new Color3(${color.r.toFixed(2)}, ${color.g.toFixed(2)}, ${color.b.toFixed(2)});\n`;
        code += `  ${varName}.material = ${varName}Material;\n`;
      }
      
      code += '\n';
    });
    
    code += `  return scene;
}`;
    
    return code;
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange(newCode);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 min-w-96"
      style={{ 
        left: position.x, 
        top: position.y,
        width: isMinimized ? '300px' : '500px',
        height: isMinimized ? '50px' : '400px'
      }}
    >
      {/* Header */}
      <div
        className="bg-slate-800 p-3 rounded-t-lg border-b border-slate-700 flex items-center justify-between cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">Scene Code</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleVisibility}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="p-4 h-full">
          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full h-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Scene data will appear here..."
            spellCheck={false}
          />
        </div>
      )}
    </div>
  );
};

export default CodeWindow;