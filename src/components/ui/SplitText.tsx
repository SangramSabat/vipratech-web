/**
 * Per-character reveal for display headings.
 *
 * Measured from codesandbox.io's hero (`.text-motion-outline`), which splits the
 * headline into one span per character and gives each its own transition:
 *
 *   opacity 2s   ease-in-out  (i * 0.03s)
 *   color   1s   ease-in-out  (0.4s + i * 0.03s)
 *
 * Two stages per character: it fades in, then warms to full colour 400ms later.
 * The 30ms step is what makes a long headline resolve as a wave rather than a
 * blink — see design-recon blueprints/codesandbox-io.
 *
 * Constraints this implementation is built around, from Hero.tsx's own history:
 * the headline was previously typed on the client, which delayed the LCP element
 * by ~1.2s and left it out of the prerendered HTML. So:
 *
 *   - every character is rendered server-side; the full string is in the markup
 *   - there is no JavaScript at runtime — the animation is CSS `animation-delay`
 *     driven off an inline `--i`, so it costs nothing and cannot delay paint
 *   - spans are `display: inline` and not aria-hidden, so assistive tech reads
 *     the heading as continuous text and the accessible name is unchanged
 *
 * Words are kept whole in their own wrapper so the headline still wraps on word
 * boundaries rather than mid-word.
 */
export function SplitText({text, className}: {text: string; className?: string}) {
  let index = 0;

  return (
    <span className={className}>
      {text.split(" ").map((word, wordIndex, words) => (
        // eslint-disable-next-line react/no-array-index-key -- index is the identity here
        <span key={`${word}-${wordIndex}`} className="inline-block whitespace-pre">
          {[...word].map((char, charIndex) => (
            <span
              key={`${char}-${charIndex}`}
              className="reveal-char"
              style={{"--i": index++} as React.CSSProperties}
            >
              {char}
            </span>
          ))}
          {wordIndex < words.length - 1 ? (
            <span className="reveal-char" style={{"--i": index++} as React.CSSProperties}>
              {" "}
            </span>
          ) : null}
        </span>
      ))}
    </span>
  );
}
