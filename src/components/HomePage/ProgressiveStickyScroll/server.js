import React from "react";

const ProgressiveStickyScrollServer = ({ elements = [] }) => {
  return (
    <div
      className="relative w-full"
      style={{ height: `${elements.length * 100}vh` }}
    >
      {elements.map((element, index) => {
        const {
          content,
          zIndex = index + 1,
          className: elementClassName = "",
          id,
        } = element;

        return (
          <section
            key={`server-${id || index}`}
            className={`absolute w-full h-screen ${elementClassName}`}
            style={{
              top: `${index * 100}vh`,
              zIndex: zIndex + 10,
            }}
          >
            <div className="w-full h-full">
              {typeof content === "string" ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                content
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ProgressiveStickyScrollServer;
