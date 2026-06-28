export function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <polygon points="12,3 21,19 3,19" stroke="#292521" strokeWidth="1.6" fill="none" />
      <circle cx="12" cy="3" r="2" fill="#6E78C9" />
      <circle cx="21" cy="19" r="2" fill="#9A6FD0" />
      <circle cx="3" cy="19" r="2" fill="#C77399" />
    </svg>
  );
}
