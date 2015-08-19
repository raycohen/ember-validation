import Ember from 'ember';

const {
  assert,
  computed,
  defineProperty,
  isEmpty
} = Ember;

function errorsForValidationRule(validatee, key, ruleType, validationRules) {
  let errors = [];
  let value = validatee.get(key);

  if (ruleType === 'presence') {
    if (isEmpty(value)) {
      errors.push('is missing');
    }
  }

  if (ruleType === 'numericality') {
    let { greaterThan } = validationRules;
    if (typeof greaterThan === 'number' && value <= greaterThan) {
      errors.push('is too small');
    }
  }

  return errors;
}

function errorsForProperty(validatee, key, validationRules) {
  return function() {
    let errors = [];
    for (let ruleType in validationRules) {
      errors = errors.concat(
        errorsForValidationRule(validatee, key, ruleType, validationRules[ruleType])
      );
    }
    return errors;
  };
}

function defineValidationProperties(validatee, errorsObject, validations) {
  for (let key in validations) {
    console.log(key);
    assert(`Validation must only be on top-level properties. You passed ${key}`, key.indexOf('.') === -1);

    defineProperty(
      errorsObject,
      key,
      computed(
        `_validatee.${key}`,
        errorsForProperty(
          validatee,
          key,
          validations[key]
        )
      )
    );
  }
}

export default function setupValidations(validatee, validations) {
  let errorsObject = Ember.Object.create({
    _validatee: validatee
  });
  defineValidationProperties(validatee, errorsObject, validations);
  return errorsObject;
}
