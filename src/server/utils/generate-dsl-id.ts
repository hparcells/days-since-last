import { idExists } from '../database';

export default async function generateDslId() {
  let number;
  do {
    number = Number(String(Math.floor(Math.random() * 10000000000)).padEnd(10, '0'));
  } while (await idExists(number));

  return number;
}
