const execa = require('execa');
const AggregateError = require('aggregate-error');
const getError = require('./get-error');

module.exports = async (pluginConfig, context) => {
  const {cwd, env, stdout, stderr, logger} = context;

  if (!pluginConfig.podLint) {
    logger.log(`pod lib lint being skipped. Disabled through plugin configuration`);
    return;
  }

  try {
    logger.log(`Running 'pod lib lint' to verify lib ready for publishing.`);

    const additionalArgs = [];

    if (pluginConfig.podLintArgs) {
      if (Array.isArray(pluginConfig.podLintArgs)) {
        additionalArgs.push(...pluginConfig.podLintArgs);
      } else if (typeof pluginConfig.podLintArgs === 'string') {
        additionalArgs.push(pluginConfig.podLintArgs);
      }
    }

    const result = execa('pod', ['lib', 'lint', ...additionalArgs], {cwd, env});
    result.stdout.pipe(stdout, {end: false});
    result.stderr.pipe(stderr, {end: false});
    await result;
  } catch (_) {
    throw new AggregateError([getError('ECLINOTINSTALLED', {})]);
  }
};
