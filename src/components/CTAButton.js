export default function CTAButton({
  text,
  onClick,
  color = "primary-parchment",
  margin = "mt-10",
}) {
  return (
    <button
      className={`text-${color} border-${color} ${margin} px-7 py-3 rounded-full border font-noto-sans font-[500] text-[16px] `}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
