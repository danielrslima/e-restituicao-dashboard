# 🔧 GUIA PASSO A PASSO: APLICAR MODIFICAÇÕES NO SITE

**Data:** 28/12/2025  
**Tarefa:** Modificar App.jsx para coletar todos os dados necessários (30+ campos)  
**Tempo Estimado:** 30-45 minutos  
**Risco:** Muito Baixo (mudança cirúrgica em uma seção)

---

## 📋 O QUE SERÁ MODIFICADO

Apenas **uma seção** do arquivo será modificada:

- **Arquivo:** `App.jsx` (código-fonte do site)
- **Localização:** Linha ~5973
- **Seção:** `const newProcess = { ... }`
- **Mudanças:**
  - ✅ Adicionar arrays de alvarás detalhados
  - ✅ Adicionar arrays de DARFs detalhados
  - ✅ Adicionar arrays de honorários detalhados
  - ✅ Adicionar valores de entrada
  - ✅ Adicionar cálculos intermediários
  - ✅ Mudar coleção de `users` para `formularios`

---

## 🚀 PASSO A PASSO

### PASSO 1: Fazer Backup do Arquivo Original

```bash
# Via SSH/FTP do Hostinger
cd /home/seu-usuario/restituicaoia.com.br/src

# Fazer backup
cp App.jsx App.jsx.backup-$(date +%Y%m%d-%H%M%S)

# Verificar que o backup foi criado
ls -la App.jsx.backup-*
```

**Resultado esperado:** Arquivo `App.jsx.backup-20251228-120000` criado

---

### PASSO 2: Abrir o Arquivo App.jsx

```bash
# Abrir com editor de texto
nano App.jsx
# ou
vim App.jsx
# ou usar editor visual do Hostinger
```

**Resultado esperado:** Arquivo aberto no editor

---

### PASSO 3: Localizar a Seção `const newProcess`

**Usar Ctrl+F (Find) para procurar:**

```
const newProcess = {
```

**Você deve encontrar na linha ~5973**

---

### PASSO 4: Identificar os Limites da Seção

A seção atual é assim:

```javascript
      const newProcess = {
        paymentData,
        timestamp: new Date().toISOString(),
        userData,
        processData,
        valueData,
        valorCalculos,
        pdfData: updatedPdfData
      };
```

**Você precisa substituir TUDO isso** (do `const newProcess = {` até o `};`)

---

### PASSO 5: Copiar o Código Modificado

O código modificado está em:  
**`APP_MODIFICADO_SECAO_NEWPROCESS.jsx`**

**Copie a seção que começa com:**
```javascript
      const newProcess = {
        // ===== DADOS PESSOAIS =====
```

**E termina com:**
```javascript
        pdfData: updatedPdfData
      };
```

---

### PASSO 6: Substituir no Arquivo Original

1. **Selecione** toda a seção `const newProcess { ... }` no App.jsx original
2. **Delete** a seção antiga
3. **Cole** o código modificado no lugar

**Resultado esperado:** Seção substituída com o novo código

---

### PASSO 7: Verificar a Mudança Crítica

**Procure pela linha que salva no Firebase:**

```javascript
// ANTES (ERRADO):
const docRef = await addDoc(collection(db, 'users'), newProcess);

// DEPOIS (CORRETO):
const docRef = await addDoc(collection(db, 'formularios'), newProcess);
```

**Certifique-se de que está salvando em `'formularios'` e não em `'users'`**

---

### PASSO 8: Salvar o Arquivo

```bash
# Se usando nano
Ctrl+O (salvar)
Enter (confirmar)
Ctrl+X (sair)

# Se usando vim
:wq (salvar e sair)
```

**Resultado esperado:** Arquivo salvo com sucesso

---

### PASSO 9: Compilar o Projeto

```bash
# No diretório do projeto
npm run build
# ou
yarn build
# ou
pnpm build
```

**Resultado esperado:** Build completo sem erros

```
> build
✓ compiled successfully
```

---

### PASSO 10: Fazer Upload para Hostinger

```bash
# Opção A: Via FTP
# Fazer upload de:
# - public/index.html
# - public/static/js/main.*.js
# - public/static/css/main.*.css

# Opção B: Via Git
git add .
git commit -m "Modificação: Coletar dados completos (30+ campos)"
git push origin main
```

**Resultado esperado:** Arquivos atualizados no Hostinger

---

## ✅ VALIDAÇÃO

### Teste 1: Preencher Novo Formulário

1. Acesse o site: https://restituicaoia.com.br
2. Preencha o formulário completo
3. Clique em "Enviar" ou "Calcular"
4. Aguarde a confirmação de pagamento

**Resultado esperado:** Formulário preenchido e enviado

---

### Teste 2: Verificar no Firebase

1. Acesse Firebase Console: https://console.firebase.google.com/
2. Selecione projeto: `erestituicao-ffa5c`
3. Vá para Firestore → Coleção `formularios`
4. Procure pelo novo documento (deve aparecer em tempo real)

**Resultado esperado:** Novo documento com TODOS os campos:

```json
{
  "nomeCompleto": "João Silva",
  "cpf": "123.456.789-00",
  "dataNascimento": "15/05/1980",
  "email": "joao@example.com",
  "telefone": "(11) 98765-4321",
  "numeroProcesso": "0001234-56.2020.5.15.0001",
  "vara": "15ª Vara do Trabalho",
  "comarca": "São Paulo/SP",
  "brutoHomologado": 500000,
  "tributavelHomologado": 450000,
  "numeroMeses": 24,
  "alvaras": [
    { "valor": 150000.50, "data": "15/03/2020" },
    { "valor": 144601.13, "data": "20/06/2021" }
  ],
  "darfs": [
    { "valor": 10000.00, "data": "25/03/2020" },
    { "valor": 12059.73, "data": "30/06/2021" }
  ],
  "honorarios": [
    { "valor": 50000.00, "ano": 2020 },
    { "valor": 60000.00, "ano": 2021 }
  ],
  "irpfRestituir": 32753.21,
  "createdAt": "2025-12-28T12:00:00.000Z",
  ...
}
```

✅ **Todos os 30+ campos presentes**

---

### Teste 3: Verificar no Dashboard

1. Acesse o dashboard: https://seu-dominio.manus.space
2. Faça login como admin
3. Vá para "Formulários"
4. Procure pelo novo formulário (nome do contribuinte)

**Resultado esperado:** Formulário aparece na listagem com todos os dados

---

### Teste 4: Gerar PDFs

1. Clique no formulário para abrir detalhes
2. Clique em "Gerar PDF - Planilha RT"
3. Verifique que o PDF é gerado com todos os valores

**Resultado esperado:** PDF gerado com sucesso e todos os valores preenchidos

---

### Teste 5: Verificar Sincronização em Tempo Real

1. Preencha novo formulário no site
2. Sem recarregar, acesse o dashboard
3. Verifique que o novo formulário aparece em < 10 segundos

**Resultado esperado:** Sincronização em tempo real funcionando

---

## 🆘 TROUBLESHOOTING

### Erro: "Build failed"

```
✗ Error: Cannot find module 'firebase/firestore'
```

**Solução:**
```bash
npm install firebase
# ou
yarn add firebase
# ou
pnpm add firebase
```

---

### Erro: "Documento não aparece no Firebase"

**Verificar:**
1. Está salvando na coleção correta? (`formularios`, não `users`)
2. Firebase está configurado corretamente?
3. Credenciais do Firebase estão corretas?

**Debug:**
```javascript
// Adicionar console.log para verificar
console.log('Salvando no Firebase:', newProcess);
console.log('Coleção:', 'formularios');
console.log('Resultado:', docRef.id);
```

---

### Erro: "PDF não gera com dados completos"

**Verificar:**
1. Todos os campos estão sendo salvos no Firebase?
2. Dashboard está sincronizando os dados?
3. Função de geração de PDF está lendo os campos corretos?

**Solução:**
- Verificar no Firebase Console que os dados foram salvos
- Verificar no Dashboard que os dados aparecem
- Verificar logs do console do navegador

---

## 📊 CHECKLIST FINAL

Antes de considerar a modificação completa:

- [ ] Backup do App.jsx criado
- [ ] Código modificado copiado
- [ ] Seção `const newProcess` substituída
- [ ] Mudança de coleção verificada (`users` → `formularios`)
- [ ] Arquivo salvo
- [ ] Build executado sem erros
- [ ] Arquivos enviados para Hostinger
- [ ] Novo formulário preenchido no site
- [ ] Documento aparece no Firebase (coleção `formularios`)
- [ ] Documento aparece no Dashboard
- [ ] PDF gerado com sucesso
- [ ] Todos os 30+ campos presentes

---

## 📞 PRÓXIMOS PASSOS

Após aplicar as modificações com sucesso:

1. ✅ Teste com múltiplos formulários
2. ✅ Valide que PDFs estão corretos
3. ✅ Proceda para Tarefa 2 (Finalizar PDF Esclarecimentos)
4. ✅ Proceda para Tarefa 3 (Deploy em Produção)

---

## 📁 ARQUIVOS DE REFERÊNCIA

- **Código Modificado:** `APP_MODIFICADO_SECAO_NEWPROCESS.jsx`
- **Documentação Técnica:** `PROXIMOS-PASSOS-COMPLETO.md`
- **Análise de Créditos:** `ANALISE-CREDITOS.md`

---

**Autor:** Manus AI  
**Última Atualização:** 28/12/2025  
**Versão:** 1.0

Boa sorte! 🚀
