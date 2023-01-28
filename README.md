# beta version of fvm for vue3 (composition api) and vue2

Some bugs may still present, please report them

# Form Validation Manager - fvm

v2.x.x is compatible with vue2, vue3(options api) and vue3(composition api)
v1.x.x is only compatible with vue2

![Test](https://img.shields.io/badge/Tests-95/95-green.svg)
![Coverage](https://img.shields.io/badge/Coverage-90%25-green.svg)
![Dependencies](https://img.shields.io/badge/Dependencies-0-green.svg)
![Typescript](https://img.shields.io/badge/Made%20with-Typescript-blue.svg)
![LGPL3](https://img.shields.io/badge/Licence-LGPL%20V3-yellow.svg)

### Simple, lightweight model-based validation for Vue.js

> Inpired by vuelidate
>> This plugin usage is similar of vuelidate
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
> * [Events](#events)
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
import Fvm from 'form-validation-manager'
Vue.use(Fvm)
```

## Basic usage

### Options API (Vue 2)

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

  validate: ()=>void

  form:{
    $errors:String[],
    $error:Boolean,
    $isValid:Boolean,
    $invalid:Boolean,
    $dirty:Boolean,
    $pristine:Boolean,
    $pending:Boolean,

    validate: ()=>void

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
*  _validate : force validation of node (and sub nodes)

### Composition API

```ts
import { and, required, numeric, gte, length } from 'form-validation-manager'

export default {
  setup () {
  const form = reactive({
    val1: 5
  });

  const validation = useFvm(form, {
    val1: eq(5)
  });

  return { validation, form };
  }
}
```

```ts
//generated object
//validation
{
  $errors:String[],
  $error:Boolean,
  $isValid:Boolean,
  $invalid:Boolean,
  $dirty:Boolean,
  $pristine:Boolean,
  $pending:Boolean,

  validate: ()=>void

  val1:{
    $errors:String[],
    $error:Boolean,
    [...]
  }
}
```

## Specials nodes
```ts
export default {
  data () {
    return {
      form:{
        list:[
          {id:1, value:15}
          {id:2, value:0}
        ],
        parent:{
          child: {
            property:'value'
          }
        }
      }
    }
  },
  validations: {
    form:{
      liste:{
        $each:{
          value:gt(0)
        }
      },
      parent:{
        $self: custom(function()=>{ /* ...*/ }), //validate parent obj
        child:{
          property: regexp(/.../) //validate child's property
        }
      }

    }
  }
}
```

* _$each_ : loop over elements of an array
* _$self_ : allow to validate parent and child nodes

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
email() //is email address
```

### logic
```ts
and(...validators) // all validators must be ok
andSequence(...validators) // all validators must be ok, call next validator only if previous one is OK
or(...validators) // minimum one validtor must be ok
xor(...validators) // only one validator must be ok
_if(condition:(value,context)=>Boolean, thenValidator[, elseValidator])// apply thenValidator only if condition function returned value is true else apply elsevalidator if defined
not(validator) // validator must be KO
optional(validator) //execute validator only if value != null, undefined or ""
```
  
### specials
```ts
pick(property, validator) // validate value[property] instead of value itself
length(validator) // pick length
withMessage(validator,message) // customise validator message
empty() // always ok validator
custom((value, context)=>Boolean|String|String[]) // allow user to create custom validators
async((value, context)=>Promise<Boolean|String|String[]>, forceRenderUpdateAuto=true, debounceTime=0) // allow user to create custom async validators
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
          and(
            gt(0),
            custom(function(value,context){
              // custom validation code
            })
          )
        }
      }
    }
  }
}
```

>Note : using custom validator under `$each` :   
>`context.indexes` contain $each loops indexes. Here :
>```
>{
>  0:<possible values : 0,1,2>,
>  list:n<possible values : 0,1,2>,
>  length:1
>}
>```
>for more details about custom validator, see [Custom validation](##Custom-validation)

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
    myValidationMethod(value, context){
      // ...
    }
  }
}
```
myValidationMethod must return false if no error and true|string|string[] if one or more errors occured
`context` contain properties:
`component` : current component
`path` : current property path (`form.age` here)
optional `indexes` : contain `$each` loops indexes, see [$each](##Arrays) section

### Reusable validator
You may want to define a validator and use it in different components\
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
        return new Promise(resolve=>{
          // async stuf
          resolve(myValidationResult)
        })
      }, debounceTime)
    }
  },
}
```
* _debounceTime: number_ : in ms, optional, default=0, if > 0 debounce calls

Before submiting form, you must wait for $pending == false.\
Exemples :
* In template :
```html
<form>
  <!-- -->
  <button type="submit" :disabled="$form.$pending || $form.$error" @click="submit()">Send</button>
</form>
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