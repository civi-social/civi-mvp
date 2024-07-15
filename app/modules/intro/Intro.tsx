import civiLogo from "~/app-shell/assets/civi-temp-logo.png";
import { CardSection, CardTitle, Spacing } from "~/ui";
import { useDemoContent } from "../demos/Demos";

export const IntroContent = () => {
  return (
    <div className="flex flex-col rounded text-white">
      <div className="flex justify-start pb-2">
        <img
          src={civiLogo}
          alt="Civi Logo"
          className="h-8"
          style={{
            filter: "brightness(0) invert(1)",
          }}
        />
      </div>
      <div className="pt-2 font-serif text-3xl">Chicago!</div>
      <div className="mt-4 font-serif text-2xl font-semibold leading-tight ">
        We Want To Help You Engage With The Legislation That Impacts You
      </div>
    </div>
  );
};

// Keeping this for future updates
export const CiviUpdates = () => {
  return (
    <>
      {/* <CardSection>
      </CardSection> */}
    </>
  );
};
