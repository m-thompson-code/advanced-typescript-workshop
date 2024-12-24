import { Expect, Equal } from 'type-testing';

// complexity: 2
// tags: keyof, typeof, index-accessed

// Update `getCarColor` to implement a function that takes a car brand and
// returns the corresponding color from the `carsByBrand` map. The function
// should ensure only valid car brands are accepted

const carsByBrand = {
  Ford: 'blue',
  Audi: 'red',
  Subaru: 'green',
} as const;

declare function getCarColor(brand: string): string;

const audi = getCarColor('Audi');
const ford = getCarColor('Ford');
const subaru = getCarColor('Subaru');

// Most exercises will have cases
type cases = [
  Expect<Equal<typeof audi, 'red'>>,
  Expect<Equal<typeof ford, 'blue'>>,
  Expect<Equal<typeof subaru, 'green'>>,
];

// Some of the function exercises might have expected errors while invoking them

// @ts-expect-error
getCarColor('Ferarri');

// @ts-expect-error
getCarColor('Suzuki');
