import { HomeIcon } from "@heroicons/react/24/outline";
import { Button, FuzzyText } from "../components/";

export function Unauthorized() {
  return (
    <>
      <article>
        <title>401 | IT Tools</title>
        <meta
          name="description"
          content="You don't have permission to access this page."
        />
      </article>
      <div className="mx-auto w-full max-w-5xl px-6 pt-24 pb-12 text-center">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-8 flex items-center justify-center">
            <FuzzyText
              baseIntensity={0.2}
              hoverIntensity={1}
              enableHover={true}
              color="black"
            >
              401
            </FuzzyText>
          </div>
          <h2 className="mb-6 text-3xl font-semibold">Unauthorized Access</h2>
          <p className="mx-auto mb-10 max-w-lg text-xl text-gray-600">
            You don't have permission to access this page. Please log in or
            contact an administrator.
          </p>
          <Button to="/" variant="primary">
            <div className="inline-flex items-start justify-center gap-2 transition-all duration-50 group-hover:gap-4">
              <HomeIcon className="relative -bottom-[3px] h-5 w-5" />
              <span>Go Back Home</span>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
}
