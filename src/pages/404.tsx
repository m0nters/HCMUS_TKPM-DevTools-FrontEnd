import { FuzzyText, Button } from "../components/common";
import { HomeIcon } from "@heroicons/react/24/outline";

function NotFound() {
  return (
    <>
      <article>
        <title>404 | IT Tools</title>
        <meta
          name="description"
          content="The page you are looking for doesn't exist or has been moved."
        />
      </article>
      <div className="w-full max-w-5xl mx-auto text-center pt-24 px-6 pb-12">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex justify-center items-center mb-8">
            <FuzzyText
              baseIntensity={0.2}
              hoverIntensity={1}
              enableHover={true}
              color="black"
            >
              404
            </FuzzyText>
          </div>
          <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button to="/" variant="primary">
            <div className="inline-flex justify-center items-start gap-2 group-hover:gap-4 transition-all duration-50">
              <HomeIcon className="w-5 h-5 relative -bottom-[3px]" />
              <span>Go Back Home</span>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
}

export default NotFound;
