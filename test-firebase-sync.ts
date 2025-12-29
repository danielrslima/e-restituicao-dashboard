import { getFirestore } from './server/firebase';
import { syncFormularioFromFirebase } from './server/db';

async function testSync() {
  try {
    console.log('=== TESTE DE SINCRONIZAÇÃO FIREBASE ===\n');
    
    const db = getFirestore();
    const snapshot = await db.collection('formularios').limit(3).get();
    
    console.log(`Total de documentos encontrados: ${snapshot.size}\n`);
    
    for (const doc of snapshot.docs) {
      console.log(`\n--- Sincronizando documento: ${doc.id} ---`);
      const data = doc.data();
      console.log('Dados do Firebase:', JSON.stringify(data, null, 2));
      
      await syncFormularioFromFirebase({ ...data, id: doc.id });
      
      console.log(`✓ Documento ${doc.id} sincronizado\n`);
    }
    
    console.log('\n=== TESTE CONCLUÍDO ===');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    console.error('Stack:', (error as Error).stack);
    process.exit(1);
  }
}

testSync();
