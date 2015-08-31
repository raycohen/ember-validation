import Ember from 'ember';
import ValidationMixin from 'ember-validation/mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | validation mixin');

const ageValidations = {
  age: {
    numericality: {
      greaterThan: 13
    }
  }
};

test('mixing in to an object that fails validation', function(assert) {
  const ValidationMixinObject = Ember.Object.extend(ValidationMixin, {
    age: 12,
    validations: ageValidations
  });
  let subject = ValidationMixinObject.create();
  assert.equal(subject.get('isValid'), false, 'subject fails validations');
});

test('mixing in to an object that passes validation', function(assert) {
  const ValidationMixinObject = Ember.Object.extend(ValidationMixin, {
    age: 30,
    validations: ageValidations
  });
  let subject = ValidationMixinObject.create();
  assert.equal(subject.get('isValid'), true, 'subject passes validations');
});
