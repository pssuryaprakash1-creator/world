import { useState, useCallback } from 'react';
import { Scene, Vector3, AbstractMesh, MeshBuilder, StandardMaterial, Color3, DirectionalLight, PointLight, Animation, SceneSerializer } from '@babylonjs/core';

interface Asset {
  id: string;
  name: string;
  type: 'mesh' | 'material' | 'light' | 'animation';
  data?: any;
}

export const useSceneOperations = (scene: Scene | null) => {
  const [selectedMesh, setSelectedMesh] = useState<AbstractMesh | null>(null);
  const [meshCounter, setMeshCounter] = useState(0);
  const [sceneData, setSceneData] = useState<any>(null);

  // Update scene data whenever scene changes
  const updateSceneData = useCallback(() => {
    if (!scene) return;
    
    try {
      const serialized = SceneSerializer.Serialize(scene);
      const filteredData = {
        ...serialized,
        meshes: serialized.meshes?.filter(mesh => mesh.name !== 'ground') || []
      };
      setSceneData(filteredData);
    } catch (error) {
      console.error('Error serializing scene:', error);
    }
  }, [scene]);

  const createMesh = useCallback((assetId: string, position: Vector3) => {
    if (!scene) return null;

    let mesh: AbstractMesh;
    const name = `${assetId}_${meshCounter}`;

    switch (assetId) {
      case 'box':
        mesh = MeshBuilder.CreateBox(name, { size: 2 }, scene);
        break;
      case 'sphere':
        mesh = MeshBuilder.CreateSphere(name, { diameter: 2 }, scene);
        break;
      case 'cylinder':
        mesh = MeshBuilder.CreateCylinder(name, { height: 3, diameter: 2 }, scene);
        break;
      case 'cone':
        mesh = MeshBuilder.CreateCylinder(name, { height: 3, diameterTop: 0, diameterBottom: 2 }, scene);
        break;
      case 'plane':
        mesh = MeshBuilder.CreatePlane(name, { size: 2 }, scene);
        break;
      default:
        return null;
    }

    mesh.position = position;
    
    // Add default material
    const material = new StandardMaterial(`${name}_material`, scene);
    material.diffuseColor = new Color3(0.6, 0.8, 1.0);
    mesh.material = material;

    setMeshCounter(prev => prev + 1);
    
    // Update scene data after creating mesh
    setTimeout(updateSceneData, 100);
    
    return mesh;
  }, [scene, meshCounter, updateSceneData]);

  const applyMaterial = useCallback((mesh: AbstractMesh, asset: Asset) => {
    if (!scene || !asset.data?.color) return;

    const material = new StandardMaterial(`${mesh.name}_material`, scene);
    const color = Color3.FromHexString(asset.data.color);
    material.diffuseColor = color;
    mesh.material = material;
    
    // Update scene data after applying material
    setTimeout(updateSceneData, 100);
  }, [scene, updateSceneData]);

  const createLight = useCallback((assetId: string, position: Vector3) => {
    if (!scene) return null;

    const name = `${assetId}_${meshCounter}`;

    switch (assetId) {
      case 'directional-light':
        const dirLight = new DirectionalLight(name, new Vector3(-1, -1, -1), scene);
        dirLight.intensity = 0.5;
        return dirLight;
      case 'point-light':
        const pointLight = new PointLight(name, position, scene);
        pointLight.intensity = 0.8;
        return pointLight;
      default:
        return null;
    }
  }, [scene, meshCounter]);

  const applyAnimation = useCallback((mesh: AbstractMesh, animationType: string) => {
    if (!scene) return;

    const animationName = `${mesh.name}_${animationType}`;
    
    switch (animationType) {
      case 'rotate-animation':
        const rotateAnimation = Animation.CreateAndStartAnimation(
          animationName,
          mesh,
          'rotation.y',
          30,
          120,
          0,
          Math.PI * 2,
          Animation.ANIMATIONLOOPMODE_CYCLE
        );
        break;
      case 'scale-animation':
        const scaleAnimation = Animation.CreateAndStartAnimation(
          animationName,
          mesh,
          'scaling',
          30,
          60,
          new Vector3(1, 1, 1),
          new Vector3(1.5, 1.5, 1.5),
          Animation.ANIMATIONLOOPMODE_YOYO
        );
        break;
    }
    
    // Update scene data after applying animation
    setTimeout(updateSceneData, 100);
  }, [scene, updateSceneData]);

  const deleteMesh = useCallback(() => {
    if (selectedMesh && selectedMesh.name !== 'ground') {
      selectedMesh.dispose();
      setSelectedMesh(null);
      
      // Update scene data after deleting mesh
      setTimeout(updateSceneData, 100);
    }
  }, [selectedMesh, updateSceneData]);

  const resetScene = useCallback(() => {
    if (!scene) return;
    
    scene.meshes.forEach(mesh => {
      if (mesh.name !== 'ground') {
        mesh.dispose();
      }
    });
    
    setSelectedMesh(null);
    setMeshCounter(0);
    
    // Update scene data after reset
    setTimeout(updateSceneData, 100);
  }, [scene, updateSceneData]);

  const applyCodeChanges = useCallback((codeString: string) => {
    try {
      const newSceneData = JSON.parse(codeString);
      // This would require more complex scene reconstruction
      // For now, we'll just update the internal data
      setSceneData(newSceneData);
    } catch (error) {
      console.error('Invalid JSON in code window:', error);
    }
  }, []);

  return {
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
  };
};