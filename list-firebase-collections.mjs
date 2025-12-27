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

async function listCollections() {
  try {
    console.log('🔍 Listando coleções no Firestore...\n');
    
    const collections = await db.listCollections();
    
    console.log(`📦 Total de coleções: ${collections.length}\n`);
    
    for (const collection of collections) {
      console.log(`\n📁 Coleção: ${collection.id}`);
      
      // Pegar primeiro documento para ver estrutura
      const snapshot = await collection.limit(1).get();
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        console.log(`   ID do documento: ${doc.id}`);
        console.log(`   Campos:`, Object.keys(data).join(', '));
        console.log(`   Total de documentos: ${(await collection.count().get()).data().count}`);
      } else {
        console.log(`   (vazia)`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

listCollections();
