export interface Story {
  id?: string;
  title: string;
  summary: string;
  createdAt: any; // Firestore Timestamp
}

export interface Character {
  id?: string;
  storyId: string;
  name: string;
  description?: string;
  avatarUrl?: string; // URL or base64
  isNarrator: boolean;
  color?: string; // For UI distinction
}

export interface DialogueLine {
  id?: string;
  storyId: string;
  characterId: string;
  text: string;
  timestamp: any;
  order: number;
}
