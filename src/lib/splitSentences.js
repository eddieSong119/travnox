/** Split text into sentences without breaking common abbreviations. */
export const splitSentences = (text) => {
  if (!text) return [];

  const abbreviations = [
    "approx",
    "e.g",
    "i.e",
    "etc",
    "vs",
    "Dr",
    "Mr",
    "Mrs",
    "Ms",
    "Prof",
    "a.m",
    "p.m",
    "No",
    "alt",
    "2",
  ];

  const abbreviationPattern = new RegExp(
    `\\b(${abbreviations.join("|")})\\.`,
    "gi",
  );

  let processedText = text;
  const abbreviationMap = new Map();
  let counter = 0;

  processedText = processedText.replace(abbreviationPattern, (match) => {
    const placeholder = `__ABBR_${counter}__`;
    abbreviationMap.set(placeholder, match);
    counter++;
    return placeholder;
  });

  const sentences = processedText
    .split(".")
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

  return sentences.map((sentence) => {
    let result = sentence;
    abbreviationMap.forEach((original, placeholder) => {
      result = result.replace(placeholder, original);
    });
    return result;
  });
};
