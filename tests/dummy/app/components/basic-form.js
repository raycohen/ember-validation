import Ember from 'ember';
import ValidationPack from 'ember-validation/validation-pack';

const {
  computed
} = Ember;

const validations = {
  parsedAge: {
    numericality: {
      greaterThan: 13
    }
  },
  name: {
    presence: true
  }
};

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    let validationPack = ValidationPack.create({
      validatee: this,
      validations
    });
    this.set('validationPack', validationPack);
  },

  isValid: computed.readOnly('validationPack.isValid'),
  errors: computed.readOnly('validationPack.errors'),

  age: '12',
  parsedAge: computed('age', function() {
    return parseInt(this.get('age'), 10);
  }),
  name: ''
});
