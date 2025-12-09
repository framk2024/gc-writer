import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FirebaseService } from '../../core/services/firebase.service';
import { serverTimestamp } from '@angular/fire/firestore';
import { Story } from '../../core/models/story.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss'
})
export class SetupComponent {
  private fb = inject(FormBuilder);
  private firebaseService = inject(FirebaseService);
  private router = inject(Router);

  stories$: Observable<Story[]> = this.firebaseService.getStories();

  setupForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    summary: ['', [Validators.required, Validators.minLength(10)]]
  });

  isSubmitting = false;

  async onSubmit() {
    if (this.setupForm.valid) {
      this.isSubmitting = true;
      try {
        const storyData = {
          ...this.setupForm.value,
          createdAt: serverTimestamp()
        };
        const docRef = await this.firebaseService.addStory(storyData);
        this.router.navigate(['/writer', docRef.id]);
      } catch (error) {
        console.error('Error creating story:', error);
        this.isSubmitting = false;
      }
    }
  }
}
