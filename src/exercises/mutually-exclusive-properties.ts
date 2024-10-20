import { Equal, Expect } from 'type-testing';

// difficulty: medium
// tags: mapped-types, index-accessed

/**
 * Update `MutuallyExclusive` so that it unions an separate object type for
 * every property of a single object.
 */

interface Attributes {
  id: string;
  email: string;
  username: string;
}

type MutuallyExclusive<T> = unknown;

type ExclusiveAttributes = MutuallyExclusive<Attributes>;

type cases = [
  Expect<
    Equal<
      ExclusiveAttributes,
      | {
          id: string;
        }
      | {
          email: string;
        }
      | {
          username: string;
        }
    >
  >,
];
