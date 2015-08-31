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

export default Ember.Object.extend({
  // validatee - the object with properties that need validating

  init() {
    this._super();

    assert(`You must provide a validatee`, this.validatee);
    assert(`You must provide validations`, this.validations);

    this._validationKeys = [];

    let errors = Ember.Object.create({
      _validatee: this.validatee
    });
    this.set('errors', errors);

    this._defineValidationProperties(this.validatee, errors, this.validations);
    this._defineIsValid();
  },

  _defineValidationProperties(validatee, errors, validations) {
    for (let key in validations) {
      assert(`Validation must only be on top-level properties. You passed ${key}`, key.indexOf('.') === -1);

      this._validationKeys.push(key);

      defineProperty(
        errors,
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
  },

  _defineIsValid() {
    let dependencyKeys = this._validationKeys.map(function(key) {
      return `errors.${key}`;
    });

    let allEmpty = function() {
      let result = true;
      let self = this;
      dependencyKeys.forEach(function(dep) {
        if (!isEmpty(self.get(dep))) {
          result = false;
        }
      });
      return result;
    };

    let computedArgs = dependencyKeys.concat([allEmpty]);

    defineProperty(
      this,
      'isValid',
      computed.apply(null, computedArgs)
    );
  }
});
