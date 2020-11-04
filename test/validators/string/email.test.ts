import { email } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('email validator', () => {
  const context = { component: {}, path: '' };
  const validator = email();


  it('should be instance of Validator', () => {
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    const addresses = [
      '!@mydomain.net',
      'test+mysite@a.com',
      'address.test@example.com',
      '"test"@example.com',
      'multiple@domain.parts.com',
      'multiple@domain.parts.co.uk',
      'email@example.com',
      'firstname.lastname@example.com',
      'email@subdomain.example.com',
      'firstname+lastname@example.com',
      'email@[123.123.123.123]',
      '"email"@example.com',
      '1234567890@example.com',
      'email@example-one.com',
      '_______@example.com',
      'email@example.name',
      'email@example.museum',
      'email@example.co.jp',
      'firstname-lastname@example.com'
    ];

    for (const address of addresses) {
      expect(validator.hasError(address, context)).to.equal(false);

    }
  });

  it('should be KO', () => {
    const addresses = [
      null,
      undefined,
      '',
      'plainaddress',
      '#@%^%#$@#$@#.com',
      '@example.com',
      'Joe Smith <email@example.com>',
      'email.example.com',
      'email@example@example.com',
      '.email@example.com',
      'email.@example.com',
      'email..email@example.com',
      'email@111.222.333.44444',
      'email@example..com',
      'Abc..123@example.com'
    ];

    for (const address of addresses) {
      expect(validator.isValid(address, context)).to.equal(false);

    }
  });
});