import civiLogo from "~/app-shell/assets/civi-temp-logo.png";

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
