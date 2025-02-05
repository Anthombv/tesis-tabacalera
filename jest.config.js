module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    testMatch: [
      '**/test/__tests__/**/*.[jt]s?(x)',
      '**/?(*.)+(spec|test).[jt]s?(x)',
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.config.js'], // Configuración adicional
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest', // Usa ts-jest para transformar archivos TypeScript/JSX
    },
  };
  