import Image from "next/image";

const Polaroid = ({
  imageSrc,
  imageAlt = "Polaroid photo",
  text = "",
  rotate = 0,
  className = "",
  textSize = "text-[24px]",
  textColor = "text-gray-800",
  padding = "p-[15px]",
}) => {
  return (
    <div
      className={`bg-white ${padding} shadow-lg flex flex-col ${className}`}
      style={{
        aspectRatio: "4/5", // 宝丽来相片的经典比例
        transform: `rotate(${rotate}deg)`,
        transformOrigin: "center",
      }}
    >
      {/* 图片区域 */}
      <div
        className="bg-gray-100 overflow-hidden w-full flex-shrink-0 relative"
        style={{
          aspectRatio: "1/1", // 正方形图片区域
          margin: "0 auto",
        }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={true}
        />
      </div>

      {/* 文字区域 - 填满剩余空间 */}
      {text && (
        <div
          className={`mt-2 text-center ${textSize} ${textColor} w-full flex-1 flex items-center justify-center`}
        >
          <span className="break-words font-caveat">{text}</span>
        </div>
      )}
    </div>
  );
};

export default Polaroid;
