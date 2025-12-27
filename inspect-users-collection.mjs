import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Inicializar Firebase
const serviceAccount = JSON.parse(
  readFileSync('./firebase-credentials.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function inspectUsers() {
  try {
    console.log('🔍 Analisando coleção "users"...\n');
    
    const snapshot = await db.collection('users').get();
    
    console.log(`📦 Total de documentos: ${snapshot.size}\n`);
    
    snapshot.forEach(doc => {
      console.log(`\n📄 Documento ID: ${doc.id}`);
      console.log(`📋 Dados completos:\n`);
      console.log(JSON.stringify(doc.data(), null, 2));
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

inspectUsers();
