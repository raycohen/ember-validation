import Ember from 'ember';
import setupValidations from 'ember-validation/setup-validations';

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
    let errorsObject = setupValidations(this, validations);
    this.set('errors', errorsObject);
  },

  age: '12',
  parsedAge: computed('age', function() {
    return parseInt(this.get('age'), 10);
  }),
  name: ''
});
