"use client";
import { ReactLenis } from "lenis/react";
import { useEffect, useRef } from "react";

export default function ProgressiveStickyScrollClient({
  elements = [],
  className = "",
  backgroundColor = "transparent",
}) {
  const containerRef = useRef(null);

  // 如果没有传入 elements，返回空组件
  if (!elements || elements.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ backgroundColor }}
    >
      {/* 创建足够的空间让所有元素滚动 */}
      <div style={{ height: `${elements.length * 100}vh` }}>
        {elements.map((element, index) => {
          const {
            id,
            content,
            speed = 1,
            zIndex = index + 1,
            className: elementClassName = "",
          } = element;

          return (
            <div
              key={id || index}
              className={`sticky top-0 w-full ${elementClassName}`}
              style={{
                zIndex: zIndex,
              }}
            >
              {typeof content === "string" ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
