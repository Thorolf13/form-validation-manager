import { isDate } from "../../../src";
import { Validator } from "../../../src/validators/validator";

import { describe, it } from "mocha"
import { expect } from "chai";


describe('is-date validator', () => {
  const context = { component: {}, path: '', value: null };


  it('should be instance of Validator', () => {
    const validator = isDate();
    expect(validator instanceof Validator).to.equal(true)
  })

  it('should be OK', () => {
    expect(isDate().hasError('1900-01-01', context)).to.equal(false);
    expect(isDate().hasError('1900-12-31', context)).to.equal(false);
    expect(isDate('dd/MM/yyyy').hasError('31/12/2020', context)).to.equal(false);
    expect(isDate('yyyy-MM-ddTHH:mm:ss.SSSZ').hasError('1900-01-01T16:55:01.000+02:00', context)).to.equal(false);
    expect(isDate('yyyy-MM-ddTHH:mm:ss.SSSZZ').hasError('1900-01-01T16:55:01.000+0200', context)).to.equal(false);
    expect(isDate().hasError(new Date(), context)).to.equal(false);
  });

  it('should manage special chars', () => {
    expect(isDate('[yyyy-MM-dd]$HH:mm:ss$SSSZZ^').hasError('[1900-01-01]$16:55:01$000+0200^', context)).to.equal(false);
    expect(isDate('[yyyy-MM-dd]$HH:mm:ss$SSSZZ^').hasError('[1900-01-01$[16:55:01$000+0200^', context)).to.not.equal(false);
  });

  it('should be KO', () => {
    expect(isDate().hasError('1900-13-01', context)).to.not.equal(false);
    expect(isDate().hasError('1900-12-32', context)).to.not.equal(false);
    expect(isDate().hasError('99-12-32', context)).to.not.equal(false);
    expect(isDate('dd/MM/yyyy').hasError('1900-01-10', context)).to.not.equal(false);
    expect(isDate('yyyy-MM-ddTHH:mm:ss.SSSZ').hasError('1900-01-01 16:55:01.000+02:00', context)).to.not.equal(false);
    expect(isDate('yyyy-MM-ddTHH:mm:ss.SSSZ').hasError('1900-01-01T16:55:01.00+02:00', context)).to.not.equal(false);
    expect(isDate('yyyy-MM-ddTHH:mm:ss.SSSZ').hasError('1900-01-01T16:55:01.000+13:00', context)).to.not.equal(false);
    expect(isDate('yyyy-MM-ddTHH:mm:ss.SSSZ').hasError('1900-01-01T16:55:01.000+0200', context)).to.not.equal(false);
    expect(isDate('yyyy-MM-ddThh:mm:ss.SSSZ').hasError('1900-01-01T16:55:01.000+02:00', context)).to.not.equal(false);
  });
});
