import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';

@Component({
  selector: 'app-character-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './character-form.component.html',
  styleUrl: './character-form.component.scss'
})
export class CharacterFormComponent {
  @Input() storyId: string | null = null;
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private firebaseService = inject(FirebaseService);

  charForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    isNarrator: [false],
    color: ['#007bff']
  });

  isSubmitting = false;

  async onSubmit() {
    if (this.charForm.valid && this.storyId) {
      this.isSubmitting = true;
      try {
        await this.firebaseService.addCharacter({
          storyId: this.storyId,
          ...this.charForm.value
        });
        this.charForm.reset({ color: '#007bff', isNarrator: false });
        this.saved.emit();
      } catch (error) {
        console.error('Error adding character:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
