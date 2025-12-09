import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FirebaseService } from '../../core/services/firebase.service';
import { Story, Character, DialogueLine } from '../../core/models/story.model';
import { Observable, switchMap, tap, map, catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CharacterListComponent } from '../characters/character-list/character-list.component';
import { PdfExporterService } from '../../shared/pdf-exporter.service';

@Component({
  selector: 'app-writer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CharacterListComponent],
  templateUrl: './writer.component.html',
  styleUrl: './writer.component.scss'
})
export class WriterComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private firebaseService = inject(FirebaseService);
  private pdfService = inject(PdfExporterService);

  storyId: string | null = null;
  story$: Observable<Story[]> | undefined; // Actually we need single story, but service returns array for now. We can filter or add getStory method.
  // For now, let's just use the list and find it, or better add getStory to service.

  characters$: Observable<Character[]> | undefined;
  dialogues$: Observable<DialogueLine[]> | undefined;

  newMessage = '';
  selectedCharacterId: string | null = null;

  ngOnInit() {
    this.storyId = this.route.snapshot.paramMap.get('id');
    if (this.storyId) {
      this.characters$ = this.firebaseService.getCharacters(this.storyId);
      this.dialogues$ = this.firebaseService.getDialogues(this.storyId).pipe(
        tap(data => console.log('Dialogues loaded:', data)),
        map(dialogues => dialogues.sort((a, b) => a.order - b.order)),
        catchError(error => {
          console.error('Error loading dialogues:', error);
          return of([]);
        })
      );
    }
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedCharacterId || !this.storyId) return;

    const dialogue: DialogueLine = {
      storyId: this.storyId,
      characterId: this.selectedCharacterId,
      text: this.newMessage,
      timestamp: new Date(), // Should use serverTimestamp in real app
      order: Date.now() // Simple ordering
    };

    this.firebaseService.addDialogue(dialogue).then(() => {
      this.newMessage = '';
    });
  }

  // Helper to get character details from ID (for the view)
  getCharacter(id: string, characters: Character[]): Character | undefined {
    return characters.find(c => c.id === id);
  }

  exportPdf() {
    // We might want to pass the story title here, but for now just 'Story'
    this.pdfService.exportToPdf('chat-container', 'Story');
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      // Could use a toast/snackbar here, using alert for simplicity
      alert('Enlace copiado al portapapeles. ¡Compártelo para colaborar!');
    });
  }
}
