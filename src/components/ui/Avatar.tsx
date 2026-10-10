/**
 * Circular avatar holding a looping gradient video.
 *
 * The CSS gradient underneath is a real fallback, not decoration: if
 * /avatar.mp4 is missing or fails to decode, the <video> paints nothing and
 * the circle still reads as an intentional gradient rather than a hole.
 *
 * Decorative — the name sits beside it in the header and as the bio's h1, so
 * this carries no alt text of its own.
 */
export default function Avatar({ size = 32 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="block shrink-0 overflow-hidden rounded-full bg-[linear-gradient(135deg,#7aa7ff_0%,#b9d0ff_45%,#6f9dff_100%)]"
      style={{ width: size, height: size }}
    >
      <video
        className="h-full w-full object-cover"
        src="/avatar.mp4"
        poster="/avatar-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        // Keeps looping regardless of prefers-reduced-motion, by request.
        tabIndex={-1}
      />
    </span>
  );
}
