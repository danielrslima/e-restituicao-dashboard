# Validação e Testes do Dashboard - Fase 45, 46, 47, 48

## Objetivo
Validar que o dashboard exibe corretamente:
1. Data/Hora de criação do cálculo
2. Seção "Dados por Exercício Fiscal" (apenas para ANOS DIFERENTES)
3. Seção "PDFs por Exercício Fiscal" com links de download (apenas para ANOS DIFERENTES)
4. Dados simples para MESMO ANO

---

## Checklist de Testes

### ✅ Teste 1: Dados da Ana Carmen (ANOS DIFERENTES - 3 exercícios, 6 PDFs)

**Payload:**
```bash
curl -X POST http://localhost:3000/api/formulario/receber \
  -H "Content-Type: application/json" \
  -d @/home/ubuntu/test-ana-carmen.json
```

**Validações:**
- [ ] Resposta HTTP 200 (sucesso)
- [ ] Formulário aparece na tabela do dashboard
- [ ] CPF exibe corretamente: `267.035.801-20`
- [ ] Nome exibe corretamente: `Ana Carmen Collodetti Brugger`
- [ ] Data/Hora exibe na tabela (formato: DD/MM/YYYY HH:MM:SS)
- [ ] Ao clicar no formulário, abre página de detalhes

**Na página de detalhes:**
- [ ] Campo "Cálculo Criado em" exibe data/hora
- [ ] Seção "Dados por Exercício Fiscal" aparece
  - [ ] Contém 3 exercícios (2022, 2023, 2025)
  - [ ] Cada exercício mostra seus dados (ano, alvaras, honorarios, etc)
- [ ] Seção "PDFs por Exercício Fiscal" aparece
  - [ ] Contém 6 PDFs (2 por exercício)
  - [ ] Links de download funcionam
  - [ ] Nomes dos PDFs aparecem corretamente:
    - [ ] Demonstrativo 2022
    - [ ] Esclarecimentos 2022
    - [ ] Demonstrativo 2023
    - [ ] Esclarecimentos 2023
    - [ ] Demonstrativo 2025
    - [ ] Esclarecimentos 2025

---

### ✅ Teste 2: Dados Simples (MESMO ANO)

**Payload:**
```json
{
  "nomeCompleto": "João Silva",
  "cpf": "123.456.789-00",
  "dataNascimento": "15/05/1985",
  "email": "joao@example.com",
  "numeroProcesso": "0001234-56.2020.5.10.0001",
  "vara": "Vara do Trabalho",
  "comarca": "São Paulo",
  "fontePagadora": "Empresa ABC",
  "cnpj": "12.345.678/0001-90",
  "brutoHomologado": 150000,
  "tributavelHomologado": 120000,
  "numeroMeses": 24,
  "anosdiferentes": false,
  "irpfRestituir": 5000
}
```

**Validações:**
- [ ] Resposta HTTP 200 (sucesso)
- [ ] Formulário aparece na tabela
- [ ] Data/Hora exibe corretamente
- [ ] Ao clicar, abre página de detalhes
- [ ] Seção "Dados por Exercício Fiscal" NÃO aparece
- [ ] Seção "PDFs por Exercício Fiscal" NÃO aparece
- [ ] Dados simples exibem normalmente

---

### ✅ Teste 3: Dados com Alvarás, DARFs e Honorários

**Payload:**
```json
{
  "nomeCompleto": "Maria Santos",
  "cpf": "987.654.321-00",
  "dataNascimento": "20/08/1980",
  "email": "maria@example.com",
  "numeroProcesso": "0005678-90.2015.5.10.0002",
  "vara": "Vara do Trabalho",
  "comarca": "Rio de Janeiro",
  "fontePagadora": "Empresa XYZ",
  "cnpj": "98.765.432/0001-10",
  "brutoHomologado": 500000,
  "tributavelHomologado": 400000,
  "numeroMeses": 60,
  "alvaras": [
    {"valor": 100000, "data": "10/01/2023"},
    {"valor": 150000, "data": "15/02/2023"},
    {"valor": 200000, "data": "20/03/2023"}
  ],
  "darfs": [
    {"valor": 50000, "data": "30/04/2023"}
  ],
  "honorarios": [
    {"valor": 75000, "ano": "2023"},
    {"valor": 100000, "ano": "2023"}
  ],
  "baseCalculo": 150000,
  "irpfRestituir": 25000,
  "anosdiferentes": false
}
```

**Validações:**
- [ ] Resposta HTTP 200
- [ ] Formulário aparece na tabela
- [ ] Todos os valores aparecem corretamente
- [ ] Soma de alvarás: 450000 ✓
- [ ] Soma de DARFs: 50000 ✓
- [ ] Soma de honorários: 175000 ✓

---

## Testes de Integração (Vitest)

**Status:** ✅ **9/9 PASSANDO**

Executar testes:
```bash
cd /home/ubuntu/e-restituicao-dashboard
pnpm test server/formulario-externo.test.ts
```

**Testes Incluídos:**
1. ✅ Payload simples com campos obrigatórios
2. ✅ Estrutura de arrays (alvarás, darfs, honorários)
3. ✅ Estrutura de PDFs por exercício
4. ✅ Estrutura de exercícios fiscais
5. ✅ Flag anosdiferentes
6. ✅ Soma de valores
7. ✅ Formatação de Data/Hora
8. ✅ Parsing de JSON
9. ✅ Dados da Ana Carmen (3 exercícios, 6 PDFs)

---

## Verificações de Banco de Dados

### Verificar se formulário foi salvo:
```sql
SELECT id, nomeCliente, cpf, anosdiferentes, pdfsJson, exerciciosJson, createdAt 
FROM irpfForms 
WHERE cpf = '267.035.801-20'
ORDER BY createdAt DESC 
LIMIT 1;
```

**Esperado:**
- `anosdiferentes` = 1
- `pdfsJson` = JSON array com 6 PDFs
- `exerciciosJson` = JSON array com 3 exercícios
- `createdAt` = timestamp atual

### Verificar parsing de JSON:
```javascript
// No console do navegador
const form = { pdfsJson: '[{"nome":"PDF1","url":"http://..."}]' };
const pdfs = JSON.parse(form.pdfsJson);
console.log(pdfs); // Deve exibir array com PDFs
```

---

## Testes de UI/UX

### Tabela do Dashboard
- [ ] Coluna "Data/Hora" exibe corretamente
- [ ] Formato: DD/MM/YYYY HH:MM:SS
- [ ] Ordenação por data funciona
- [ ] Filtros funcionam

### Página de Detalhes (ANOS DIFERENTES)
- [ ] Seção "Dados por Exercício Fiscal" está visível
- [ ] Grid de exercícios exibe 3 colunas em desktop
- [ ] Cada exercício mostra todos os dados
- [ ] Seção "PDFs por Exercício Fiscal" está visível
- [ ] Grid de PDFs exibe 2 colunas em desktop
- [ ] Links de download funcionam
- [ ] Ícone de download aparece ao lado do texto

### Página de Detalhes (MESMO ANO)
- [ ] Seção "Dados por Exercício Fiscal" NÃO aparece
- [ ] Seção "PDFs por Exercício Fiscal" NÃO aparece
- [ ] Dados simples exibem normalmente

---

## Testes de Responsividade

### Mobile (< 768px)
- [ ] Tabela exibe corretamente
- [ ] Grid de exercícios muda para 1 coluna
- [ ] Grid de PDFs muda para 1 coluna
- [ ] Links de download funcionam

### Tablet (768px - 1024px)
- [ ] Grid de exercícios exibe 2 colunas
- [ ] Grid de PDFs exibe 2 colunas

### Desktop (> 1024px)
- [ ] Grid de exercícios exibe 3 colunas
- [ ] Grid de PDFs exibe 2 colunas

---

## Testes de Erro

### Payload Inválido
```bash
curl -X POST http://localhost:3000/api/formulario/receber \
  -H "Content-Type: application/json" \
  -d '{"cpf":"123"}'
```
- [ ] Resposta HTTP 400
- [ ] Mensagem de erro clara

### JSON Inválido em pdfsJson
```json
{
  "pdfsJson": "invalid json"
}
```
- [ ] Dashboard não quebra
- [ ] Mensagem de erro exibe: "Erro ao carregar PDFs"

### JSON Inválido em exerciciosJson
```json
{
  "exerciciosJson": "invalid json"
}
```
- [ ] Dashboard não quebra
- [ ] Mensagem de erro exibe: "Erro ao carregar dados dos exercícios"

---

## Checklist Final

- [ ] Todos os testes de Teste 1 passaram
- [ ] Todos os testes de Teste 2 passaram
- [ ] Todos os testes de Teste 3 passaram
- [ ] Todos os testes vitest passaram (9/9)
- [ ] Testes de UI/UX passaram
- [ ] Testes de responsividade passaram
- [ ] Testes de erro passaram
- [ ] Banco de dados contém dados corretos
- [ ] Sem erros no console do navegador
- [ ] Sem erros no console do servidor

---

## Próximos Passos

1. ✅ Executar todos os testes acima
2. ✅ Documentar qualquer erro encontrado
3. ✅ Corrigir erros identificados
4. ✅ Criar checkpoint final
5. ✅ Publicar dashboard

---

## Notas Importantes

- **Data/Hora:** Sempre em formato local do usuário (DD/MM/YYYY HH:MM:SS)
- **PDFs:** Apenas aparecem quando `anosdiferentes = 1`
- **Exercícios:** Apenas aparecem quando `anosdiferentes = 1`
- **Banco de Dados:** `pdfsJson` e `exerciciosJson` são strings JSON, não objetos
- **Parsing:** Sempre fazer `JSON.parse()` antes de usar os dados

---

## Contato/Suporte

Se encontrar algum erro:
1. Verifique o console do navegador (F12)
2. Verifique o console do servidor
3. Verifique o banco de dados
4. Verifique se o payload está correto
5. Verifique se as URLs dos PDFs são válidas
