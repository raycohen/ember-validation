import { module, test } from 'qunit';
import Validation from 'ember-validation';
import Ember from 'ember';

module('validation', 'Unit | Validation');

const ageValidations = {
  age: {
    numericality: {
      greaterThan: 13
    }
  }
};

test('validation that isValid', function(assert) {
  let model = Ember.Object.create({
    age: 30
  });

  let validation = Validation.create({
    validatee: model,
    validations: ageValidations
  });

  assert.equal(validation.get('isValid'), true, 'validation passes');
});

test('validation that is not isValid', function(assert) {
  let model = Ember.Object.create({
    age: 12
  });

  let validation = Validation.create({
    validatee: model,
    validations: ageValidations
  });

  assert.equal(validation.get('isValid'), false, 'validation failed');
});
