import { Routes } from '@angular/router';
import { SetupComponent } from './features/setup/setup.component';
import { WriterComponent } from './features/writer/writer.component';

export const routes: Routes = [
    { path: '', component: SetupComponent },
    { path: 'writer/:id', component: WriterComponent },
    { path: '**', redirectTo: '' }
];
