# ANÁLISE DE FORMATAÇÃO: PDF Gerado vs PDF Perfeito

## FORMATAÇÃO DE TEXTO DETALHADA:

### CABEÇALHO (Dados do Contribuinte)
| Elemento | Gerado | Perfeito | Correção |
|----------|--------|----------|----------|
| "CONTRIBUINTE:" | Negrito | Negrito | ✅ OK |
| "CPF:" | Negrito | Negrito | ✅ OK |
| "DATA DE NASCIMENTO:" | Negrito | Negrito | ✅ OK |
| "DIRPF 2025" | Normal | Normal | ✅ OK |

### SEÇÃO A) DADOS DA AÇÃO:
| Elemento | Gerado | Perfeito | Correção |
|----------|--------|----------|----------|
| "A) DADOS DA AÇÃO:" | Negrito, SEM sublinhado | Negrito, COM sublinhado | ❌ ADICIONAR sublinhado |
| Item 1) texto | Normal | Normal | ✅ OK |

### SEÇÃO B) VALORES E DATAS:
| Elemento | Gerado | Perfeito | Correção |
|----------|--------|----------|----------|
| "B) VALORES E DATAS:" | Negrito, SEM sublinhado | Negrito, COM sublinhado | ❌ ADICIONAR sublinhado |
| Itens 2-6 texto | Normal | Normal | ✅ OK |
| Valores em R$ nos itens | Normal | **NEGRITO** | ❌ ADICIONAR negrito nos valores |

### TÍTULO DA TABELA RRA
| Elemento | Gerado | Perfeito | Correção |
|----------|--------|----------|----------|
| Linha 1 "CAMPOS E VALORES..." | Negrito | Negrito | ✅ OK |
| Linha 2 "NA OPÇÃO DE TRIBUTAÇÃO..." | Negrito, SEM sublinhado | Negrito, COM sublinhado | ❌ ADICIONAR sublinhado |

### TABELA RRA
| Elemento | Gerado | Perfeito | Correção |
|----------|--------|----------|----------|
| Labels (A, B, C, D) | Negrito | Negrito | ✅ OK |
| Valores | Normal | Normal | ✅ OK |

### OBSERVAÇÕES
| Elemento | Gerado | Perfeito | Correção |
|----------|--------|----------|----------|
| "Observações.:" | Negrito | Negrito | ✅ OK |
| Itens a) e b) | Normal | Normal | ✅ OK |

### RODAPÉ
| Elemento | Gerado | Perfeito | Correção |
|----------|--------|----------|----------|
| "1 Art. 12.A..." | Normal, tamanho menor | Normal, tamanho menor | ✅ OK |
| Linha horizontal | Parcial, fina | **TOTAL, GROSSA** | ❌ CORRIGIR linha |

---

## RESUMO DAS CORREÇÕES DE FORMATAÇÃO:

1. **SUBLINHADO em "A) DADOS DA AÇÃO:"** - adicionar underline
2. **SUBLINHADO em "B) VALORES E DATAS:"** - adicionar underline  
3. **SUBLINHADO em "NA OPÇÃO DE TRIBUTAÇÃO EXCLUSIVA NA FONTE"** - adicionar underline
4. **NEGRITO nos valores R$** dos itens 3, 4, 5, 6 - ex: "**R$ 220.597,31**"
5. **LINHA HORIZONTAL GROSSA** antes do logo IR360 - largura total da página
