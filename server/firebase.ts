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
    
    // Listener para coleção 'formularios' (formulários de teste)
    const unsubscribe1 = db.collection('formularios').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const formularioId = change.doc.id;
          const data = change.doc.data();
          callback(formularioId, data);
        }
      });
    });

    console.log('[Firebase] Listener de mudanças ativado para coleção formularios');
    
    // Listener para coleção 'users' (formulários do site)
    const unsubscribe2 = db.collection('users').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const formularioId = change.doc.id;
          const rawData = change.doc.data();
          
          // Mapear estrutura aninhada para estrutura plana
          const mappedData = {
            nomeCompleto: rawData.dadosPessoais?.nomeCompleto,
            email: rawData.dadosPessoais?.email,
            telefone: rawData.dadosPessoais?.telefone,
            cpf: rawData.dadosPessoais?.cpf,
            dataNascimento: rawData.dadosPessoais?.dataNascimento,
            numeroProcesso: rawData.dadosProcesso?.numeroProcesso,
            comarca: rawData.dadosProcesso?.comarca,
            vara: rawData.dadosProcesso?.vara,
            fontePagadora: rawData.dadosProcesso?.fontePagadora,
            irpfRestituir: rawData.calculos?.totalRestituir,
            statusPagamento: rawData.pagamentoStarter?.status === 'CONFIRMED' ? 'pago' : 'pendente',
            dataPagamento: rawData.pagamentoStarter?.dataConfirmacao,
            tipoAcesso: 'Free',
            createdAt: rawData.metadata?.criadoEm,
          };
          
          callback(formularioId, mappedData);
        }
      });
    });
    
    console.log('[Firebase] Listener de mudanças ativado para coleção users');
    
    // Retornar função para cancelar ambos os listeners
    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  } catch (error) {
    console.error('[Firebase] Erro ao ativar listener:', error);
    return () => {};
  }
}
