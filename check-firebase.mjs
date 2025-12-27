import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync('./firebase-credentials.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkCollections() {
  const collections = await db.listCollections();
  
  console.log('\n=== COLEÇÕES FIREBASE ===\n');
  
  for (const collection of collections) {
    console.log(`📁 Coleção: ${collection.id}`);
    const snapshot = await collection.limit(1).get();
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      console.log(`   ID exemplo: ${doc.id}`);
      console.log(`   Campos: ${Object.keys(data).join(', ')}`);
      console.log('');
    }
  }
}

checkCollections().then(() => process.exit(0));
