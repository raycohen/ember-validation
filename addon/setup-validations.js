import Ember from 'ember';

const {
  assert,
  computed,
  defineProperty,
  isEmpty
} = Ember;

function defineIsValid(validationPack, errors) {
  let keys = Ember.A(Object.keys(errors)).without('_validatee').toArray();
  let deps = keys.map(function(key) {
    return `errors.${key}`;
  });

  let allEmpty = function() {
    let result = true;
    let self = this;
    deps.forEach(function(dep) {
      if (!isEmpty(self.get(dep))) {
        result = false;
      }
    });
    return result;
  };

  let computedArgs = deps.concat([allEmpty]);

  defineProperty(
    validationPack,
    'isValid',
    computed.apply(computed, computedArgs)
  );
}

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

export default function setupValidation(validatee, validations) {
  let errors = Ember.Object.create({
    _validatee: validatee
  });
  defineValidationProperties(validatee, errors, validations);

  let validationPack = Ember.Object.create({ errors });
  defineIsValid(validationPack, errors);

  return validationPack;
}
