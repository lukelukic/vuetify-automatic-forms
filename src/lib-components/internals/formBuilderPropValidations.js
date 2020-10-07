function errorHandler(propValue, fn) {
  let errors = []

  fn(propValue, errors)

  errors.forEach(e => {
    if (e.isWarning) {
      console.warn(e.error)
    } else {
      throw new Error(e.error)
    }
  })

  return errors.filter(x => !x.isWarning).length === 0
}

function formElements(propValue, errors) {
  propValue.forEach(x => {
    if (!x.key) {
      errors.push({
        error:
          "Each object of formElements array must have defined 'key' property."
      })
    }
  })

  return errors
}

function cancel(propValue, errors) {
  if (!propValue.text) {
    errors.push({
      isWarning: true,
      error: "Prop 'cancel' should have defined 'text' property."
    })
  }

  if (!propValue.color) {
    errors.push({
      isWarning: true,
      error:
        "Prop 'cancel' should have defined 'color' property. Using white..."
    })
  }
}

function submit(propValue, errors) {
  if (!propValue.text) {
    errors.push({
      isWarning: true,
      error: "Prop 'submit' should have defined 'text' property."
    })
  }

  if (!propValue.color) {
    errors.push({
      isWarning: true,
      error:
        "Prop 'submit' should have defined 'color' property. Using white..."
    })
  }
}

export default {
  formElements: prop => errorHandler(prop, formElements),
  cancel: prop => errorHandler(prop, cancel),
  submit: prop => errorHandler(prop, submit)
}
