import Ember from 'ember';
import Validation from 'ember-validation';

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
    let validation = Validation.create({
      validatee: this,
      validations
    });
    this.set('validation', validation);
  },

  isValid: computed.readOnly('validation.isValid'),
  errors: computed.readOnly('validation.errors'),

  age: '12',
  parsedAge: computed('age', function() {
    return parseInt(this.get('age'), 10);
  }),
  name: ''
});
