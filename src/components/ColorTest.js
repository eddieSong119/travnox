export default function ColorTest() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">颜色测试</h1>

      {/* 基本颜色测试 */}
      <div className="space-y-2">
        <p className="test-terracotta">Terracotta 文本 (CSS类)</p>
        <p className="test-stone">Stone 文本 (CSS类)</p>
        <p className="test-midnight">Midnight 文本 (CSS类)</p>
        <p className="test-steel">Steel 文本 (CSS类)</p>
        <p className="test-mist">Mist 文本 (CSS类)</p>
        <p className="test-parchment">Parchment 文本 (CSS类)</p>
      </div>

      {/* 背景色测试 */}
      <div className="space-y-2">
        <div className="w-32 h-16 bg-test-terracotta rounded"></div>
        <div className="w-32 h-16 bg-test-stone rounded"></div>
        <div className="w-32 h-16 bg-test-midnight rounded"></div>
        <div className="w-32 h-16 bg-test-steel rounded"></div>
        <div className="w-32 h-16 bg-test-mist rounded"></div>
        <div className="w-32 h-16 bg-test-parchment rounded"></div>
      </div>

      {/* Tailwind 类测试 */}
      <div className="space-y-2">
        <p className="text-primary-terracotta">Terracotta 文本 (Tailwind类)</p>
        <p className="text-primary-stone">Stone 文本 (Tailwind类)</p>
        <p className="text-primary-midnight">Midnight 文本 (Tailwind类)</p>
        <p className="text-primary-steel">Steel 文本 (Tailwind类)</p>
        <p className="text-primary-mist">Mist 文本 (Tailwind类)</p>
        <p className="text-primary-parchment">Parchment 文本 (Tailwind类)</p>
      </div>

      {/* 对比测试 */}
      <div className="space-y-2">
        <p className="text-black">默认黑色文本</p>
        <p className="text-red-500">Tailwind 红色文本</p>
        <p className="text-primary-terracotta">自定义 Terracotta 文本</p>
      </div>
    </div>
  );
}
