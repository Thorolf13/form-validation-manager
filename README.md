# Form Validation Manager - fvm

### Simple, lightweight model-based validation for Vue.js

> Inpired by vuelidate
>> This plugin usage is very similar of vuelidate
>
> Why a new plugin ?
>> Instead of vuelidate this one allow fine error report and custom messages

* Model based
* Decoupled from templates
* Minimalistic library
* Support for collection validations
* Support for nested models
* Contextified validators
* Easy to use with custom validators (e.g. Moment.js)
* Easy errors messages customisation

## Instalation

```shell
npm install form-validation-manager --save
```

Import the library and use as a Vue plugin to enable the functionality globally on all components containing validation configuration.

```js
import Vue from 'vue'
import Fvm from 'form-validaiton-manager'
Vue.use(Fvm)
```

Optional : you can customise the validations property name :
```js
Vue.use(Fvm, {validationsPropertyName:'myValidationsProperty'})
```

## Basic usage

import { and, required, numeric, gte, length } from 'form-validation-manager'

```js
export default {
  data () {
    return {
      form:{
        name: '',
        age: 0
      }
    }
  },
  validations: {
    form:{
      name: and(required(), length(gte(3)),
      age: and(required(), numeric(), gte(21))
    }
  },
  methods:{
    submit(){
      if(this.$fvm.$isValid){
        //do something
      }
    }
  }
}
```
a validation oject is generated witrh the same tree as 'validations'

```js
//generated object
//$fvm
{
  $errors:Boolean|String[],
  $error:Boolean,
  $isValid:Boolean,
  $invalid:Boolean,
  $dirty:Boolean,
  $pristine:Boolean,
  form:{
    $errors:Boolean|String[],
    $error:Boolean,
    [...]
    name:{
      $errors:Boolean|String[],
      $error:Boolean,
      [...]
    },
    age:{
      $errors:Boolean|String[],
      $error:Boolean,
      [...]
    }
  }
}
```
* _$errors_ : 
  *  = false or string[]
  *  For each 'non-final' node $errors Array concatenate $errors of sub nodes
*  _$error_ : node (or sub nodes) has one or more errors
*  _$isvalid_ : node (or sub nodes) as no errors
*  _$invalid_ : node (or sub nodes) has one or more errors
*  _$dirty_ : : node (or sub nodes) have been edited by user
*  _$pristine : : node (or sub nodes) have not been edited by user


## Validtors
### values validation
```js
required()
eq(value)
numeric()
gt(min)
gte(min)
lt(max)
lte(max)
between(min,max[,exclude])
```

### logic
```js
and(...validators)
or(...validators)
xor(...validators)
_if(condition:Boolean|(value,context):Boolean=>{}, validator)
not(validator)
```
  
### specials
```js
pick(property, validator) // validate value[property] instead of value itself
length(validator) // pick length
withMessage(validator,message) // customise validator message
dynamic((value, context):Validator=>{}) // dynamic validators definition
empty() // always ok validator
custom((value, context):Boolean|String=>{}) // allow user to create custom validators
revalidate(path) // forcxe another property revalidation if this one change
```

## Arrays

A special node '$each' allow to validate each elements of an array

```js
export default {
  data () {
    return {
      form:{
        list : [-1, 5, 10]
      }
    }
  },
  validations: {
    form:{
      list:{
        $each : {
          gt(0)
        }
      }
    }
  }
}
```