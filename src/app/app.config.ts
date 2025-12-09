import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Importaciones de Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // 1. Inicialización de la App (Usamos 'as any' para evitar el error de projectNumber)
    provideFirebaseApp(() => initializeApp({ projectId: "gc-writer", appId: "1:901890266260:web:927a565a3ea9fba86bd081", storageBucket: "gc-writer.firebasestorage.app", apiKey: "AIzaSyCBKW2fhzcOrTrHTjXNo6h8i39xMBKCPtQ", authDomain: "gc-writer.firebaseapp.com", messagingSenderId: "901890266260", measurementId: "G-NM8TCWY5MZ" })), provideFirestore(() => getFirestore())
  ]
};

// provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "gc-writer", appId: "1:901890266260:web:927a565a3ea9fba86bd081", storageBucket: "gc-writer.firebasestorage.app", apiKey: "AIzaSyCBKW2fhzcOrTrHTjXNo6h8i39xMBKCPtQ", authDomain: "gc-writer.firebaseapp.com", messagingSenderId: "901890266260", measurementId: "G-NM8TCWY5MZ", projectNumber: "901890266260", version: "2" })), provideFirestore(() => getFirestore())