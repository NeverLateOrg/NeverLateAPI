const { leaf, branch, runner } = require('scriptease-cli');

branch('db', () => {
  branch('dev', () => {
    leaf('rm', async () => {
      await runner.exec('docker compose rm mongo-dev-db -s -f -v');
    });
    leaf('up', async () => {
      await runner.exec('docker compose up mongo-dev-db -d');
    });
    leaf('restart', async () => {
      await runner.runAllIgnoreFailure(['db:dev:rm', 'db:dev:up']);
    });
  });
});
