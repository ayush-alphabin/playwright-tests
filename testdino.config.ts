export default {
  token: process.env.TESTDINO_TOKEN,
  serverUrl: process.env.TESTDINO_SERVER_URL || 'https://stg-api.testdino.com',
  debug: true,
  artifacts: true,
  coverage: {
    enabled: true,
  },
};
