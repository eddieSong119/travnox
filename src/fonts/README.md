# 字体文件目录

请将您的字体文件放在这个目录中。

## 支持的字体格式

- `.woff2` (推荐，文件最小，兼容性最好)
- `.woff`
- `.ttf`
- `.otf`

## 添加字体的步骤

1. 将字体文件放入此目录
2. 修改 `src/lib/fonts.js` 文件中的字体配置
3. 更新字体文件路径和名称

## 字体配置示例

```javascript
export const customFont = localFont({
  src: [
    {
      path: "../fonts/YourFont-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/YourFont-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-custom",
  display: "swap",
});
```

## 在 CSS 中使用

```css
.custom-text {
  font-family: var(--font-custom);
}
```

## 在 Tailwind 中使用

```jsx
<div className="font-custom">使用自定义字体的文本</div>
```

需要在 `tailwind.config.js` 中添加：

```javascript
theme: {
  extend: {
    fontFamily: {
      custom: ['var(--font-custom)'],
    },
  },
}
```
