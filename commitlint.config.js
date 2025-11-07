/**
 * Commitlint Configuration
 * 
 * Força o uso de Conventional Commits
 * Formato: type(scope): subject
 * 
 * Exemplos válidos:
 * - feat: adicionar lazy loading
 * - fix: corrigir bug no GTM
 * - docs: atualizar README
 * - refactor: melhorar performance
 * - test: adicionar testes unitários
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nova feature
        'fix',      // Bug fix
        'docs',     // Documentação
        'style',    // Formatação (sem mudança de código)
        'refactor', // Refatoração
        'perf',     // Melhoria de performance
        'test',     // Adicionar/corrigir testes
        'build',    // Mudanças no build system
        'ci',       // Mudanças no CI/CD
        'chore',    // Outras mudanças (deps, etc)
        'revert',   // Reverter commit anterior
      ],
    ],
    'subject-case': [0], // Permite qualquer case no subject
    'subject-max-length': [2, 'always', 100],
  },
};

