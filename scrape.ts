/**
 * Hi nosy parker! This internal file has nothing to do with the exercises.
 */

import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const ROOT = 'github.com/m-thompson-code/advanced-typescript-workshop/tree/main';
const COMPLEXITIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const TAGS = [
  'conditional-types',
  'index-accessed',
  'template-literals',
  'learning-generics',
  'learning-arrays',
  'generics-with-constraints',
  'utility-types',
  'mapped-types',
  'key-remapping',
  'infer',
  'distribution',
  'recursion',
] as const;

const TITLE_CASE_OVERRIDES = {
  To: 'to',
  By: 'by',
  Of: 'of',
  With: 'with',
  In: 'in',
  Bem: 'BEM',
  Css: 'CSS',
} as const;

const TITLE_CASE_REPLACES = {
  'Starts with': 'StartsWith',
  'Non Empty': 'Non-empty',
  'Any of': 'Any Of',
} as const;

type Complexity = (typeof COMPLEXITIES)[number];
type Tag = (typeof TAGS)[number];

const getExerciseFilename = (filepath: string) => {
  // Remove path and file extension
  const filename = (filepath.split('/').at(-1) as string).split('.')[0].toLowerCase();

  return filename;
};

const getExerciseName = (filepath: string) => {
  // Remove path and file extension
  const filename = getExerciseFilename(filepath);

  let titleCaseFileName = filename
    .replace(/(?:^|[\s-/])\w/g, function (match) {
      return match.toUpperCase();
    })
    .split('-')
    .map((part) => TITLE_CASE_OVERRIDES[part as keyof typeof TITLE_CASE_OVERRIDES] ?? part)
    .join(' ');

  // TODO: Non Empty
  Object.entries(TITLE_CASE_REPLACES).forEach(([original, replace]) => {
    titleCaseFileName = titleCaseFileName.replaceAll(original, replace);
  });

  if (titleCaseFileName === 'if') {
    return 'If';
  }

  // Remove file extension
  return titleCaseFileName;
};

const getUrl = (filepath: string) => {
  return `https://${join(ROOT, filepath)}`;
};

const getComplexity = (file: string) => {
  const rawComplexity = file.split('\n').find((line) => line.startsWith('// complexity:'));

  if (!rawComplexity) {
    throw new Error('Unexpected missing complexity');
  }

  const complexity = Number(rawComplexity.slice('// complexity:'.length).trim());

  if (!COMPLEXITIES.includes(complexity as Complexity)) {
    throw new Error(`Unexpected invalid complexity: ${complexity}`);
  }

  return complexity as Complexity;
};

const getTags = (file: string) => {
  const rawTags = file.split('\n').find((line) => line.startsWith('// tags:'));

  if (!rawTags) {
    throw new Error('Unexpected missing tags');
  }

  const tags = rawTags
    .slice('// tags:'.length)
    .split(',')
    .map((tag) => tag.trim());

  const difficulties = rawTags
    .slice('// complexity:'.length)
    .split(',')
    .map((tag) => tag.trim());

  const unknownTag = tags.find((tag) => !TAGS.includes(tag as Tag));

  if (unknownTag) {
    throw new Error(`Unexpected invalid unknownTag: ${unknownTag}`);
  }

  return tags.sort() as Tag[];
};

const main = async () => {
  const filepaths = await glob(['./src/exercises/*.ts'], {
    nodir: true,
  });

  const entries = (
    await Promise.all(
      filepaths.map((filepath) =>
        readFile(filepath, { encoding: 'utf8' }).then((file) => {
          try {
            return {
              filepath,
              url: getUrl(filepath),
              complexity: getComplexity(file),
              tags: getTags(file),
              filename: getExerciseFilename(filepath),
              exercise: getExerciseName(filepath),
            };
          } catch (e) {
            console.error(`Unexpected issue with file at ${filepath}`);
            throw e;
          }
        }),
      ),
    )
  ).sort((a, b) => a.exercise.localeCompare(b.exercise));

  const tagCounts = TAGS.reduce(
    (acc, tag) => {
      acc[tag] = 0;
      return acc;
    },
    {} as Record<Tag, number>,
  );

  entries.forEach(({ tags }) => {
    tags.forEach((tag) => (tagCounts[tag] += 1));
  });

  const complexityCounts = COMPLEXITIES.reduce(
    (acc, complexity) => {
      acc[complexity] = 0;
      return acc;
    },
    {} as Record<Complexity, number>,
  );

  entries.forEach(({ complexity }) => {
    complexityCounts[complexity] += 1;
  });

  const output = {
    entries,
    tags: TAGS,
    difficulties: COMPLEXITIES,
    tagCounts,
    complexityCounts,
  };

  console.log(output);

  await writeFile('output.json', JSON.stringify(output, null, 2));
};

main();
