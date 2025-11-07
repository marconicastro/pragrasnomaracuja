/**
 * Lint-staged Configuration
 * 
 * Roda linters apenas nos arquivos staged (modificados)
 */

module.exports = {
  // TypeScript/JavaScript files
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // JSON files
  '*.json': [
    'prettier --write',
  ],
  
  // Markdown files
  '*.md': [
    'prettier --write',
  ],
  
  // CSS/SCSS files
  '*.{css,scss}': [
    'prettier --write',
  ],
};

