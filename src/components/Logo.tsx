export function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <polygon points="12,3 21,19 3,19" stroke="var(--ink)" strokeWidth="1.6" fill="none" />
      <circle cx="12" cy="3" r="2" fill="var(--mbti)" />
      <circle cx="21" cy="19" r="2" fill="var(--astro)" />
      <circle cx="3" cy="19" r="2" fill="var(--num)" />
    </svg>
  );
}
