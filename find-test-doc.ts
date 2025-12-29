import { getFirestore } from './server/firebase';

async function findTestDoc() {
  try {
    const db = getFirestore();
    
    // Buscar por nome "TESTE MANUS"
    const snapshot = await db.collection('formularios')
      .where('nomeCompleto', '>=', 'TESTE MANUS')
      .where('nomeCompleto', '<=', 'TESTE MANUS\uf8ff')
      .get();
    
    console.log(`Documentos encontrados: ${snapshot.size}`);
    
    snapshot.forEach(doc => {
      console.log(`\nID: ${doc.id}`);
      console.log('Dados:', JSON.stringify(doc.data(), null, 2));
    });
    
    // Buscar todos os documentos para ver quantos existem
    const allDocs = await db.collection('formularios').get();
    console.log(`\nTotal de documentos na coleção: ${allDocs.size}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

findTestDoc();
