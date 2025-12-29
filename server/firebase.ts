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
    const doc = await db.collection('formularios').doc(formularioId).get();

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
    
    const unsubscribe = db.collection('formularios').onSnapshot((snapshot) => {
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

/**
 * Faz upload de um PDF para o Firebase Storage
 * @param pdfBuffer - Buffer do PDF
 * @param fileName - Nome do arquivo (ex: "planilha_123.pdf")
 * @returns URL pública do arquivo
 */
export async function uploadPDFToStorage(pdfBuffer: Buffer, fileName: string): Promise<string> {
  try {
    const app = initializeFirebase();
    if (!app) {
      throw new Error('Firebase not initialized');
    }

    const bucket = admin.storage().bucket('erestituicao-ffa5c.firebasestorage.app');
    const file = bucket.file(`pdfs/${fileName}`);

    await file.save(pdfBuffer, {
      metadata: {
        contentType: 'application/pdf',
      },
      public: true,
    });

    // Gerar URL pública
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/pdfs/${fileName}`;
    
    console.log(`[Firebase Storage] PDF uploaded: ${fileName}`);
    return publicUrl;
  } catch (error) {
    console.error(`[Firebase Storage] Erro ao fazer upload do PDF ${fileName}:`, error);
    throw error;
  }
}
