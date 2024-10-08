// difficulty: easy
// tags: utility-types

import { Equal, Expect } from 'type-testing';

interface Developer {
  name: string;
  skills: string[];
  projects: string[];
  level: 'junior' | 'mid' | 'senior';
  availability: number;
}

interface Manager {
  name: string;
  teamSize: number;
  departments: string[];
  level: 'assistant' | 'associate' | 'senior';
  availability: string;
}

/**
 * Define a type TeamMember that includes the common properties between Developer and Manager, with their types from each interface
 */

type TeamMember = Pick<Developer | Manager, keyof Manager & keyof Developer>;
//   ^?

type cases = [
  Expect<
    Equal<
      TeamMember,
      {
        name: string;
        level: 'junior' | 'mid' | 'senior' | 'assistant' | 'associate' | 'senior';
        availability: string | number;
      }
    >
  >,
];
