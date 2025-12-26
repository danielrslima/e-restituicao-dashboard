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

  console.log('✅ Firebase conectado com sucesso!\n');
  
  const db = admin.firestore();
  
  // Dados de teste realistas
  const formulariosTeste = [
    {
      // Formulário 1: Pago, aguardando Kit IR
      nomeCompleto: 'Maria Silva Santos',
      cpf: '123.456.789-00',
      email: 'maria.silva@email.com',
      telefone: '(11) 98765-4321',
      dataNascimento: '15/03/1985',
      numeroProcesso: '0001234-56.2020.5.02.0001',
      vara: '1ª Vara do Trabalho',
      comarca: 'São Paulo - SP',
      fontePagadora: 'Empresa ABC Ltda',
      cnpj: '12.345.678/0001-90',
      brutoHomologado: 150000.00,
      tributavelHomologado: 120000.00,
      numeroMeses: 24,
      alvaras: [{ valor: 100000.00, data: '2023-01-15' }],
      darfs: [{ valor: 15000.00, data: '2023-02-01' }],
      honorarios: [{ valor: 30000.00, ano: '2023' }],
      proporcao: '80%',
      rendimentosTributavelAlvara: 80000.00,
      rendimentosTributavelHonorarios: 24000.00,
      baseCalculo: 104000.00,
      rra: '24',
      irMensal: '1250.00',
      irDevido: 15600.00,
      irpfRestituir: 74028.67,
      tipoAcesso: 'pago',
      statusPagamento: 'pago',
      dataPagamento: new Date('2024-12-20').toISOString(),
      statusKitIR: 'pendente',
      statusEmail: 'pendente',
      createdAt: new Date('2024-12-20').toISOString(),
    },
    {
      // Formulário 2: Pago, Kit IR pago, aguardando envio
      nomeCompleto: 'João Pedro Oliveira',
      cpf: '987.654.321-00',
      email: 'joao.oliveira@email.com',
      telefone: '(21) 99876-5432',
      dataNascimento: '22/07/1978',
      numeroProcesso: '0009876-54.2021.5.01.0003',
      vara: '3ª Vara do Trabalho',
      comarca: 'Rio de Janeiro - RJ',
      fontePagadora: 'Empresa XYZ S.A.',
      cnpj: '98.765.432/0001-10',
      brutoHomologado: 250000.00,
      tributavelHomologado: 200000.00,
      numeroMeses: 36,
      alvaras: [{ valor: 180000.00, data: '2023-06-10' }],
      darfs: [{ valor: 25000.00, data: '2023-07-05' }],
      honorarios: [{ valor: 50000.00, ano: '2023' }],
      proporcao: '75%',
      rendimentosTributavelAlvara: 135000.00,
      rendimentosTributavelHonorarios: 37500.00,
      baseCalculo: 172500.00,
      rra: '36',
      irMensal: '2100.00',
      irDevido: 28800.00,
      irpfRestituir: 219181.44,
      tipoAcesso: 'pago',
      statusPagamento: 'pago',
      dataPagamento: new Date('2024-12-15').toISOString(),
      statusKitIR: 'pago',
      dataPagamentoKit: new Date('2024-12-18').toISOString(),
      statusEnvioKit: 'agendado',
      dataEnvioKit: new Date('2024-12-25').toISOString(),
      statusEmail: 'agendado',
      dataAgendamentoEmail: new Date('2024-12-25').toISOString(),
      createdAt: new Date('2024-12-15').toISOString(),
    },
    {
      // Formulário 3: Free (interno)
      nomeCompleto: 'Ana Carolina Ferreira',
      cpf: '456.789.123-00',
      email: 'ana.ferreira@email.com',
      telefone: '(31) 97654-3210',
      dataNascimento: '10/11/1990',
      numeroProcesso: '0005555-66.2022.5.03.0005',
      vara: '5ª Vara do Trabalho',
      comarca: 'Belo Horizonte - MG',
      fontePagadora: 'Empresa DEF Comércio',
      cnpj: '45.678.912/0001-34',
      brutoHomologado: 80000.00,
      tributavelHomologado: 65000.00,
      numeroMeses: 12,
      alvaras: [{ valor: 60000.00, data: '2023-09-20' }],
      darfs: [{ valor: 8000.00, data: '2023-10-10' }],
      honorarios: [{ valor: 15000.00, ano: '2023' }],
      proporcao: '85%',
      rendimentosTributavelAlvara: 51000.00,
      rendimentosTributavelHonorarios: 12750.00,
      baseCalculo: 63750.00,
      rra: '12',
      irMensal: '850.00',
      irDevido: 7650.00,
      irpfRestituir: 35420.50,
      tipoAcesso: 'free',
      statusPagamento: 'pago',
      statusKitIR: 'nao_solicitado',
      statusEmail: 'pendente',
      createdAt: new Date('2024-12-22').toISOString(),
    },
    {
      // Formulário 4: Pendente de pagamento
      nomeCompleto: 'Carlos Eduardo Souza',
      cpf: '321.654.987-00',
      email: 'carlos.souza@email.com',
      telefone: '(85) 96543-2109',
      dataNascimento: '05/05/1982',
      numeroProcesso: '0007777-88.2023.5.07.0002',
      vara: '2ª Vara do Trabalho',
      comarca: 'Fortaleza - CE',
      fontePagadora: 'Empresa GHI Serviços',
      cnpj: '78.912.345/0001-67',
      brutoHomologado: 120000.00,
      tributavelHomologado: 95000.00,
      numeroMeses: 18,
      alvaras: [{ valor: 85000.00, data: '2023-11-15' }],
      darfs: [{ valor: 12000.00, data: '2023-12-01' }],
      honorarios: [{ valor: 22000.00, ano: '2023' }],
      proporcao: '78%',
      rendimentosTributavelAlvara: 66300.00,
      rendimentosTributavelHonorarios: 17160.00,
      baseCalculo: 83460.00,
      rra: '18',
      irMensal: '1150.00',
      irDevido: 12420.00,
      irpfRestituir: 58650.25,
      tipoAcesso: 'pago',
      statusPagamento: 'pendente',
      statusKitIR: 'nao_solicitado',
      statusEmail: 'pendente',
      createdAt: new Date('2024-12-24').toISOString(),
    },
    {
      // Formulário 5: Kit IR enviado
      nomeCompleto: 'Patricia Almeida Costa',
      cpf: '159.753.486-00',
      email: 'patricia.costa@email.com',
      telefone: '(41) 95432-1098',
      dataNascimento: '18/09/1987',
      numeroProcesso: '0003333-44.2020.5.09.0004',
      vara: '4ª Vara do Trabalho',
      comarca: 'Curitiba - PR',
      fontePagadora: 'Empresa JKL Indústria',
      cnpj: '15.975.348/0001-23',
      brutoHomologado: 180000.00,
      tributavelHomologado: 145000.00,
      numeroMeses: 30,
      alvaras: [{ valor: 130000.00, data: '2023-03-10' }],
      darfs: [{ valor: 18000.00, data: '2023-04-05' }],
      honorarios: [{ valor: 35000.00, ano: '2023' }],
      proporcao: '82%',
      rendimentosTributavelAlvara: 106600.00,
      rendimentosTributavelHonorarios: 28700.00,
      baseCalculo: 135300.00,
      rra: '30',
      irMensal: '1680.00',
      irDevido: 20160.00,
      irpfRestituir: 95840.75,
      tipoAcesso: 'pago',
      statusPagamento: 'pago',
      dataPagamento: new Date('2024-12-01').toISOString(),
      statusKitIR: 'enviado',
      dataPagamentoKit: new Date('2024-12-05').toISOString(),
      statusEnvioKit: 'enviado',
      dataEnvioKit: new Date('2024-12-12').toISOString(),
      statusEmail: 'enviado',
      dataAgendamentoEmail: new Date('2024-12-12').toISOString(),
      createdAt: new Date('2024-12-01').toISOString(),
    },
  ];

  console.log(`📝 Criando ${formulariosTeste.length} formulários de teste...\n`);

  for (const formulario of formulariosTeste) {
    const docRef = await db.collection('formularios').add(formulario);
    console.log(`✅ Formulário criado: ${formulario.nomeCompleto} (ID: ${docRef.id})`);
  }

  console.log(`\n🎉 Seed concluído com sucesso!`);
  console.log(`\n📊 Resumo:`);
  console.log(`   - 1 formulário pago aguardando Kit IR`);
  console.log(`   - 1 formulário com Kit IR pago aguardando envio`);
  console.log(`   - 1 formulário Free (interno)`);
  console.log(`   - 1 formulário pendente de pagamento`);
  console.log(`   - 1 formulário com Kit IR já enviado`);
  console.log(`\n💡 Os formulários devem aparecer no dashboard em alguns segundos!`);
  
  process.exit(0);
} catch (error) {
  console.error('❌ Erro ao executar seed:', error.message);
  process.exit(1);
}
