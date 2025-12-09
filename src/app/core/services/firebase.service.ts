import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Story, Character, DialogueLine } from '../models/story.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firestore: Firestore = inject(Firestore);

  // Story Methods
  getStories(): Observable<Story[]> {
    const storiesRef = collection(this.firestore, 'stories');
    return collectionData(storiesRef, { idField: 'id' }) as Observable<Story[]>;
  }

  addStory(story: Story) {
    const storiesRef = collection(this.firestore, 'stories');
    return addDoc(storiesRef, story);
  }

  // Character Methods
  getCharacters(storyId: string): Observable<Character[]> {
    const charsRef = collection(this.firestore, 'characters');
    const q = query(charsRef, where('storyId', '==', storyId));
    return collectionData(q, { idField: 'id' }) as Observable<Character[]>;
  }

  addCharacter(character: Character) {
    const charsRef = collection(this.firestore, 'characters');
    return addDoc(charsRef, character);
  }

  // Dialogue Methods
  getDialogues(storyId: string): Observable<DialogueLine[]> {
    const dialoguesRef = collection(this.firestore, 'dialogues');
    const q = query(dialoguesRef, where('storyId', '==', storyId));
    return collectionData(q, { idField: 'id' }) as Observable<DialogueLine[]>;
  }

  addDialogue(dialogue: DialogueLine) {
    const dialoguesRef = collection(this.firestore, 'dialogues');
    return addDoc(dialoguesRef, dialogue);
  }
}
