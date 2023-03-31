const { leaf, branch, runner } = require('scriptease-cli');

branch('db', () => {
  branch('dev', () => {
    leaf('rm', async () => {
      await runner.exec('docker compose -f docker-compose.mongo.yml rm mongo-dev-db -s -f -v');
    });
    leaf('up', async () => {
      await runner.exec('docker compose -f docker-compose.mongo.yml up mongo-dev-db -d');
    });
    leaf('restart', async () => {
      await runner.runAllIgnoreFailure(['db:dev:rm', 'db:dev:up']);
    });
  });
});

branch('deploy', () => {
  branch('dev', () => {
    leaf('rm', async () => {
      await runner.exec('docker compose -f docker-compose.dev.yml rm -s -f -v');
    });
    leaf('up', async () => {
      await runner.exec('docker compose -f docker-compose.dev.yml up -d');
    });
    leaf('restart', async () => {
      await runner.runAllIgnoreFailure(['deploy:dev:rm', 'deploy:dev:up']);
    });
  });
});
