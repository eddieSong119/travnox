const breakText = (text, breakAt, textColor, secondColor) => {
  if (!breakAt || !text) {
    return text;
  }

  // Parse breakAt - if it contains commas, split into multiple break points
  const breakPoints = breakAt.includes(",")
    ? breakAt.split(",").map((point) => point.trim())
    : [breakAt];

  // Process text with multiple break points
  let processedText = text;
  let parts = [text];

  // Apply each break point sequentially
  breakPoints.forEach((breakPoint) => {
    if (!breakPoint) return;

    const newParts = [];
    parts.forEach((part) => {
      if (typeof part === "string" && part.includes(breakPoint)) {
        const subParts = part.split(breakPoint);
        subParts.forEach((subPart, index) => {
          newParts.push(subPart);
          if (index < subParts.length - 1) {
            newParts.push({ type: "break", char: breakPoint });
          }
        });
      } else {
        newParts.push(part);
      }
    });
    parts = newParts;
  });

  if (textColor && secondColor) {
    // For two-color mode with multiple break points
    let colorIndex = 0;
    return parts.map((part, index) => {
      if (typeof part === "object" && part.type === "break") {
        // Break point - same color as previous text
        return (
          <span
            key={index}
            className={colorIndex % 2 === 0 ? textColor : secondColor}
          >
            {part.char}
            <br />
          </span>
        );
      } else if (part) {
        // Text part - alternate colors
        const currentColor = colorIndex % 2 === 0 ? textColor : secondColor;
        colorIndex++;
        return (
          <span key={index} className={currentColor}>
            {part}
          </span>
        );
      }
      return null;
    });
  }

  // For single color mode with line breaks
  return parts.map((part, index) => {
    if (typeof part === "object" && part.type === "break") {
      return (
        <span key={index}>
          {part.char}
          <br />
        </span>
      );
    } else if (part) {
      return <span key={index}>{part}</span>;
    }
    return null;
  });
};

const Intro = ({ intro, breakAt, textColor = "text-primary-midnight" }) => {
  return (
    <p
      className={`text-[14px] md:text-[16px] ${textColor} font-[500] font-noto-sans text-center mb-5`}
    >
      {breakText(intro, breakAt)}
    </p>
  );
};

const Title = ({ title, breakAt, textColor = "text-primary-midnight" }) => {
  // Add whitespace-nowrap only when there's no breakAt to prevent auto line breaks
  // const noWrapClass = !breakAt ? "whitespace-nowrap" : "";
  const noWrapClass = "";

  return (
    <h1
      className={`text-[32px] md:text-[60px] ${textColor} font-[500] font-pp-museum text-center leading-[1.1] mb-4 ${noWrapClass}`}
    >
      {breakText(title, breakAt)}
    </h1>
  );
};

const TwoColorTitle = ({
  title,
  breakAt,
  textColor = "text-primary-midnight",
  secondColor = "text-primary-terracotta",
}) => {
  return (
    <h1
      className={`text-[32px] md:text-[60px] ${textColor} font-[500] font-pp-museum text-center leading-[1.1] mb-4`}
    >
      {breakText(title, breakAt, textColor, secondColor)}
    </h1>
  );
};

const Description = ({
  description,
  breakAt,
  textColor = "text-primary-midnight",
}) => {
  return (
    <p
      className={`text-[20px] ${textColor} font-[300] font-pp-museum text-center leading-[1.6]`}
    >
      {breakText(description, breakAt)}
    </p>
  );
};

export { Title, Intro, Description, TwoColorTitle };
