"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ProgressiveStickyScrollServer from "./server";

// 动态导入客户端组件
const ProgressiveStickyScrollClient = dynamic(() => import("./client"), {
  ssr: false,
  loading: () => null,
});

/**
 * 渐进式Sticky Scroll组件
 * 服务端渲染静态内容，客户端增强为Sticky Scroll效果
 *
 * @param {Array} elements - sticky scroll 元素数组
 * @param {string} className - 容器类名
 * @param {boolean} enableStickyScroll - 是否启用 sticky scroll 效果
 * @param {string} backgroundColor - 背景颜色
 */
const ProgressiveStickyScroll = ({
  elements = [],
  className = "",
  enableStickyScroll = true,
  backgroundColor = "transparent",
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 如果没有元素，返回空组件
  if (!elements || elements.length === 0) {
    return null;
  }

  return (
    <section className={`relative ${className}`}>
      {/* 服务端渲染的静态内容 */}
      <div
        style={{
          opacity: isClient && enableStickyScroll ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <ProgressiveStickyScrollServer elements={elements} />
      </div>

      {/* 客户端Sticky Scroll效果 */}
      {isClient && enableStickyScroll && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <ProgressiveStickyScrollClient
            elements={elements}
            backgroundColor={backgroundColor}
          />
        </div>
      )}
    </section>
  );
};

export default ProgressiveStickyScroll;
