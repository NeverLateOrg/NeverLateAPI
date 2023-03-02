const { leaf, runner, branch } = require('scriptease-cli');

leaf('test', async () => {
  await runner.npxExec('jest');
});

branch('test', () => {
  leaf('watch', async () => {
    await runner.npxExec('jest', [], [{ option: '--watch' }]);
  });
  leaf('cov', async () => {
    await runner.npxExec('jest', [], [{ option: '--coverage' }]);
  });
  leaf('debug', async () => {
    await runner.exec(
      'node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand',
    );
  });
  leaf('e2e', async () => {
    await runner.npxExec('jest', [], [{ option: '--config', value: './test/jest-e2e.json' }]);
  });
});
