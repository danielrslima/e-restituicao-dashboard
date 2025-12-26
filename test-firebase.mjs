import admin from 'firebase-admin';
import { readFileSync } from 'fs';

try {
  const serviceAccount = JSON.parse(
    readFileSync('./firebase-credentials.json', 'utf8')
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });

  console.log('✅ Firebase conectado com sucesso!');
  
  const db = admin.firestore();
  const snapshot = await db.collection('formularios').get();
  
  console.log(`\n📊 Total de formulários no Firebase: ${snapshot.size}\n`);
  
  if (snapshot.empty) {
    console.log('⚠️  Nenhum formulário encontrado no Firebase Firestore.');
  } else {
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`\n📄 ID: ${doc.id}`);
      console.log(`   Nome: ${data.nomeCompleto || 'N/A'}`);
      console.log(`   CPF: ${data.cpf || 'N/A'}`);
      console.log(`   Email: ${data.email || 'N/A'}`);
      console.log(`   Processo: ${data.numeroProcesso || 'N/A'}`);
      console.log(`   Restituição: R$ ${data.irpfRestituir || 0}`);
      console.log(`   Status Pagamento: ${data.statusPagamento || 'pendente'}`);
      console.log(`   Tipo Acesso: ${data.tipoAcesso || 'pago'}`);
    });
  }
  
  process.exit(0);
} catch (error) {
  console.error('❌ Erro ao conectar ao Firebase:', error.message);
  process.exit(1);
}
