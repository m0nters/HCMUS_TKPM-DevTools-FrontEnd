import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Plugin } from "../types/plugins";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import {
  LoadingSpinner,
  PluginCard,
  Button,
  SplitText,
  Waves,
} from "../components/common";
import { getAllPlugins } from "../services/plugins/";
import { useAuth } from "../hooks/useAuth";

function Home() {
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
      <div className="w-full mx-auto pb-12">
        {/* Hero Section */}
        <div ref={heroSectionRef} className="relative h-screen mb-16">
          <Waves className="opacity-40" />

          <div className="relative flex flex-col items-center justify-center text-center py-16 h-full">
            {show1stText && (
              <h1 className="text-5xl md:text-6xl font-bold mb-10 text-black">
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
                      className="absolute -top-2 md:-top-2.5 inset-0 bg-black h-16 md:h-20 origin-left"
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
                        className="text-white px-0.5 md:px-2" // Add padding and make text white
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
                className="text-xl text-gray-800 max-w-2xl mb-10"
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
            <div className="flex flex-col sm:flex-row gap-4">
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
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Tools
          </h2>

          {isLoading ? (
            LoadingSpinner({ size: "lg" })
          ) : featuredPlugins.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 text-center">
              <SparklesIcon className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No Featured Tools Yet
              </h3>
              <p className="text-gray-500 max-w-md">
                We're preparing some amazing developer tools for you. Check back
                soon or explore our categories.
              </p>
              <button
                onClick={fetchFeaturedTools}
                className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {featuredPlugins.map((plugin) => (
                <PluginCard key={plugin.id} plugin={plugin} iconSize="md" />
              ))}
            </div>
          )}

          <div className="flex justify-center mt-10">
            <Link
              to="/explore"
              className="flex items-center text-black hover:text-gray-700 font-medium gap-2 hover:gap-4 transition-all ease-in-out duration-200"
            >
              View All Tools By Categories
              <ArrowRightIcon className="w-8 h-8" />
            </Link>
          </div>
        </div>

        {/* How it works Section */}
        <div className="mt-24 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-7 text-center">How It Works</h2>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-medium mb-2">Choose a Tool</h3>
                <p className="text-gray-600">
                  Browse our collection of developer utilities and select the
                  one you need
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-medium mb-2">Input Your Data</h3>
                <p className="text-gray-600">
                  Enter the information you want to process using our simple
                  interface
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-medium mb-2">
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

export default Home;
