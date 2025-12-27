import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync('./firebase-credentials.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function findSidinei() {
  console.log('\n=== BUSCANDO SIDINEI ALVES DE OLIVEIRA ===\n');
  
  // Buscar em formularios
  console.log('📁 Buscando em "formularios"...');
  const formulariosSnapshot = await db.collection('formularios')
    .where('nomeCompleto', '>=', 'SIDINEI')
    .where('nomeCompleto', '<=', 'SIDINEI\uf8ff')
    .get();
  
  if (!formulariosSnapshot.empty) {
    formulariosSnapshot.forEach(doc => {
      console.log(`✅ ENCONTRADO em formularios!`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Nome: ${doc.data().nomeCompleto}`);
      console.log(`   CPF: ${doc.data().cpf}`);
      console.log(`   Email: ${doc.data().email}`);
      console.log(`   IRPF: R$ ${doc.data().irpfRestituir}`);
      console.log('');
    });
  } else {
    console.log('❌ Não encontrado em formularios\n');
  }
  
  // Buscar em users
  console.log('📁 Buscando em "users"...');
  const usersSnapshot = await db.collection('users').get();
  
  usersSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.dadosPessoais?.nomeCompleto?.includes('SIDINEI')) {
      console.log(`✅ ENCONTRADO em users!`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Nome: ${data.dadosPessoais.nomeCompleto}`);
      console.log(`   CPF: ${data.dadosPessoais.cpf}`);
      console.log(`   Email: ${data.dadosPessoais.email}`);
      console.log(`   Total Restituir: R$ ${data.calculos?.totalRestituir}`);
      console.log('');
    }
  });
}

findSidinei().then(() => process.exit(0));
