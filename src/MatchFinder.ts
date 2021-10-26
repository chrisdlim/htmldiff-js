import { MatchOptions } from ".";
import Match from "./Match";
import * as Utils from "./Utils";

const putNewWord = (
  block: string[],
  word: string,
  blockSize: number
): string | null => {
  block.push(word);

  if (block.length > blockSize) {
    block.shift();
  }

  if (block.length !== blockSize) {
    return null;
  }

  return block.join("");
};

// Converts the word to index-friendly value so it can be compared with other similar words

const normalizeForIndex = (
  word: string,
  ignoreWhiteSpaceDifferences: boolean
): string => {
  word = Utils.stripAnyAttributes(word);
  if (ignoreWhiteSpaceDifferences && Utils.isWhiteSpace(word)) {
    return " ";
  }

  return word;
};

const indexNewWords = (
  newWords: readonly string[],
  startIndex: number,
  endIndex: number,
  options: MatchOptions
): Map<string, number[]> => {
  const wordIndices = new Map<string, number[]>();
  const block: string[] = [];
  for (let i = startIndex; i < endIndex; i++) {
    // if word is a tag, we should ignore attributes as attribute changes are not supported (yet)
    const word = normalizeForIndex(
      newWords[i],
      options.ignoreWhiteSpaceDifferences
    );
    const key = putNewWord(block, word, options.blockSize);

    if (key === null) {
      continue;
    }

    if (wordIndices.has(key)) {
      wordIndices.get(key)?.push(i);
    } else {
      wordIndices.set(key, [i]);
    }
  }

  return wordIndices;
};

export const findMatch = (
  oldWords: readonly string[],
  newWords: readonly string[],
  startInOld: number,
  endInOld: number,
  startInNew: number,
  endInNew: number,
  options: MatchOptions
): Match | null => {
  const wordIndices = indexNewWords(newWords, startInNew, endInNew, options);

  if (wordIndices.size === 0) {
    return null;
  }

  let bestMatchInOld = startInOld;
  let bestMatchInNew = startInNew;
  let bestMatchSize = 0;

  let matchLengthAt = new Map<number, number>();
  const blockSize = options.blockSize;
  const block: string[] = [];

  for (let indexInOld = startInOld; indexInOld < endInOld; indexInOld++) {
    const word = normalizeForIndex(
      oldWords[indexInOld],
      options.ignoreWhiteSpaceDifferences
    );
    const index = putNewWord(block, word, blockSize);

    if (index === null) {
      continue;
    }

    const newMatchLengthAt = new Map<number, number>();

    if (!wordIndices.has(index)) {
      matchLengthAt = newMatchLengthAt;
      continue;
    }

    const indices = wordIndices.get(index) ?? [];

    for (const indexInNew of indices) {
      const newMatchLength = (matchLengthAt.get(indexInNew - 1) ?? 0) + 1;
      newMatchLengthAt.set(indexInNew, newMatchLength);

      if (newMatchLength > bestMatchSize) {
        bestMatchInOld = indexInOld - newMatchLength - blockSize + 2;
        bestMatchInNew = indexInNew - newMatchLength - blockSize + 2;
        bestMatchSize = newMatchLength;
      }
    }

    matchLengthAt = newMatchLengthAt;
  }

  const matchSize = bestMatchSize + blockSize - 1;
  return bestMatchSize !== 0
    ? {
        startInOld: bestMatchInOld,
        startInNew: bestMatchInNew,
        endInOld: bestMatchInOld + matchSize,
        endInNew: bestMatchInNew + matchSize,
        size: matchSize,
      }
    : null;
};
