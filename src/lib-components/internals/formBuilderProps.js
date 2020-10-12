import propValidation from './formBuilderPropValidations'
export default {
  formElements: {
    type: Array,
    required: true,
    validator: propValidation.formElements
  },
  errors: {
    type: Object,
    required: false
  },
  incommingObject: {
    type: Object,
    required: false
  },
  color: {
    type: String,
    default: 'primary'
  },
  submit: {
    type: Object,
    required: false,
    default: function() {
      return {
        text: '$submit',
        color: 'success'
      }
    },
    validator: propValidation.submit
  },
  useCancel: {
    type: Boolean,
    default: true
  },
  cancel: {
    type: Object,
    required: false,
    default: function() {
      return {
        text: '$cancel',
        color: 'warning'
      }
    },
    validator: propValidation.cancel
  },
  additionalValidation: {
    type: Function,
    required: false
  },
  clearableInputs: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: true
  },
  submitOnEnter: {
    type: Boolean,
    default: true
  },
  submitOnLoad: {
    type: Boolean,
    default: false
  },
  inline: {
    type: Boolean,
    default: false
  }
}
