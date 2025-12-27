import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

let firebaseApp: admin.app.App | null = null;

/**
 * Inicializa a conexão com o Firebase Admin SDK
 */
export function initializeFirebase() {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    const serviceAccount = JSON.parse(
      readFileSync(join(process.cwd(), 'firebase-credentials.json'), 'utf8')
    );

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });

    console.log('[Firebase] Initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('[Firebase] Failed to initialize:', error);
    return null;
  }
}

/**
 * Retorna a instância do Firestore
 */
export function getFirestore() {
  const app = initializeFirebase();
  if (!app) {
    throw new Error('Firebase not initialized');
  }
  return admin.firestore();
}

/**
 * Sincroniza dados do Firestore para o banco de dados local
 */
export async function syncFormularioFromFirestore(formularioId: string) {
  try {
    const db = getFirestore();
    const doc = await db.collection('formularios-irpf').doc(formularioId).get();

    if (!doc.exists) {
      console.warn(`[Firebase] Formulário ${formularioId} não encontrado`);
      return null;
    }

    const data = doc.data();
    console.log(`[Firebase] Formulário ${formularioId} sincronizado`);
    return data;
  } catch (error) {
    console.error(`[Firebase] Erro ao sincronizar formulário ${formularioId}:`, error);
    return null;
  }
}

/**
 * Listener de mudanças em tempo real no Firestore
 */
export function listenToFormulariosChanges(
  callback: (formularioId: string, data: any) => void
) {
  try {
    const db = getFirestore();
    
    const unsubscribe = db.collection('formularios-irpf').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const formularioId = change.doc.id;
          const data = change.doc.data();
          callback(formularioId, data);
        }
      });
    });

    console.log('[Firebase] Listener de mudanças ativado');
    return unsubscribe;
  } catch (error) {
    console.error('[Firebase] Erro ao ativar listener:', error);
    return () => {};
  }
}
