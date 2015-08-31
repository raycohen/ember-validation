import Ember from 'ember';
import Validation from 'ember-validation';

const {
  computed
} = Ember;

/*
 * The ValidationMixin creates a Validation object
 * when the host object is initialized. It uses the host
 * as the validatee and gets the validation rules
 * from the host's `validations` property
 *
 * In cases where you want more control,
 * create a Validation obect yourself and make your own
 * computed aliases to the `errors` and `isValid`.
 *
 * Potential reasons not to use the mixin include:
 *   - your object already has `errors` or `isValid` defined
 *     and you don't want to overwrite them (such as a DS.Model)
 *   - you don't want to start running validations right away
 *   - you want multiple validations objects managed by the same host
 */
export default Ember.Mixin.create({
  init() {
    this._super(...arguments);
    this.setupValidation();
  },

  setupValidation() {
    this.set('validation', Validation.create({
      validatee: this,
      validations: this.get('validations')
    }));
  },

  isValid: computed.readOnly('validation.isValid'),
  errors: computed.readOnly('validation.errors')
});
