import Match from "./Match";
import * as Utils from "./Utils";

function putNewWord(block: string[], word: string, blockSize: number) {
  block.push(word);

  if (block.length > blockSize) {
    block.shift();
  }

  if (block.length !== blockSize) {
    return null;
  }

  return block.join("");
}

// Finds the longest match in given texts. It uses indexing with fixed granularity that is used to compare blocks of text.
export default class MatchFinder {
  oldWords: string[];
  newWords: string[];
  startInOld: number;
  endInOld: number;
  startInNew: number;
  endInNew: number;
  options: {
    blockSize: number;
    ignoreWhiteSpaceDifferences: boolean;
    repeatingWordsAccuracy: number;
  };
  wordIndices: Map<string, number[]> = new Map();

  constructor(
    oldWords: string[],
    newWords: string[],
    startInOld: number,
    endInOld: number,
    startInNew: number,
    endInNew: number,
    options: {
      blockSize: number;
      ignoreWhiteSpaceDifferences: boolean;
      repeatingWordsAccuracy: number;
    }
  ) {
    this.oldWords = oldWords;
    this.newWords = newWords;
    this.startInOld = startInOld;
    this.endInOld = endInOld;
    this.startInNew = startInNew;
    this.endInNew = endInNew;
    this.options = options;
  }

  indexNewWords(): void {
    this.wordIndices = new Map();
    const block: string[] = [];
    for (let i = this.startInNew; i < this.endInNew; i++) {
      // if word is a tag, we should ignore attributes as attribute changes are not supported (yet)
      const word = this.normalizeForIndex(this.newWords[i]);
      const key = putNewWord(block, word, this.options.blockSize);

      if (key === null) {
        continue;
      }

      if (this.wordIndices.has(key)) {
        this.wordIndices.get(key)?.push(i);
      } else {
        this.wordIndices.set(key, [i]);
      }
    }
  }

  // Converts the word to index-friendly value so it can be compared with other similar words
  normalizeForIndex(word: string): string {
    word = Utils.stripAnyAttributes(word);
    if (this.options.ignoreWhiteSpaceDifferences && Utils.isWhiteSpace(word)) {
      return " ";
    }

    return word;
  }

  findMatch(): Match | null {
    this.indexNewWords();

    if (this.wordIndices.size === 0) {
      return null;
    }

    let bestMatchInOld = this.startInOld;
    let bestMatchInNew = this.startInNew;
    let bestMatchSize = 0;

    let matchLengthAt = new Map();
    const blockSize = this.options.blockSize;
    const block: string[] = [];

    for (
      let indexInOld = this.startInOld;
      indexInOld < this.endInOld;
      indexInOld++
    ) {
      const word = this.normalizeForIndex(this.oldWords[indexInOld]);
      const index = putNewWord(block, word, blockSize);

      if (index === null) {
        continue;
      }

      const newMatchLengthAt = new Map();

      if (!this.wordIndices.has(index)) {
        matchLengthAt = newMatchLengthAt;
        continue;
      }

      const indices = this.wordIndices.get(index) ?? [];

      for (const indexInNew of indices) {
        const newMatchLength =
          (matchLengthAt.has(indexInNew - 1)
            ? matchLengthAt.get(indexInNew - 1)
            : 0) + 1;
        newMatchLengthAt.set(indexInNew, newMatchLength);

        if (newMatchLength > bestMatchSize) {
          bestMatchInOld = indexInOld - newMatchLength - blockSize + 2;
          bestMatchInNew = indexInNew - newMatchLength - blockSize + 2;
          bestMatchSize = newMatchLength;
        }
      }

      matchLengthAt = newMatchLengthAt;
    }

    return bestMatchSize !== 0
      ? new Match(bestMatchInOld, bestMatchInNew, bestMatchSize + blockSize - 1)
      : null;
  }
}
