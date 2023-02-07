import andSequence from '../logic/and_sequence';
import or from '../logic/or';
import required from '../required';
import { Validator } from '../validator';
import isString from './is-string';

const m = '[1-5][0-9]|[0-9]';
const mm = '[1-5][0-9]|0[0-9]';
const hh = '1[0-2]|0[0-9]'

const parts: { [key: string]: string } = { //order matters (sort by reverse key length for each char)
  'dd': '3[01]|[12][0-9]|0[1-9]', //day 01-31
  'd': '3[01]|[12][0-9]|[0-9]', //day 1-31
  'MM': '1[0-2]|0[1-9]', //month 01-12
  'M': '1[0-2]|[1-9]', //month 1-12
  'yyyy': '[0-9]{4}', //years ####
  'yy': '[0-9]{2}', //year ##
  'A': 'AM|PM',
  'aa': 'a.m.|p.m.',
  'a': 'am|pm',
  'HH': "2[0-3]|[10][0-9]", //hours 00-23
  'H': "2[0-3]|1?[0-9]", //hour 0-23
  'hh': hh, //hours 00-12
  'h': "1[0-2]|[0-9]", //hour 0-12
  'mm': mm, //minutes 00-59
  'm': m, //minutes 0-59
  'sss': '[0-9]{3}', //millisecond 000-999
  'ss': mm, //second 00-59
  's': m, //second 0-59
  'SSS': '[0-9]{3}', //millisecond 000-999
  'SS': '[0-9]{2}', //1/100 of second 00-99
  'S': '[0-9]', //1/10 of second 0-9
  'ZZ': '[+-](?:' + hh + ')(?:' + mm + ')', //timezone (+-)0000 (+-)1259
  'Z': '[+-](?:' + hh + '):(?:' + mm + ')',//timezone (+-)00:00 (+-)12:59
  'X': '[0-9]{9}', //timestamp
  'x': '[0-9]{12}' //timestamp millisecond
}

var specials = [
  // order matters for these
  "-"
  , "["
  , "]"
  // order doesn't matter for any of these
  , "/"
  , "{"
  , "}"
  , "("
  , ")"
  , "*"
  , "+"
  , "?"
  , "."
  , "\\"
  , "^"
  , "$"
  , "|"
]

const specialsRegexp = RegExp('[' + specials.join('\\') + ']', 'g')

function escapeRegExp (str: string) {
  return str.replace(specialsRegexp, "\\$&");
};

function dateValidation (str: string, format: string) {
  format = escapeRegExp(format);

  for (const key in parts) {
    format = format.replace(new RegExp(key, 'g'), '(' + parts[key] + ')');
  }

  return new RegExp(format).test(str);
}


/**
 *
 * @param format date format \
 * \
 * ISO8601 exemple : "yyyy-MM-ddTHH:mm:ss.SSSZ"
 * String : "1900-01-01T16:00:00.000+02:00"\
 * \
 * yyyy : years 0000-9999\
 * yy years : 00-99\
 * MM : month 00-12\
 * M : month 0-12\
 * dd : day 00-31\
 * d : day 0-31\
 * HH : hour 00-23\
 * H hour 0-23\
 * hh : hour 00-12\
 * h hour 0-12\
 * mm : minutes 00-59\
 * m : minutes 0-59\
 * ss : seconds 00-59\
 * s : seconds 0-59\
 * S : 1/10 second\
 * SS : 1/100 second\
 * SSS : millisecond\
 * sss : millisecond\
 * Z : timezone +00:00\
 * ZZ : timezone +0000\
 * X : timestamp\
 * x : timestamp millisecond
 *
 */
export default function isDate (format: string = "yyyy-MM-dd") {
  return Validator.fromSubValidators('isDate',
    andSequence(
      required(),
      or(
        new Validator('isDateIntance', value => !(value instanceof Date)),
        andSequence(
          isString(),
          new Validator('isDateString', value => !dateValidation(value, format))
        )
      )
    )
  );
}
