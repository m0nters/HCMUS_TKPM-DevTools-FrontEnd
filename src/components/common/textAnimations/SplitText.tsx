import { useSprings, animated } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";

/**
 * Split text component
 * @param text - The text content to animate.
 * @param className - Additional class names to style the component.
 * @param delay - Delay between each letter animation (default: `100`)
 * @param animationFrom - The initial animation state (default: `{ opacity: 0, transform: "translate3d(0,40px,0)" }`)
 * @param animationTo - The final animation state (default: `{ opacity: 1, transform: "translate3d(0,0,0)" }`)
 * @param easing - The easing function (default: `easeOutCubic`)
 * @param threshold - The threshold at which the animation should start (default: `0.1`)
 * @param rootMargin - Root margin for the intersection observer. (default: `-100px`)
 * @param textAlign - Text alignment (default: `center`)
 * @param onLetterAnimationComplete - Callback function when all letters are animated
 * @param whiteSpace - Enable white space between words (default: `true`)
 * @returns Split text component
 * @example
 * ```tsx
 * <SplitText
 *   text="Hello, Tailwind!"
 *   className="text-2xl font-semibold text-center"
 *   delay={150}
 *   animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
 *   animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
 *   easing="easeOutCubic"
 *   threshold={0.2}
 *   rootMargin="-50px"
 *   onLetterAnimationComplete={handleAnimationComplete}
 * />
 * ```
 */
export const SplitText = ({
  text = "",
  className = "",
  delay = 100,
  animationFrom = { opacity: 0, transform: "translate3d(0,40px,0)" },
  animationTo = { opacity: 1, transform: "translate3d(0,0,0)" },
  easing = "easeOutCubic",
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
  whiteSpace = true,
}) => {
  const words = text.split(" ").map((word) => word.split(""));
  const letters = words.flat();
  const [inView, setInView] = useState(false);
  const ref = useRef();
  const animatedCount = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const springs = useSprings(
    letters.length,
    letters.map((_, i) => ({
      from: animationFrom,
      to: inView
        ? async (next) => {
            await next(animationTo);
            animatedCount.current += 1;
            if (
              animatedCount.current === letters.length &&
              onLetterAnimationComplete
            ) {
              onLetterAnimationComplete();
            }
          }
        : animationFrom,
      delay: i * delay,
      config: { easing },
    })),
  );

  return (
    <p
      ref={ref}
      className={`split-parent inline overflow-hidden ${className}`}
      style={{ textAlign, whiteSpace: "normal", wordWrap: "break-word" }}
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {word.map((letter, letterIndex) => {
            const index =
              words.slice(0, wordIndex).reduce((acc, w) => acc + w.length, 0) +
              letterIndex;

            return (
              <animated.span
                key={index}
                style={springs[index]}
                className="inline-block transform transition-opacity will-change-transform"
              >
                {letter}
              </animated.span>
            );
          })}
          {whiteSpace && (
            <span style={{ display: "inline-block", width: "0.3em" }}>
              &nbsp;
            </span>
          )}
        </span>
      ))}
    </p>
  );
};
