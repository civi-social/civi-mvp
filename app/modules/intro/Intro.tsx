import civiLogo from "~/app-shell/assets/civi-temp-logo.png";
import { CardSection, CardTitle, Spacing } from "~/ui";
import { useDemoContent } from "../demos/Demos";

export const IntroContent = () => {
  return (
    <div className="flex flex-col rounded text-white">
      <div className="flex justify-start pb-2">
        <Logo />
      </div>
    </div>
  );
};

export const Logo = () => {
  return (
    <img
      src={civiLogo}
      alt="Windy Civi Logo"
      className="h-8"
      style={{
        filter: "brightness(0) invert(1)",
      }}
    />
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
