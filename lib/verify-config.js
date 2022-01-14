const {isString, isNil, isBoolean, isArray} = require('lodash');
const getError = require('./get-error');

const VALIDATORS = {
  podLint: isBoolean,
  podLintArgs: value => isString(value) || isArray(value),
  podPushArgs: value => isString(value) || isArray(value),
};

module.exports = ({podLint, podLintArgs, podPushArgs}) => {
  const errors = Object.entries({podLint, podLintArgs, podPushArgs}).reduce(
    (errors, [option, value]) =>
      !isNil(value) && !VALIDATORS[option](value)
        ? [...errors, getError(`EINVALID${option.toUpperCase()}`, {[option]: value})]
        : errors,
    []
  );

  return errors;
};
