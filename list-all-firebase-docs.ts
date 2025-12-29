import { getFirestore } from './server/firebase';

async function listAllDocs() {
  try {
    const db = getFirestore();
    
    const snapshot = await db.collection('formularios').get();
    
    console.log(`\n📊 Total de documentos na coleção 'formularios': ${snapshot.size}\n`);
    
    snapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. ID: ${doc.id}`);
      console.log(`   Nome: ${data.nomeCompleto || 'N/A'}`);
      console.log(`   CPF: ${data.cpf || 'N/A'}`);
      console.log(`   Criado em: ${data.createdAt || 'N/A'}`);
      console.log(`   Status: ${data.statusPagamento || 'N/A'}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

listAllDocs();
