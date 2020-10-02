# Form Validation Manager - fvm

![Test](https://img.shields.io/badge/Tests-82/82-green.svg)
![Coverage](https://img.shields.io/badge/Coverage-85%-green.svg)
![Dependencies-0](https://img.shields.io/badge/Dependencies-0-green.svg)
![Typescript](https://img.shields.io/badge/Made%20with-Typescript-1f425f.svg)
![LGPL3](https://img.shields.io/badge/Licence-LGPL%20V3-aa8800.svg)

### Simple, lightweight model-based validation for Vue.js

> Inpired by vuelidate
>> This plugin usage is very similar of vuelidate
>
> Why a new plugin ?
>> Instead of vuelidate this one allow fine error report and custom messages\
>> and a better integreation in templates

* Model based
* Decoupled from templates
* Minimalistic library
* No dependencies
* Support for collection validations
* Support for nested models
* Contextified validators
* Easy to use with custom validators (e.g. Moment.js)
* Easy errors messages customisation

> **_Summary_**
> * [Installation](#installation)
> * [Basic usage](#basic-usage)
> * [Validators](#validtors)
> * [Arrays](#arrays)
> * [Messages](#messages)
> * [Custom validation](#custom-validation)
> * [Async validation](#async-validation)
> * [Integration with vuetify](#integration-with-vuetify)

## Installation

```shell
npm install form-validation-manager --save
```

Import the library and use as a Vue plugin to enable the functionality globally on all components containing validation configuration.

```ts
import Vue from 'vue'
import Fvm from 'form-validaiton-manager'
Vue.use(Fvm)
```

Optional : you can customise the validations property name :\
_default = 'validations'_
```ts
Vue.use(Fvm, {validationsPropertyName:'myValidationsProperty'})
```

## Basic usage

```ts
import { and, required, numeric, gte, length } from 'form-validation-manager'

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
      name: and(required(), length(gte(3))),
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
a validation oject is generated with the same tree as 'validations'

```ts
//generated object
//$fvm
{
  $errors:String[],
  $error:Boolean,
  $isValid:Boolean,
  $invalid:Boolean,
  $dirty:Boolean,
  $pristine:Boolean,
  $pending:Boolean,
  form:{
    $errors:String[],
    $error:Boolean,
    $isValid:Boolean,
    $invalid:Boolean,
    $dirty:Boolean,
    $pristine:Boolean,
    $pending:Boolean,
    name:{
      $errors:String[],
      $error:Boolean,
      [...]
    },
    age:{
      $errors:String[],
      $error:Boolean,
      [...]
    }
  }
}
```
* _$errors_ : 
  *  string[]
  *  For each 'non-final' node : $errors Array concatenate $errors of sub nodes
*  _$error_ : node (or sub nodes) has one or more errors
*  _$isvalid_ : node (or sub nodes) as no errors
*  _$invalid_ : node (or sub nodes) has one or more errors
*  _$dirty_ : node (or sub nodes) have been edited by user
*  _$pristine_ : node (or sub nodes) have not been edited by user
*  _$pending_ : node (or sub nodes) wait for an async validation result


## Validators
### values validation
```ts
// generic validators
required()
eq(value) // equal

// number validators
numeric() // is numeric
gt(min) // greater than >
gte(min) // greather than equal >=
lt(max) // less than <
lte(max) // less than equal <=
between(min,max[,exclude])

// string validators
isString()
regexp(expr:RegExp)
includes(str:String)
isDate(format:String='yyyy-MM-dd') // value must be a string date
```

### logic
```ts
and(...validators) // all validators must be ok
andSequence(...validators) // all validators must be ok, call next validator only if previous one is OK
or(...validators) // minimum one validtor must be ok
xor(...validators) // only one validator must be ok
_if(condition:(value,context)=>Boolean, validator) // apply validator only if condition returned value is true
not(validator) // validator must be KO
```
  
### specials
```ts
pick(property, validator) // validate value[property] instead of value itself
length(validator) // pick length
withMessage(validator,message) // customise validator message
empty() // always ok validator
custom((value, context)=>Boolean|String|String[]) // allow user to create custom validators
async((value, context)=>Promise<Boolean|String|String[]>, forceRenderUpdateAuto=true) // allow user to create custom async validators
revalidate(...paths) // force properties revalidation if this one change
// exmple with previous code : revalidate('form.name')
```

## Arrays

A special node '$each' allow to validate each elements of an array

```ts
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

## Messages
withMessage wrapper allow to customise error message

```ts
export default {
  data () {
    return {
      form:{
        age: 0
      }
    }
  },
  validations: {
    form:{
      age: and(
        withMessage(
          and(required(), numeric()),
          'field is required and must be a number'
        ),
        withMessage(
          gte(21),
          'you must be of age'
        )
      )
    }
  }
}
```
the property '$errors' will contain defined errors messages if field isnt valid.

## Custom validation
### component method
a custom method can be used as validator.\
inside this one, 'this' refer to current component

```ts
export default {
  data () {
    return {
      form:{
        age: 0
      }
    }
  },
  validations: {
    form:{
      age: custom(function(value, context){ //do not use arrow function if you want to use 'this'
        return this.myValidationMethod(value, context);
      })
    }
  },
  methods:{
    myValidationMethod(){
      // ...
    }
  }
}
```
myValidationMethod must return false if no error and true|string|string[] if one or more errors occured

### Reusable validator
You may want to define a validator and use it in ndifferent components\
best way is to define it in separate .js file
```ts
import { Validator } from 'form-validation-manager';

export default function myValidator(arg1, arg2) {
  return new Validator('myValidator', (value:any, context:Context) => {
      if( /* test rule 1 KO */){
        return 'message 1'
      }
      if( /* test rule 2 KO */){
        return 'message 2'
      }

      // is valid
      return false
  });
}
```
and use it

```ts
import myValidator from './my-validator'

export default {
  data () {
    return {
      form:{
        age: 0
      }
    }
  },
  validations: {
    form:{
      age: myValidator('val1', 'val2')
    }
  }
}
```

## Async validation

```ts
export default {
  data () {
    return {
      form:{
        age: 0
      }
    }
  },
  validations: {
    form:{
      age: async(function(value, context){
        return Promise(resolve=>{
          // async stuf
          resolve(myValidationResult)
        })
      })
    }
  },
}
```


## Integration with vuetify
```ts
export default {
  data () {
    return {
      form:{
        age: 0
      }
    }
  },
  validations: {
    form:{
      age: and(
        withMessage(
          and(required(), numeric()),
          'age is required and must be a number'
        ),
        withMessage(
          gte(21),
          'you must be of age'
        )
      )
    }
  }
}
```

```html
<v-text-field
  :rules="$fvm.form.age.$errors"
/>
```