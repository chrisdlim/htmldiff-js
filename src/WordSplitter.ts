import Mode from "./Mode";
import * as Utils from "./Utils";

const convertHtmlToListOfWords = (
  text: string,
  blockExpressions: readonly RegExp[] | null
): readonly string[] => {
  const state: {
    mode: Mode;
    currentWord: string[];
    words: string[];
  } = {
    mode: "character",
    currentWord: [],
    words: [],
  };

  const blockLocations = findBlocks(text, blockExpressions);

  const isBlockCheckRequired = !!blockLocations.size;
  let isGrouping = false;
  let groupingUntil = -1;

  for (let index = 0; index < text.length; index++) {
    const character = text[index];

    // Don't bother executing block checks if we don't have any blocks to check for!
    if (isBlockCheckRequired) {
      // Check if we have completed grouping a text sequence/block
      if (groupingUntil === index) {
        groupingUntil = -1;
        isGrouping = false;
      }

      // Check if we need to group the next text sequence/block
      let until = 0;
      if (blockLocations.has(index)) {
        until = blockLocations.get(index) ?? 0;
        isGrouping = true;
        groupingUntil = until;
      }

      // if we are grouping, then we don't care about what type of character we have, it's going to be treated as a word
      if (isGrouping) {
        state.currentWord.push(character);
        state.mode = "character";
        continue;
      }
    }

    switch (state.mode) {
      case "character":
        if (Utils.isStartOfTag(character)) {
          addClearWordSwitchMode(state, "<", "tag");
        } else if (Utils.isStartOfEntity(character)) {
          addClearWordSwitchMode(state, character, "entity");
        } else if (Utils.isWhiteSpace(character)) {
          addClearWordSwitchMode(state, character, "whitespace");
        } else if (
          Utils.isWord(character) &&
          (state.currentWord.length === 0 ||
            Utils.isWord(state.currentWord[state.currentWord.length - 1]))
        ) {
          state.currentWord.push(character);
        } else {
          addClearWordSwitchMode(state, character, "character");
        }

        break;

      case "tag":
        if (Utils.isEndOfTag(character)) {
          state.currentWord.push(character);
          state.words.push(state.currentWord.join(""));

          state.currentWord = [];
          state.mode = Utils.isWhiteSpace(character)
            ? "whitespace"
            : "character";
        } else {
          state.currentWord.push(character);
        }

        break;

      case "whitespace":
        if (Utils.isStartOfTag(character)) {
          addClearWordSwitchMode(state, character, "tag");
        } else if (Utils.isStartOfEntity(character)) {
          addClearWordSwitchMode(state, character, "entity");
        } else if (Utils.isWhiteSpace(character)) {
          state.currentWord.push(character);
        } else {
          addClearWordSwitchMode(state, character, "character");
        }

        break;

      case "entity":
        if (Utils.isStartOfTag(character)) {
          addClearWordSwitchMode(state, character, "tag");
        } else if (Utils.isWhiteSpace(character)) {
          addClearWordSwitchMode(state, character, "whitespace");
        } else if (Utils.isEndOfEntity(character)) {
          let switchToNextMode = true;
          if (state.currentWord.length !== 0) {
            state.currentWord.push(character);
            state.words.push(state.currentWord.join(""));

            //join &nbsp; entity with last whitespace
            if (
              state.words.length > 2 &&
              Utils.isWhiteSpace(state.words[state.words.length - 2]) &&
              Utils.isWhiteSpace(state.words[state.words.length - 1])
            ) {
              const w1 = state.words[state.words.length - 2];
              const w2 = state.words[state.words.length - 1];
              state.words.splice(state.words.length - 2, 2);
              state.currentWord = [w1, w2];
              state.mode = "whitespace";
              switchToNextMode = false;
            }
          }

          if (switchToNextMode) {
            state.currentWord = [];
            state.mode = "character";
          }
        } else if (Utils.isWord(character)) {
          state.currentWord.push(character);
        } else {
          addClearWordSwitchMode(state, character, "character");
        }

        break;
    }
  }

  if (state.currentWord.length !== 0) {
    state.words.push(state.currentWord.join(""));
  }

  return state.words;
};

const addClearWordSwitchMode = (
  state: {
    mode: Mode;
    currentWord: readonly string[];
    words: string[];
  },
  character: string,
  mode: Mode
) => {
  if (state.currentWord.length !== 0) {
    state.words.push(state.currentWord.join(""));
  }

  state.currentWord = [character];
  state.mode = mode;
};

const findBlocks = (
  text: string,
  blockExpressions: readonly RegExp[] | null
) => {
  const blockLocations = new Map<number, number>();

  if (blockExpressions === null) {
    return blockLocations;
  }

  for (const exp of blockExpressions) {
    let m;
    while ((m = exp.exec(text)) !== null) {
      if (blockLocations.has(m.index)) {
        throw new Error(
          "One or more block expressions result in a text sequence that overlaps. Current expression: " +
            exp.toString()
        );
      }

      blockLocations.set(m.index, m.index + m[0].length);
    }
  }

  return blockLocations;
};

export { convertHtmlToListOfWords };
