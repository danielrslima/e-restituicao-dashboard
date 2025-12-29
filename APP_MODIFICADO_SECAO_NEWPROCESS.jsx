// ============================================================================
// SEÇÃO MODIFICADA: const newProcess (linha 5973 do App.jsx original)
// ============================================================================
// 
// INSTRUÇÕES:
// 1. Abra o arquivo App.jsx do site
// 2. Localize a linha 5973: const newProcess = {
// 3. Substitua TODA a seção const newProcess { ... } pela seção abaixo
// 4. Certifique-se de que a linha após o fechamento é: const docRef = await addDoc(collection(db, 'formularios'), newProcess);
//
// ============================================================================

      const newProcess = {
        // ===== DADOS PESSOAIS =====
        nomeCompleto: userData.nomeCompleto,
        cpf: userData.cpf,
        dataNascimento: userData.dataNascimento,
        email: userData.email,
        telefone: userData.telefone,

        // ===== DADOS PROCESSUAIS =====
        numeroProcesso: processData.numeroProcesso,
        vara: processData.vara,
        comarca: processData.comarca,
        fontePagadora: '', // Se houver campo, adicionar aqui
        cnpj: '', // Se houver campo, adicionar aqui

        // ===== VALORES DE ENTRADA =====
        brutoHomologado: parseFloat(valueData.brutoHomologado) || 0,
        tributavelHomologado: parseFloat(valueData.tributavelHomologado) || 0,
        numeroMeses: parseInt(valueData.numeroMeses) || 0,

        // ===== ALVARÁS DETALHADOS (Array) =====
        alvaras: [
          valueData.alvara1 ? { valor: parseFloat(valueData.alvara1) || 0, data: valueData.alvara1Data || '' } : null,
          valueData.alvara2 ? { valor: parseFloat(valueData.alvara2) || 0, data: valueData.alvara2Data || '' } : null,
          valueData.alvara3 ? { valor: parseFloat(valueData.alvara3) || 0, data: valueData.alvara3Data || '' } : null,
          valueData.alvara4 ? { valor: parseFloat(valueData.alvara4) || 0, data: valueData.alvara4Data || '' } : null,
          valueData.alvara5 ? { valor: parseFloat(valueData.alvara5) || 0, data: valueData.alvara5Data || '' } : null,
          valueData.alvara6 ? { valor: parseFloat(valueData.alvara6) || 0, data: valueData.alvara6Data || '' } : null,
          valueData.alvara7 ? { valor: parseFloat(valueData.alvara7) || 0, data: valueData.alvara7Data || '' } : null,
          valueData.alvara8 ? { valor: parseFloat(valueData.alvara8) || 0, data: valueData.alvara8Data || '' } : null,
          valueData.alvara9 ? { valor: parseFloat(valueData.alvara9) || 0, data: valueData.alvara9Data || '' } : null,
          valueData.alvara10 ? { valor: parseFloat(valueData.alvara10) || 0, data: valueData.alvara10Data || '' } : null,
        ].filter(a => a !== null), // Remove valores nulos

        // ===== DARFs DETALHADOS (Array) =====
        darfs: [
          valueData.darf1 ? { valor: parseFloat(valueData.darf1) || 0, data: valueData.darf1Data || '' } : null,
          valueData.darf2 ? { valor: parseFloat(valueData.darf2) || 0, data: valueData.darf2Data || '' } : null,
          valueData.darf3 ? { valor: parseFloat(valueData.darf3) || 0, data: valueData.darf3Data || '' } : null,
          valueData.darf4 ? { valor: parseFloat(valueData.darf4) || 0, data: valueData.darf4Data || '' } : null,
          valueData.darf5 ? { valor: parseFloat(valueData.darf5) || 0, data: valueData.darf5Data || '' } : null,
          valueData.darf6 ? { valor: parseFloat(valueData.darf6) || 0, data: valueData.darf6Data || '' } : null,
          valueData.darf7 ? { valor: parseFloat(valueData.darf7) || 0, data: valueData.darf7Data || '' } : null,
          valueData.darf8 ? { valor: parseFloat(valueData.darf8) || 0, data: valueData.darf8Data || '' } : null,
          valueData.darf9 ? { valor: parseFloat(valueData.darf9) || 0, data: valueData.darf9Data || '' } : null,
          valueData.darf10 ? { valor: parseFloat(valueData.darf10) || 0, data: valueData.darf10Data || '' } : null,
        ].filter(d => d !== null), // Remove valores nulos

        // ===== HONORÁRIOS DETALHADOS (Array) =====
        honorarios: [
          valueData.honorarios1 ? { valor: parseFloat(valueData.honorarios1) || 0, ano: parseInt(valueData.anoEquivalente1) || new Date().getFullYear() } : null,
          valueData.honorarios2 ? { valor: parseFloat(valueData.honorarios2) || 0, ano: parseInt(valueData.anoEquivalente2) || new Date().getFullYear() } : null,
          valueData.honorarios3 ? { valor: parseFloat(valueData.honorarios3) || 0, ano: parseInt(valueData.anoEquivalente3) || new Date().getFullYear() } : null,
          valueData.honorarios4 ? { valor: parseFloat(valueData.honorarios4) || 0, ano: parseInt(valueData.anoEquivalente4) || new Date().getFullYear() } : null,
          valueData.honorarios5 ? { valor: parseFloat(valueData.honorarios5) || 0, ano: parseInt(valueData.anoEquivalente5) || new Date().getFullYear() } : null,
          valueData.honorarios6 ? { valor: parseFloat(valueData.honorarios6) || 0, ano: parseInt(valueData.anoEquivalente6) || new Date().getFullYear() } : null,
          valueData.honorarios7 ? { valor: parseFloat(valueData.honorarios7) || 0, ano: parseInt(valueData.anoEquivalente7) || new Date().getFullYear() } : null,
          valueData.honorarios8 ? { valor: parseFloat(valueData.honorarios8) || 0, ano: parseInt(valueData.anoEquivalente8) || new Date().getFullYear() } : null,
          valueData.honorarios9 ? { valor: parseFloat(valueData.honorarios9) || 0, ano: parseInt(valueData.anoEquivalente9) || new Date().getFullYear() } : null,
          valueData.honorarios10 ? { valor: parseFloat(valueData.honorarios10) || 0, ano: parseInt(valueData.anoEquivalente10) || new Date().getFullYear() } : null,
        ].filter(h => h !== null), // Remove valores nulos

        // ===== CÁLCULOS INTERMEDIÁRIOS =====
        proporcao: parseFloat(valueData.numeroDeMeses) / 12 || 0, // Proporção simplificada
        rendimentosTributavelAlvara: valorCalculos.rendTribUm + valorCalculos.rendTribDois + valorCalculos.rendTribTres + 
                                     valorCalculos.rendTribQuatro + valorCalculos.rendTribCinco + valorCalculos.rendTribSeis +
                                     valorCalculos.rendTribSete + valorCalculos.rendTribOito + valorCalculos.rendTribNove +
                                     valorCalculos.rendTribDez || 0,
        rendimentosTributavelHonorarios: 0, // Será calculado no dashboard se necessário
        baseCalculo: 0, // Será calculado no dashboard
        rra: 0, // Será calculado no dashboard
        irMensal: 0, // Será calculado no dashboard
        irDevido: valorCalculos.irrfUm + valorCalculos.irrfDois + valorCalculos.irrfTres + 
                  valorCalculos.irrfQuatro + valorCalculos.irrfCinco + valorCalculos.irrfSeis +
                  valorCalculos.irrfSete + valorCalculos.irrfOito + valorCalculos.irrfNove +
                  valorCalculos.irrfDez || 0,

        // ===== RESULTADO FINAL =====
        irpfRestituir: valorCalculos.irpfUm + valorCalculos.irpfDois + valorCalculos.irpfTres +
                       valorCalculos.irpfQuatro + valorCalculos.irpfCinco + valorCalculos.irpfSeis +
                       valorCalculos.irpfSete + valorCalculos.irpfOito + valorCalculos.irpfNove +
                       valorCalculos.irpfDez || 0,

        // ===== CONTROLE E METADATA =====
        tipoAcesso: paymentData.plano === "Starter" ? "Starter" : "Builder",
        statusPagamento: paymentData.status === "CONFIRMED" ? "pago" : "pendente",
        statusKitIR: "pendente",
        statusEmail: "pendente",
        dataPagamento: paymentData.dataConfirmacao || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),

        // ===== DADOS ORIGINAIS (para compatibilidade) =====
        paymentData,
        pdfData: updatedPdfData
      };

      // ============================================================================
      // IMPORTANTE: Mudar a coleção de 'users' para 'formularios'
      // ============================================================================
      // ANTES:
      // const docRef = await addDoc(collection(db, 'users'), newProcess);
      //
      // DEPOIS:
      // const docRef = await addDoc(collection(db, 'formularios'), newProcess);
      // ============================================================================

      // Salvar na coleção CORRETA (formularios, não users)
      const docRef = await addDoc(collection(db, 'formularios'), newProcess);
      console.log('Usuário criado no Firebase (coleção: formularios):', docRef.id);

      // Atualizar paymentData com o ID do documento
      setPaymentData(prev => ({
        ...prev,
        idApp: docRef.id
      }));
