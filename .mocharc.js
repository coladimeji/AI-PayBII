// AI-PayBii/.mocharc.js
module.exports = {
    extension: ['ts'],
    spec: 'server/src/tests/**/*.spec.ts',
    require: 'ts-node/register',
    timeout: 5000,
    exit: true,
    recursive: true
  };