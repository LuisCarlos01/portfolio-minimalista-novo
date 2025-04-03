# Portfolio Minimalista

Projeto de portfolio desenvolvido em React com foco em design minimalista e alta performance.

## 🚀 Tecnologias Utilizadas

- React.js
- GSAP para animações
- Styled Components e SCSS para estilização
- TypeScript para tipagem estática

## 📋 Características

- Design responsivo
- Animações fluidas e elegantes
- Navegação em SPA (Single Page Application)
- Performance otimizada
- Estratégias para carregamento rápido

## 🔧 Instalação e Configuração

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/portfolio-minimalista.git
cd portfolio-minimalista
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em desenvolvimento:
```bash
npm start
```

4. Para gerar a versão de produção:
```bash
npm run build
```

## 📦 Estrutura do Projeto

```
portfolio-minimalista/
├── public/
│   ├── images/
│   └── index.html
├── src/
│   ├── components/
│   ├── contexts/
│   ├── data/
│   ├── hooks/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── index.jsx
└── scripts/
    ├── check-styles.js
    ├── check-code.js
    ├── review-changes.js
    └── install-hooks.js
```

## 🎨 Sistema de Estilos

### Organização de Estilos

Os estilos do projeto são centralizados através do arquivo `src/styles/index.js`, que importa todos os arquivos CSS e SCSS necessários. Isso garante que não haja duplicações e conflitos de estilos.

- **`src/styles/style.css`**: Contém estilos globais e reset CSS
- **`src/styles/components/`**: Contém arquivos SCSS específicos para cada componente
- **`src/styles/variables.css`**: Define variáveis CSS globais
- **`src/styles/custom.css`**: Para customizações específicas (último a ser importado)

### Verificação de Conflitos de Estilos

O projeto inclui um sistema de verificação de conflitos de estilos. Para executar a verificação:

```bash
npm run check-styles
```

Este comando irá:
1. Detectar seletores CSS duplicados em diferentes arquivos
2. Identificar importações CSS duplicadas em componentes
3. Verificar possíveis conflitos entre estilos inline e globais

### Boas Práticas de Estilização

1. **Não importe arquivos CSS/SCSS diretamente nos componentes**
   - Use o sistema centralizado de importação em `src/styles/index.js`

2. **Use nomes de classes específicos para componentes**
   - Prefixe classes com o nome do componente: `.hero-title` em vez de apenas `.title`

3. **Evite estilos inline quando possível**
   - Quando necessário, verifique se há conflitos com estilos globais

4. **Prefira variáveis CSS para valores reutilizados**
   - Use as variáveis definidas em `variables.css`

5. **Mantenha a especificidade de seletores baixa**
   - Evite aninhamento profundo que dificulta sobrescrita

## 🔄 Verificação Automática

Durante o desenvolvimento, o sistema verifica automaticamente conflitos de estilo. Você pode ver os resultados no console do navegador.

## 🔍 Sistema de Revisão de Código

O projeto inclui um sistema de revisão automática de código para evitar conflitos e duplicações.

### Verificação Completa do Código

Para realizar uma verificação completa do código do projeto:

```bash
npm run check-code
```

Esta verificação analisará:
- Diretórios com nomes duplicados ou similares
- Arquivos com nomes duplicados em diferentes locais
- Arquivos com conteúdo similar ou duplicado
- Conflitos entre diferentes linguagens e frameworks

### Revisão de Alterações

Para verificar apenas os arquivos modificados antes de um commit:

```bash
npm run review-changes
```

Este comando é executado automaticamente antes de cada commit Git, garantindo que novos arquivos ou modificações:
1. Não dupliquem estruturas existentes
2. Não causem conflitos com outras partes do código
3. Sigam os padrões estabelecidos no projeto

### Integração com Git

O sistema está integrado com o Git através de hooks que são instalados automaticamente:

```bash
npm run install-hooks
```

Se você precisar ignorar a verificação ao fazer um commit, use a flag `--no-verify`:

```bash
git commit -m "Mensagem do commit" --no-verify
```

### Estrutura de Organização

O projeto segue as seguintes diretrizes para organização do código:

1. **Componentes específicos para cada seção**
   - Cada seção do site tem seu próprio componente em `src/components/`
   - Estilos relacionados são mantidos em `src/styles/components/`

2. **Utilitários compartilhados**
   - Funções e classes reutilizáveis são mantidas em `src/utils/`

3. **Hooks personalizados**
   - Lógica de estado e efeitos reutilizáveis em `src/hooks/`

4. **Dados separados da lógica**
   - Conteúdo e informações em `src/data/`

## 👨‍💻 Autor

- **Luís Carlos** - [GitHub](https://github.com/LuisCarlos01)

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.
