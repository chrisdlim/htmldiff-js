const tagRegex = /^\s*<\/?[^>]+>\s*$/;
const tagWordRegex = /<[^\s>]+/;
const whitespaceRegex = /^(\s|&nbsp;)+$/;
const wordRegex = /[\w#@]+/;

const specialCaseWordTags = ["<img"];

function isTag(item: string): boolean {
  if (specialCaseWordTags.some((re) => item !== null && item.startsWith(re))) {
    return false;
  }

  return tagRegex.test(item);
}

function stripTagAttributes(word: string): string {
  const tag = tagWordRegex.exec(word)?.[0];

  if (tag) {
    word = tag + (word.endsWith("/>") ? "/>" : ">");
    return word;
  }

  return word;
}

function wrapText(text: string, tagName: string, cssClass: string): string {
  return [
    "<",
    tagName,
    ' class="',
    cssClass,
    '">',
    text,
    "</",
    tagName,
    ">",
  ].join("");
}

function isStartOfTag(val: string): boolean {
  return val === "<";
}

function isEndOfTag(val: string): boolean {
  return val === ">";
}

function isStartOfEntity(val: string): boolean {
  return val === "&";
}

function isEndOfEntity(val: string): boolean {
  return val === ";";
}

function isWhiteSpace(value: string): boolean {
  return whitespaceRegex.test(value);
}

function stripAnyAttributes(word: string): string {
  if (isTag(word)) {
    return stripTagAttributes(word);
  }

  return word;
}

function isWord(text: string): boolean {
  return wordRegex.test(text);
}

export {
  isTag,
  stripTagAttributes,
  wrapText,
  isStartOfTag,
  isEndOfTag,
  isStartOfEntity,
  isEndOfEntity,
  isWhiteSpace,
  stripAnyAttributes,
  isWord,
};
