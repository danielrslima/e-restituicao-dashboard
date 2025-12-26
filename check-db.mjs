import { drizzle } from "drizzle-orm/mysql2";
import { irpfForms } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

try {
  const forms = await db.select().from(irpfForms);
  console.log(`\n📊 Total de formulários no banco local: ${forms.length}\n`);
  
  if (forms.length === 0) {
    console.log('⚠️  Nenhum formulário encontrado no banco local.');
  } else {
    forms.forEach((form) => {
      console.log(`📄 ID: ${form.id}`);
      console.log(`   Nome: ${form.nomeCliente}`);
      console.log(`   CPF: ${form.cpf}`);
      console.log(`   Processo: ${form.numeroProcesso}`);
      console.log(`   Restituição: R$ ${form.irpfRestituir}`);
      console.log(`   Status: ${form.statusPagamento}`);
      console.log(`   Tipo: ${form.tipoAcesso}`);
      console.log(`   Firebase ID: ${form.firebaseDocId || 'N/A'}\n`);
    });
  }
  
  process.exit(0);
} catch (error) {
  console.error('❌ Erro:', error.message);
  process.exit(1);
}
