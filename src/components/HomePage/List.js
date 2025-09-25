const List = ({ list, textColor = "text-primary-midnight" }) => {
  return (
    <div className="flex flex-col gap-4 ">
      {list.map((item, index) => (
        <div key={item.key + index} className="flex gap-2 relative">
          {/* 圆点和连接线容器 */}
          <div className="flex flex-col items-center pt-2 pr-2 relative">
            {/* 圆点 */}
            <div className="w-2 h-2 bg-primary-terracotta rounded-full flex-shrink-0 z-10"></div>
            {/* 连接线 - 除了最后一个项目 */}
            {index < list.length - 1 && (
              <div className="w-[1px] bg-primary-terracotta absolute top-[12px] bottom-[-24px] left-1/2 -translate-x-[4.5px]"></div>
            )}
          </div>

          <div className="flex flex-col gap-2 flex-1 md:max-w-[580px]">
            <p className={`${textColor} font-noto-sans text-[16px] font-[500]`}>
              {item.key}
            </p>
            <p
              className={`${textColor} font-noto-sans text-[14px] md:text-[16px] font-[300] leading-[1.6]`}
            >
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default List;
