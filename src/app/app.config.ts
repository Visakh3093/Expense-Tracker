import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { environment } from '../environments/environment.development';
import { initializeApp,provideFirebaseApp} from '@angular/fire/app'
import { getAuth, provideAuth } from '@angular/fire/auth'
import { getFirestore, provideFirestore } from '@angular/fire/firestore'
import { getStorage, provideStorage } from '@angular/fire/storage'
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideState, provideStore } from '@ngrx/store';
import { labelReducer } from './common/chartData/chart.reducer';



export const appConfig: ApplicationConfig = {
  providers: [ provideState({name:'labelReducer',reducer:labelReducer}),provideStore(),provideCharts(withDefaultRegisterables()),provideRouter(routes), provideClientHydration(),importProvidersFrom([
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ])]
};
