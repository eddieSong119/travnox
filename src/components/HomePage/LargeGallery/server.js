const LargeGalleryServer = ({ scrollElements = [] }) => {
  if (!scrollElements || scrollElements.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-primary-parchment">
      {/* 服务端渲染：垂直显示所有内容 */}
      <div className="flex flex-col h-full">
        {scrollElements.map((element, index) => (
          <div
            key={element.id || index}
            className="w-full h-full flex-shrink-0"
          >
            {element}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LargeGalleryServer;
