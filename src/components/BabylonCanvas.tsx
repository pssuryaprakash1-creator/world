import React, { useEffect, useRef } from 'react';
import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, PickingInfo, AbstractMesh, DirectionalLight } from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';

interface BabylonCanvasProps {
  onSceneReady?: (scene: Scene) => void;
  onMeshClick?: (mesh: AbstractMesh) => void;
  selectedMesh?: AbstractMesh | null;
}

const BabylonCanvas: React.FC<BabylonCanvasProps> = ({ onSceneReady, onMeshClick, selectedMesh }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    sceneRef.current = scene;

    // Camera
    const camera = new FreeCamera("camera", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);
    
    // Enable camera controls
    camera.inputs.addMouseWheel();

    // Ambient light
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.4;
    
    // Directional light for better shadows
    const dirLight = new DirectionalLight("dirLight", new Vector3(-1, -1, -1), scene);
    dirLight.intensity = 0.6;

    // Ground with grid
    const ground = MeshBuilder.CreateGround("ground", { width: 30, height: 30 }, scene);
    const groundMaterial = new GridMaterial("groundMaterial", scene);
    groundMaterial.majorUnitFrequency = 5;
    groundMaterial.minorUnitVisibility = 0.45;
    groundMaterial.gridRatio = 1;
    groundMaterial.backFaceCulling = false;
    groundMaterial.mainColor = new Color3(0.2, 0.2, 0.2);
    groundMaterial.lineColor = new Color3(0.4, 0.4, 0.4);
    groundMaterial.opacity = 0.8;
    ground.material = groundMaterial;
    ground.receiveShadows = true;

    // Enhanced click handling with highlighting
    scene.onPointerPick = (evt, pickingInfo: PickingInfo) => {
      if (pickingInfo.hit && pickingInfo.pickedMesh && pickingInfo.pickedMesh !== ground) {
        // Remove previous selection highlight
        scene.meshes.forEach(mesh => {
          if (mesh.name !== 'ground' && mesh.material) {
            const material = mesh.material as StandardMaterial;
            if (material.emissiveColor) {
              material.emissiveColor = new Color3(0, 0, 0);
            }
          }
        });
        
        // Add selection highlight
        const mesh = pickingInfo.pickedMesh;
        if (mesh.material) {
          const material = mesh.material as StandardMaterial;
          material.emissiveColor = new Color3(0.2, 0.4, 0.8);
        }
        
        onMeshClick?.(pickingInfo.pickedMesh);
      } else if (pickingInfo.hit && pickingInfo.pickedMesh === ground) {
        // Clicked on ground, deselect
        scene.meshes.forEach(mesh => {
          if (mesh.name !== 'ground' && mesh.material) {
            const material = mesh.material as StandardMaterial;
            if (material.emissiveColor) {
              material.emissiveColor = new Color3(0, 0, 0);
            }
          }
        });
        onMeshClick?.(null as any);
      }
    };

    // Render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Handle resize
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);

    // Call scene ready callback
    onSceneReady?.(scene);

    return () => {
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, [onSceneReady, onMeshClick]);

  // Update selection highlight when selectedMesh changes
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.meshes.forEach(mesh => {
        if (mesh.name !== 'ground' && mesh.material) {
          const material = mesh.material as StandardMaterial;
          if (material.emissiveColor) {
            if (mesh === selectedMesh) {
              material.emissiveColor = new Color3(0.2, 0.4, 0.8);
            } else {
              material.emissiveColor = new Color3(0, 0, 0);
            }
          }
        }
      });
    }
  }, [selectedMesh]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full outline-none"
      style={{ display: 'block' }}
    />
  );
};

export default BabylonCanvas;