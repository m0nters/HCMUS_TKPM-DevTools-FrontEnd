import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  LoadingSpinner,
  PluginCard,
  SplitText,
  Waves,
} from "../components/";
import { useAuth } from "../hooks/";
import { getAllPlugins } from "../services/";
import { Plugin } from "../types/";

export function Home() {
  // Hooks
  const [featuredPlugins, setFeaturedPlugins] = useState<Plugin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [show1stText, setShow1stText] = useState(false);
  const [show2ndTextBg, setShow2ndTextBg] = useState(false);
  const [show2ndText, setshow2ndText] = useState(false);
  const [show3rdText, setShow3rdText] = useState(false);
  const [show4ndText, setShow4ndText] = useState(false);

  const { isAuth } = useAuth();

  // Refs
  const featuredSectionRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  const fetchFeaturedTools = async () => {
    setIsLoading(true);
    try {
      const data = await getAllPlugins();

      // Get 4 plugins to feature
      const featured = data.slice(0, 4);

      setFeaturedPlugins(featured);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up the animation sequence on component mount
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShow1stText(true);
    }, 1000);
    const timer2 = setTimeout(() => {
      setShow2ndTextBg(true);
    }, 2300);
    const timer3 = setTimeout(() => {
      setshow2ndText(true);
    }, 2300);
    const timer4 = setTimeout(() => {
      setShow3rdText(true);
    }, 3600);
    const timer5 = setTimeout(() => {
      setShow4ndText(true);
    }, 4800);

    // Clean up timers when component unmounts
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  // Fetch featured plugins on component mount
  useEffect(() => {
    fetchFeaturedTools();
  }, []);

  // Scroll handler to automatically scroll the user to the next section
  useEffect(() => {
    // Don't run the scroll handler if we're in the middle of an automated scroll
    if (hasScrolled) return;

    const handleScroll = () => {
      const heroSection = heroSectionRef.current;
      if (!heroSection) return;

      const scrollPosition = window.scrollY;
      const heroTop = heroSection.offsetTop;
      const heroHeight = heroSection.offsetHeight;
      const heroBottom = heroTop + heroHeight;

      // Case 1: User starts scrolling down in hero section
      if (scrollPosition > 0 && scrollPosition < heroBottom / 2) {
        setHasScrolled(true);
        window.scrollTo({
          top: heroBottom,
          behavior: "smooth",
        });

        setTimeout(() => {
          setHasScrolled(false);
        }, 1000);
      }
      // Case 2: User scrolls back up near hero boundary
      else if (
        scrollPosition < heroBottom - 50 &&
        scrollPosition >= heroBottom / 2
      ) {
        setHasScrolled(true);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        // Reset hasScrolled after animation completes
        setTimeout(() => {
          setHasScrolled(false);
        }, 1000);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  return (
    <>
      <article>
        <title>Home | IT Tools</title>
        <meta
          name="description"
          content="A collection of essential utilities designed for developers to optimize daily tasks and enhance productivity"
        />
      </article>
      <div className="mx-auto w-full pb-12">
        {/* Hero Section */}
        <div ref={heroSectionRef} className="relative mb-16 h-screen">
          <Waves className="opacity-40" />

          <div className="relative flex h-full flex-col items-center justify-center py-16 text-center">
            {show1stText && (
              <h1 className="mb-10 text-5xl font-bold text-black md:text-6xl">
                <SplitText
                  text="Developer Tools That"
                  delay={50}
                  animationFrom={{
                    opacity: 0,
                    transform: "translate3d(0,50px,0)",
                  }}
                  animationTo={{
                    opacity: 1,
                    transform: "translate3d(0,0,0)",
                  }}
                  easing="easeOutCubic"
                  threshold={0.2}
                  rootMargin="-50px"
                  onLetterAnimationComplete={() => {}}
                />
                <div className="relative inline-block">
                  {/* Animated background div that grows from left to right */}
                  {show2ndTextBg && (
                    <div
                      className="absolute inset-0 -top-2 h-16 origin-left bg-black md:-top-2.5 md:h-20"
                      style={{
                        transform: "scaleX(0)",
                        animation: "expandWidth 0.8s ease-out forwards",
                      }}
                    />
                  )}

                  {/* SplitText component */}
                  {show2ndText && (
                    <div className="relative z-10">
                      <SplitText
                        text="Simplify"
                        delay={100}
                        animationFrom={{
                          opacity: 0,
                          transform: "translate3d(0,50px,0)",
                        }}
                        animationTo={{
                          opacity: 1,
                          transform: "translate3d(0,0,0)",
                        }}
                        easing="easeOutCubic"
                        threshold={0.2}
                        rootMargin="-50px"
                        onLetterAnimationComplete={() => {}}
                        whiteSpace={false}
                        className="px-0.5 text-white md:px-2" // Add padding and make text white
                      />
                    </div>
                  )}
                </div>
                {show3rdText && (
                  <SplitText
                    text=" Your Workflow"
                    delay={50}
                    animationFrom={{
                      opacity: 0,
                      transform: "translate3d(0,50px,0)",
                    }}
                    animationTo={{
                      opacity: 1,
                      transform: "translate3d(0,0,0)",
                    }}
                    easing="easeOutCubic"
                    threshold={0.2}
                    rootMargin="-50px"
                    onLetterAnimationComplete={() => {}}
                  />
                )}
              </h1>
            )}

            {show4ndText && (
              <SplitText
                text="A collection of essential utilities designed for developers to optimize daily tasks and enhance productivity"
                className="mb-10 max-w-2xl text-xl text-gray-800"
                delay={10}
                animationFrom={{
                  opacity: 0,
                  transform: "translate3d(0,50px,0)",
                }}
                animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                easing="easeOutCubic"
                threshold={0.2}
                rootMargin="-50px"
                onLetterAnimationComplete={() => {}}
              />
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="animate-fade-in-up">
                <Button to="/explore" variant="primary" size="lg">
                  Explore All Tools
                </Button>
              </div>
              {!isAuth && (
                <div className="animate-fade-in-up">
                  <Button to="/register" variant="secondary" size="lg">
                    Create Account
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Tools Section */}
        <div ref={featuredSectionRef} className="mt-24 mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Featured Tools
          </h2>

          {isLoading ? (
            LoadingSpinner({ size: "lg" })
          ) : featuredPlugins.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 text-center">
              <SparklesIcon className="mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-1 text-lg font-medium text-gray-900">
                No Featured Tools Yet
              </h3>
              <p className="max-w-md text-gray-500">
                We're preparing some amazing developer tools for you. Check back
                soon or explore our categories.
              </p>
              <button
                onClick={fetchFeaturedTools}
                className="mt-4 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-300"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredPlugins.map((plugin) => (
                <PluginCard key={plugin.id} plugin={plugin} iconSize="md" />
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Link
              to="/explore"
              className="flex items-center gap-2 font-medium text-black transition-all duration-200 ease-in-out hover:gap-4 hover:text-gray-700"
            >
              View All Tools By Categories
              <ArrowRightIcon className="h-8 w-8" />
            </Link>
          </div>
        </div>

        {/* How it works Section */}
        <div className="mx-auto mt-24 max-w-5xl">
          <h2 className="mb-7 text-center text-3xl font-bold">How It Works</h2>

          <div className="rounded-lg border-2 border-gray-200 bg-white p-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
                  1
                </div>
                <h3 className="mb-2 text-xl font-medium">Choose a Tool</h3>
                <p className="text-gray-600">
                  Browse our collection of developer utilities and select the
                  one you need
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
                  2
                </div>
                <h3 className="mb-2 text-xl font-medium">Input Your Data</h3>
                <p className="text-gray-600">
                  Enter the information you want to process using our simple
                  interface
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
                  3
                </div>
                <h3 className="mb-2 text-xl font-medium">
                  Get Results Instantly
                </h3>
                <p className="text-gray-600">
                  Receive your processed data immediately, ready to use in your
                  projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
