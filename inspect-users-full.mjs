import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync('./firebase-credentials.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function inspectUsers() {
  console.log('\n=== ESTRUTURA COMPLETA DA COLEÇÃO USERS ===\n');
  
  const snapshot = await db.collection('users').limit(1).get();
  
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    console.log(`ID: ${doc.id}\n`);
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log('Nenhum documento encontrado');
  }
}

inspectUsers().then(() => process.exit(0));
