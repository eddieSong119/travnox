export default function ColorExample() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">主题色示例</h1>

      {/* 所有主题色展示 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">主题色色板</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="w-full h-20 bg-primary-terracotta rounded-lg border border-gray-300"></div>
            <p className="font-semibold">Terracotta</p>
            <p className="font-mono text-sm">#A83913</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-primary-stone rounded-lg border border-gray-300"></div>
            <p className="font-semibold">Stone</p>
            <p className="font-mono text-sm">#A59B8F</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-primary-midnight rounded-lg border border-gray-300"></div>
            <p className="font-semibold text-white">Midnight</p>
            <p className="font-mono text-sm">#262B2F</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-primary-steel rounded-lg border border-gray-300"></div>
            <p className="font-semibold">Steel</p>
            <p className="font-mono text-sm">#D3CFCA</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-primary-mist rounded-lg border border-gray-300"></div>
            <p className="font-semibold">Mist</p>
            <p className="font-mono text-sm">#DDE2E7</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-primary-parchment rounded-lg border border-gray-300"></div>
            <p className="font-semibold">Parchment</p>
            <p className="font-mono text-sm">#EFEEE9</p>
          </div>
        </div>
      </div>

      {/* 文本颜色示例 */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">文本颜色示例</h2>
        <div className="space-y-2">
          <p className="text-primary-terracotta text-lg">
            text-primary-terracotta
          </p>
          <p className="text-primary-stone text-lg">text-primary-stone</p>
          <p className="text-primary-midnight text-lg">text-primary-midnight</p>
          <p className="text-primary-steel text-lg">text-primary-steel</p>
          <p className="text-primary-mist text-lg">text-primary-mist</p>
          <p className="text-primary-parchment text-lg">
            text-primary-parchment
          </p>
        </div>
      </div>

      {/* 按钮示例 */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">按钮示例</h2>
        <div className="flex gap-4 flex-wrap">
          <button className="bg-primary-terracotta text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors">
            Terracotta
          </button>
          <button className="bg-primary-stone text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors">
            Stone
          </button>
          <button className="bg-primary-midnight text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Midnight
          </button>
        </div>
      </div>
    </div>
  );
}
