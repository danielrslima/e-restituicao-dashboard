import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync('./firebase-credentials.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function findByCPF() {
  const cpf = '013.646.548-06';
  console.log(`\n=== BUSCANDO CPF: ${cpf} ===\n`);
  
  // Buscar em formularios
  console.log('📁 Buscando em "formularios"...');
  const formulariosSnapshot = await db.collection('formularios')
    .where('cpf', '==', cpf)
    .get();
  
  if (!formulariosSnapshot.empty) {
    formulariosSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`✅ ENCONTRADO em formularios!`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Nome: ${data.nomeCompleto}`);
      console.log(`   CPF: ${data.cpf}`);
      console.log(`   Email: ${data.email}`);
      console.log(`   Processo: ${data.numeroProcesso}`);
      console.log(`   IRPF: R$ ${data.irpfRestituir}`);
      console.log(`   Status: ${data.statusPagamento}`);
      console.log('');
    });
  } else {
    console.log('❌ Não encontrado em formularios\n');
  }
  
  // Buscar em users
  console.log('📁 Buscando em "users"...');
  const usersSnapshot = await db.collection('users').get();
  
  let found = false;
  usersSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.dadosPessoais?.cpf === cpf) {
      found = true;
      console.log(`✅ ENCONTRADO em users!`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Nome: ${data.dadosPessoais.nomeCompleto}`);
      console.log(`   CPF: ${data.dadosPessoais.cpf}`);
      console.log(`   Email: ${data.dadosPessoais.email}`);
      console.log(`   Processo: ${data.dadosProcesso?.numeroProcesso}`);
      console.log(`   Total Restituir: R$ ${data.calculos?.totalRestituir}`);
      console.log(`   Pagamento Starter: ${JSON.stringify(data.pagamentoStarter, null, 2)}`);
      console.log('');
    }
  });
  
  if (!found) {
    console.log('❌ Não encontrado em users\n');
  }
}

findByCPF().then(() => process.exit(0));
