# 🧪 Documentação de Testes

Este documento descreve a estratégia de testes, cobertura e como executar os testes do projeto Order Management API.

## 📊 Resumo da Cobertura

```
Test Files: 2 passed (2)
Tests: 31 passed (31)
Coverage: 100% Statements | 88.88% Branches | 100% Functions | 100% Lines
```

## 🎯 Objetivos dos Testes

Os testes foram criados para garantir que:

1. ✅ A lógica de transição de estados funciona corretamente
2. ✅ Todas as transições inválidas são bloqueadas
3. ✅ As regras de negócio são respeitadas
4. ✅ Erros são tratados adequadamente
5. ✅ O código é confiável e mantível

## 📁 Estrutura dos Testes

```
src/services/
├── order.service.ts                    # Código de produção
├── order.service.test.ts               # Testes unitários (13 testes)
└── order.service.integration.test.ts   # Testes de integração (18 testes)
```

## 🔬 Tipos de Testes

### 1. Testes Unitários (`order.service.test.ts`)

Testam a lógica do serviço isoladamente usando mocks do modelo Order.

**Casos cobertos:**
- ✓ Transição CREATED → ANALYSIS
- ✓ Transição ANALYSIS → COMPLETED
- ✓ Bloqueio ao tentar avançar COMPLETED
- ✓ Bloqueio ao tentar avançar pedido DELETED
- ✓ Erro quando pedido não é encontrado
- ✓ Fluxo completo de transições
- ✓ Impossibilidade de pular estados
- ✓ Criação de pedidos com validações
- ✓ Listagem e filtros de pedidos
- ✓ Paginação

### 2. Testes de Integração (`order.service.integration.test.ts`)

Testam as regras de negócio e validações sem mocks.

**Casos cobertos:**
- ✓ Validação do mapa de transições de estados
- ✓ Impossibilidade de transições reversas
- ✓ Fluxo linear de progressão
- ✓ Independência entre status e state
- ✓ Independência entre serviços e pedidos
- ✓ Casos extremos e limites
- ✓ Determinismo das transições
- ✓ Validação de enums
- ✓ Regras de negócio (valor positivo, serviços obrigatórios)

## 🔄 Máquina de Estados Testada

```
┌─────────┐           ┌──────────┐           ┌───────────┐
│ CREATED │ ────────> │ ANALYSIS │ ────────> │ COMPLETED │
└─────────┘           └──────────┘           └───────────┘
    ↑                      ↑                       ↑
    │                      │                       │
    └──────────────────────┴───────────────────────┘
              ❌ Transições reversas bloqueadas
```

### Estados Válidos
- `CREATED` → `ANALYSIS` ✅
- `ANALYSIS` → `COMPLETED` ✅
- `COMPLETED` → null ❌ (erro: estado final)

### Transições Bloqueadas
- `COMPLETED` → qualquer estado ❌
- `DELETED` (status) → qualquer transição ❌
- Qualquer transição reversa ❌

## 📋 Cenários de Teste Detalhados

### Transições de Estado

| # | Cenário | Estado Inicial | Ação | Resultado Esperado | Status |
|---|---------|---------------|------|-------------------|--------|
| 1 | Avançar pedido novo | CREATED | advance() | ANALYSIS | ✅ |
| 2 | Avançar pedido em análise | ANALYSIS | advance() | COMPLETED | ✅ |
| 3 | Tentar avançar pedido completo | COMPLETED | advance() | Error: "Order is already in final state" | ✅ |
| 4 | Avançar pedido deletado | CREATED/DELETED | advance() | Error: "Cannot advance deleted order" | ✅ |
| 5 | Pedido não encontrado | N/A | advance() | Error: "Order not found" | ✅ |
| 6 | Fluxo completo | CREATED | advance() x2 | CREATED → ANALYSIS → COMPLETED | ✅ |

### Criação de Pedidos

| # | Cenário | Dados | Resultado Esperado | Status |
|---|---------|-------|-------------------|--------|
| 7 | Criar pedido válido | Lab, Patient, Customer, Services | Order com state=CREATED, status=ACTIVE | ✅ |
| 8 | Criar sem serviços | Services = [] | Error: "Order must have at least one service" | ✅ |
| 9 | Criar com valor zero | Services[0].value = 0 | Error: "Order total value must be greater than zero" | ✅ |

### Listagem e Filtros

| # | Cenário | Filtros | Resultado Esperado | Status |
|---|---------|---------|-------------------|--------|
| 10 | Listar todos | page=1, limit=10 | Apenas pedidos ACTIVE | ✅ |
| 11 | Filtrar por estado | state=COMPLETED | Apenas COMPLETED e ACTIVE | ✅ |
| 12 | Paginação | page=2, limit=5 | Skip 5, Limit 5 | ✅ |

## 🚀 Executando os Testes

### Comandos Básicos

```bash
# Executar todos os testes
npm test

# Executar com interface visual
npm run test:ui

# Executar com relatório de cobertura
npm run test:coverage

# Executar em modo watch (desenvolvimento)
npm test -- --watch

# Executar apenas testes unitários
npm test -- order.service.test.ts

# Executar apenas testes de integração
npm test -- order.service.integration.test.ts
```

### Saída Esperada

```bash
$ npm test

 ✓ src/services/order.service.integration.test.ts (18 tests) 4ms
   ✓ State Transition Rules (4)
   ✓ Order Status vs State Validation (3)
   ✓ Service Status Independence (2)
   ✓ Edge Cases and Boundary Conditions (6)
   ✓ Business Rules Validation (3)

 ✓ src/services/order.service.test.ts (13 tests) 6ms
   ✓ advanceOrderState (7)
   ✓ createOrder (3)
   ✓ getOrders (3)

 Test Files  2 passed (2)
      Tests  31 passed (31)
   Duration  291ms
```

### Relatório de Cobertura

```bash
$ npm run test:coverage

------------------|---------|----------|---------|---------|-------------------
File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------|---------|----------|---------|---------|-------------------
All files         |     100 |    88.88 |     100 |     100 |
 order.service.ts |     100 |    88.88 |     100 |     100 | 25-26
------------------|---------|----------|---------|---------|-------------------
```

## 🎯 Metas de Cobertura

| Métrica | Meta | Atual | Status |
|---------|------|-------|--------|
| Statements | ≥ 90% | 100% | ✅ |
| Branches | ≥ 80% | 88.88% | ✅ |
| Functions | ≥ 90% | 100% | ✅ |
| Lines | ≥ 90% | 100% | ✅ |

## 🔧 Ferramentas Utilizadas

- **Vitest** - Framework de testes rápido e moderno
- **@vitest/coverage-v8** - Cobertura de código com V8
- **vi.mock()** - Sistema de mocks do Vitest

## 📝 Boas Práticas Aplicadas

1. ✅ **Arrange-Act-Assert (AAA)** - Estrutura clara dos testes
2. ✅ **Testes isolados** - Cada teste é independente
3. ✅ **Descrições claras** - Nomes descritivos e objetivos
4. ✅ **Cobertura de edge cases** - Cenários extremos testados
5. ✅ **Mocks apropriados** - Uso de mocks apenas quando necessário
6. ✅ **Assertions específicas** - Verificações precisas
7. ✅ **Setup e Cleanup** - beforeEach para limpar mocks

## 🐛 Debugging de Testes

### Executar teste específico em modo watch

```bash
npm test -- --watch --reporter=verbose
```

### Executar com debug detalhado

```bash
npm test -- --reporter=verbose --run
```

### Ver stack trace completo

```bash
npm test -- --no-coverage
```

## 📊 Métricas de Qualidade

- **Tempo de execução**: ~300ms para 31 testes
- **Taxa de sucesso**: 100% (31/31)
- **Cobertura**: 100% statements, 88.88% branches
- **Manutenibilidade**: Alta (testes bem estruturados)

## 🎓 Como Adicionar Novos Testes

### 1. Para funcionalidades com banco de dados (unitários)

```typescript
it('should do something', async () => {
  // Arrange: preparar mocks
  const mockData = { /* ... */ };
  vi.mocked(Order.findById).mockResolvedValue(mockData as any);

  // Act: executar ação
  const result = await orderService.someMethod('123');

  // Assert: verificar resultado
  expect(result).toBe(expected);
  expect(Order.findById).toHaveBeenCalledWith('123');
});
```

### 2. Para regras de negócio (integração)

```typescript
it('should validate business rule', () => {
  // Arrange: definir dados
  const data = { /* ... */ };

  // Act & Assert: validar regra
  expect(someBusinessRule(data)).toBe(true);
});
```

## 🔒 Garantias Fornecidas pelos Testes

Os testes garantem que:

1. ✅ Pedidos sempre iniciam com estado CREATED
2. ✅ Estados só podem avançar linearmente
3. ✅ Pedidos completados não podem ser modificados
4. ✅ Pedidos deletados não podem avançar de estado
5. ✅ Pedidos devem ter pelo menos um serviço
6. ✅ Valor total deve ser positivo
7. ✅ Transições são determinísticas
8. ✅ Não há possibilidade de pular estados
9. ✅ Não há possibilidade de voltar estados
10. ✅ Erros são tratados adequadamente

## 📚 Referências

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [State Machine Testing](https://www.smashingmagazine.com/2018/01/testing-state-machines/)

---

**Última atualização**: 29/12/2025
**Versão dos testes**: 1.0.0
**Mantido por**: [@isaqu3d](https://github.com/isaqu3d)
