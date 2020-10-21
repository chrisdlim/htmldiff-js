export default class MatchOptions {
  blockSize: number;
  repeatingWordsAccuracy: number;
  ignoreWhiteSpaceDifferences: boolean;

  constructor() {
    this.blockSize = 0;
    this.repeatingWordsAccuracy = 0.0;
    this.ignoreWhiteSpaceDifferences = false;
  }
}
