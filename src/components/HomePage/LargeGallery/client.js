"use client";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const LargeGalleryClient = ({
  scrollElements = [],
  className = "w-full flex items-center justify-center px-[10px] md:pb-[100px] ",
  slideClassName = "",
}) => {
  return (
    <Splide
      className={`${className}`}
      options={{
        gap: "20px", // 移除幻灯片间距，紧贴排列
        width: "100%", // 轮播容器宽度
        arrows: false, // 移除箭头
        padding: "calc(50% - 710px)", // 移除内边距
        focus: 0, // 第一张幻灯片居中
        perPage: "auto", // 自动计算每页显示数量
        perMove: 1, // 每次移动一张
        drag: true, // 允许拖拽
        snap: true, // 拖拽后吸附到最近的幻灯片
        easing: "ease", // 过渡动画
        speed: 400, // 过渡速度
      }}
    >
      {scrollElements.map((element, index) => (
        <SplideSlide key={index} className={slideClassName}>
          {element}
        </SplideSlide>
      ))}
    </Splide>
  );
};

export default LargeGalleryClient;
