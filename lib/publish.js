const execa = require('execa');

module.exports = async (pluginConfig, context) => {
  const {
    cwd,
    env,
    stdout,
    stderr,
    nextRelease: {version},
    logger,
  } = context;

  logger.log(`Publishing version ${version} to cocoapods`);

  const additionalArgs = [];

  if (pluginConfig.podPushArgs) {
    if (Array.isArray(pluginConfig.podPushArgs)) {
      additionalArgs.push(...pluginConfig.podPushArgs);
    } else if (typeof pluginConfig.podPushArgs === 'string') {
      additionalArgs.push(pluginConfig.podPushArgs);
    }
  }

  const result = execa('pod', ['trunk', 'push', ...additionalArgs], {cwd, env});
  result.stdout.pipe(stdout, {end: false});
  result.stderr.pipe(stderr, {end: false});
  await result;

  logger.log(`Published ${version} to cocoapods!`);

  return {version};
};
