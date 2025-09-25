"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LargeGalleryServer from "./server";

// 动态导入客户端组件
const LargeGalleryClient = dynamic(() => import("./client"), {
  ssr: false,
  loading: () => null,
});

/**
 * 渐进式LargeGallery组件
 * 服务端渲染静态内容，客户端增强为横向切换和拖拽效果
 *
 * @param {Array} scrollElements - 滚动元素数组
 * @param {string} className - 容器类名
 * @param {boolean} enableInteractive - 是否启用交互效果
 */
const LargeGallery = ({
  scrollElements = [],
  className = "",
  enableInteractive = true,
  slideClassName = "",
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 如果没有元素，返回空组件
  if (!scrollElements || scrollElements.length === 0) {
    return null;
  }

  if (isClient && enableInteractive) {
    return (
      <LargeGalleryClient
        scrollElements={scrollElements}
        className={className}
        slideClassName={slideClassName}
      />
    );
  } else {
    return (
      <LargeGalleryServer
        scrollElements={scrollElements}
        className={className}
      />
    );
  }
};

export default LargeGallery;
