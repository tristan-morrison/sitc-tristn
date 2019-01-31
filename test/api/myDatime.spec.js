import test from 'ava';
import myDatetime from './../../src/api/myDatetime';
import { TIME } from './../../src/constants';

test('My First Test', t => {
  const timeInDetroit = myDatetime.getTimeInDetroit();
  const pst = new Date();
  pst.setHours(pst.getHours() + 3);
  const timeInDetroitStr = timeInDetroit.getFullYear() + "-" + (timeInDetroit.getMonth() + 1) + "-" + timeInDetroit.getDate() + "  " + timeInDetroit.getHours() + ":" + timeInDetroit.getMinutes();
  const pstStr = pst.getFullYear() + "-" + (pst.getMonth() + 1) + "-" + pst.getDate() + "  " + pst.getHours() + ":" + pst.getMinutes();
  t.is(timeInDetroitStr, pstStr, "Note: test only works in pacific time zone");
})
