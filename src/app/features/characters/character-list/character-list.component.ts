import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../../core/services/firebase.service';
import { Character } from '../../../core/models/story.model';
import { Observable } from 'rxjs';
import { CharacterFormComponent } from '../character-form/character-form.component';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, CharacterFormComponent],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss'
})
export class CharacterListComponent implements OnInit {
  @Input() storyId: string | null = null;
  
  private firebaseService = inject(FirebaseService);
  characters$: Observable<Character[]> | undefined;
  
  showForm = false;

  ngOnInit() {
    if (this.storyId) {
      this.characters$ = this.firebaseService.getCharacters(this.storyId);
    }
  }

  onCharacterAdded() {
    this.showForm = false;
  }
}
