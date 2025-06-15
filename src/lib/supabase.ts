import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Profile = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  preferred_countries: string[];
  academic_interests: string[];
  budget: string;
  novita_api_key?: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  type: 'user' | 'bot';
  content: string;
  category?: string;
  created_at: string;
};

export type Roadmap = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  steps: RoadmapStep[];
  created_at: string;
  updated_at: string;
};

export type RoadmapStep = {
  id: string;
  roadmap_id: string;
  title: string;
  description: string;
  completed: boolean;
  order: number;
  created_at: string;
  updated_at: string;
};

// Database operations
export const db = {
  // Profile operations
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data as Profile;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  },

  // Chat operations
  async getChatHistory(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as ChatMessage[];
  },

  async saveChatMessage(message: Omit<ChatMessage, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(message)
      .select()
      .single();
    
    if (error) throw error;
    return data as ChatMessage;
  },

  // Roadmap operations
  async getRoadmaps(userId: string) {
    const { data, error } = await supabase
      .from('roadmaps')
      .select(`
        *,
        steps:roadmap_steps(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as (Roadmap & { steps: RoadmapStep[] })[];
  },

  async createRoadmap(roadmap: Omit<Roadmap, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('roadmaps')
      .insert(roadmap)
      .select()
      .single();
    
    if (error) throw error;
    return data as Roadmap;
  },

  async updateRoadmap(id: string, updates: Partial<Roadmap>) {
    const { data, error } = await supabase
      .from('roadmaps')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Roadmap;
  },

  async deleteRoadmap(id: string) {
    const { error } = await supabase
      .from('roadmaps')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async updateRoadmapStep(id: string, updates: Partial<RoadmapStep>) {
    const { data, error } = await supabase
      .from('roadmap_steps')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as RoadmapStep;
  }
}; 