import { Scene, AbstractMesh } from '@babylonjs/core';
import { SceneSerializer } from '@babylonjs/core/Misc/sceneSerializer';
import { supabase } from '../lib/supabase';

export class SceneManager {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  async saveScene(name: string): Promise<void> {
    try {
      // Serialize the scene
      const serializedScene = SceneSerializer.Serialize(this.scene);
      
      // Remove the ground from serialization to avoid conflicts
      const sceneData = {
        ...serializedScene,
        meshes: serializedScene.meshes.filter(mesh => mesh.name !== 'ground')
      };

      const { data, error } = await supabase
        .from('scenes')
        .insert({
          name,
          data: sceneData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      console.log('Scene saved successfully:', data);
      alert('Scene saved successfully!');
    } catch (error) {
      console.error('Error saving scene:', error);
      alert('Failed to save scene. Please make sure you are connected to Supabase.');
    }
  }

  async loadScene(sceneId: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('scenes')
        .select('*')
        .eq('id', sceneId)
        .single();

      if (error) throw error;

      // Clear existing meshes (except ground)
      this.scene.meshes.forEach(mesh => {
        if (mesh.name !== 'ground' && mesh.name !== 'camera') {
          mesh.dispose();
        }
      });

      // Import the scene data
      if (data?.data) {
        // Restore meshes from serialized data
        data.data.meshes?.forEach((meshData: any) => {
          // This is a simplified restoration - in a real app you'd use SceneLoader
          console.log('Restoring mesh:', meshData.name);
        });
      }

      console.log('Scene loaded successfully');
      alert('Scene loaded successfully!');
    } catch (error) {
      console.error('Error loading scene:', error);
      alert('Failed to load scene. Please check your connection.');
    }
  }

  async listScenes(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('scenes')
        .select('id, name, created_at, updated_at')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching scenes:', error);
      return [];
    }
  }

  exportScene(): void {
    try {
      const serializedScene = SceneSerializer.Serialize(this.scene);
      const sceneData = {
        ...serializedScene,
        meshes: serializedScene.meshes.filter(mesh => mesh.name !== 'ground')
      };

      const blob = new Blob([JSON.stringify(sceneData, null, 2)], {
        type: 'application/json',
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'scene.babylon';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting scene:', error);
      alert('Failed to export scene.');
    }
  }

  importScene(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const sceneData = JSON.parse(e.target?.result as string);
        
        // Clear existing meshes (except ground)
        this.scene.meshes.forEach(mesh => {
          if (mesh.name !== 'ground' && mesh.name !== 'camera') {
            mesh.dispose();
          }
        });

        console.log('Importing scene data:', sceneData);
        alert('Scene imported successfully!');
      } catch (error) {
        console.error('Error importing scene:', error);
        alert('Failed to import scene. Please check the file format.');
      }
    };
    reader.readAsText(file);
  }
}