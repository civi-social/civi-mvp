// App.tsx
import React, { useState } from "react";
import { Bill } from "~app/modules/for-you";
import { RepLevel } from "~app/modules/levels";
import { NewsletterForm } from "~app/modules/newsletter-form/NewsletterForm";
import civiLogo from "~/app-shell/assets/civi-temp-logo.png";
import { Link } from "@remix-run/react";

const Card: React.FC = ({ children }) => {
  return <div className="bg-white p-4 text-center shadow">{children}</div>;
};

const AppCTA: React.FC<{
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mt-4 rounded bg-primary-600 py-2 px-4 font-bold uppercase text-white hover:bg-blue-700"
    >
      {children}
    </button>
  );
};

const PhoneShell: React.FC = ({ children }) => {
  return <div className="m-2 rounded-lg border-8 border-black">{children}</div>;
};

const HomeLockScreen: React.FC = ({ children }) => {
  return (
    <PhoneShell>
      <div
        style={{
          backgroundImage: "url(https://9to5mac.com/?attachment_id=818555)",
          backgroundSize: "cover",
          minHeight: "600px",
        }}
      >
        <StatusBar />
        <div className="p-2"> {children}</div>
      </div>
    </PhoneShell>
  );
};

const CiviAppContainer: React.FC<ScreenProps> = ({ children }) => {
  return (
    <PhoneShell>
      <StatusBar />
      <div className="p-4" style={{ height: "500px", overflowY: "auto" }}>
        <div className="mt-4 flex items-center justify-center">{children}</div>
      </div>
    </PhoneShell>
  );
};

const StatusBar = () => (
  <div className="flex items-center justify-between bg-black p-1">
    <div className="text-xs text-white">
      <p>Carrier</p>
    </div>
    <div className="flex gap-1">
      <div className="h-1 w-1 rounded-full bg-white"></div>
      <div className="h-1 w-1 rounded-full bg-white"></div>
      <div className="h-1 w-1 rounded-full bg-white"></div>
      <div className="h-1 w-1 rounded-full bg-white"></div>
      <div className="h-1 w-1 rounded-full bg-white"></div>
    </div>
    <div className="text-xs text-white">
      <p>9:41 AM</p>
    </div>
  </div>
);

const Notification: React.FC<{
  title: string;
  message?: string;
  onNextStep: () => void;
}> = ({ title, message, onNextStep }) => {
  return (
    <HomeLockScreen>
      <div className="flex items-center justify-center rounded-md bg-white p-4 shadow-md">
        <div className="mr-3 flex-shrink-0">
          <svg
            className="h-6 w-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3h0l9 9h0l-9 9h0l-9-9h0l9-9Z"
            />
          </svg>
        </div>
        <div role="button" onClick={onNextStep}>
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </HomeLockScreen>
  );
};

interface ScreenProps {
  onNextStep: () => void;
  num?: number;
}

const BillIntro: React.FC<ScreenProps> = ({ onNextStep }) => {
  return (
    <CiviAppContainer onNextStep={onNextStep}>
      <Card>
        <h1 className="text-2xl font-bold">
          Your Representative is requesting you to vote on this bill.
        </h1>
        <p className="text-xl italic text-slate-600">
          Establish the Illinois Psilocybin Advisory Board{" "}
        </p>
        <AppCTA onClick={onNextStep}>Learn More</AppCTA>
        {/* <button
          onClick={onNextStep}
          className="mt-4 rounded bg-blue-500 py-2 px-4 text-3xl font-bold text-white hover:bg-blue-700"
        >
          Whatever You Prefer
        </button>
        <div className="italic">(I Trust You Alder)</div> */}
      </Card>
    </CiviAppContainer>
  );
};

const FakeBill = () => {
  return (
    <Bill
      gpt={{
        gpt_summary:
          "Illinois is considering creating a board to advise on the use of a drug called psilocybin. The board would help decide who can make and distribute the drug for medical purposes.",
        gpt_tags: ["Health Care"],
      }}
      level={RepLevel.State}
      bill={
        {
          id: "23423",
          title: "Compassionate Use and Research of Entheogens Act",
          statusDate: "2023-03-02",
          link: "https://www.ilga.gov/legislation/BillStatus.asp?DocNum=1&GAID=17&DocTypeID=HB&SessionID=112&GA=103",
          description:
            "Establishes the Illinois Psilocybin Advisory Board within the Department of Public Health for the purpose of advising and making recommendations to the Department regarding the provision of psilocybin and psilocybin services. Provides that the Department shall begin receiving applications for the licensing of persons to manufacture or test psilocybin products, operate service centers, or facilitate psilocybin services.",
        } as any
      }
    />
  );
};

const BillInformation: React.FC<ScreenProps> = ({ onNextStep }) => {
  const [showVote, setShowVote] = React.useState(false);
  return (
    <CiviAppContainer onNextStep={onNextStep}>
      <div className="flex flex-col items-center justify-center">
        <div>
          <FakeBill />
        </div>
        {showVote ? (
          <div className="flex gap-1">
            <AppCTA onClick={onNextStep}>Yay</AppCTA>
            <AppCTA onClick={onNextStep}>Nay</AppCTA>
            <AppCTA onClick={onNextStep}>Present</AppCTA>
          </div>
        ) : (
          <AppCTA onClick={() => setShowVote(true)}>Vote</AppCTA>
        )}
      </div>
    </CiviAppContainer>
  );
};

const VoteOnBill: React.FC<ScreenProps> = ({ onNextStep }) => {
  return (
    <CiviAppContainer onNextStep={onNextStep}>
      <Card>
        <div className="text-xl font-bold">
          We will send the legislator your vote!
        </div>
        <div>
          We will send a notification once your legislator votes in 1 week.
        </div>
        <AppCTA onClick={onNextStep}>Time Travel 1 Week</AppCTA>
      </Card>
    </CiviAppContainer>
  );
};

const SignUp: React.FC<ScreenProps> = ({ onNextStep }) => {
  return <NewsletterForm />;
};

enum WizardStep {
  BillIntroNotification,
  BillIntro,
  BillInformation,
  VoteOnBill,
  BillSummaryNotification,
  SignUp,
}

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(
    WizardStep.BillIntroNotification
  );

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  // const handlePrevStep = () => {
  //   setCurrentStep((prevStep) => prevStep - 1);
  // };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case WizardStep.BillIntroNotification:
        return (
          <Notification
            onNextStep={handleNextStep}
            title="Your Representative is requesting your vote on a bill!"
          />
        );
      case WizardStep.BillIntro:
        return <BillIntro onNextStep={handleNextStep} />;
      case WizardStep.BillInformation:
        return <BillInformation onNextStep={handleNextStep} num={2} />;
      case WizardStep.VoteOnBill:
        return <VoteOnBill onNextStep={handleNextStep} num={3} />;
      case WizardStep.BillSummaryNotification:
        return (
          <Notification
            onNextStep={handleNextStep}
            title="Your Representative voted in line with your vote!"
          />
        );
      case WizardStep.SignUp:
        return <SignUp onNextStep={handleNextStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-gray-100">
      <div className="w-full max-w-sm">
        <div className="container mx-auto p-2">
          <div className="mb-2 flex justify-center text-center">
            <Link to="/">
              <img
                src={civiLogo}
                alt="Civi's Logo"
                style={{ height: "30px" }}
              />
            </Link>
          </div>
          <div className="text-center font-serif text-sm uppercase">
            <div>The 40th Ward Experiment Demo</div>
          </div>
          <div className="p-2 text-center">
            {currentStep !== WizardStep.SignUp && (
              <button
                className="rounded bg-secondary-400 px-2 py-1 uppercase text-white"
                onClick={handleNextStep}
              >
                Next
              </button>
            )}
          </div>
          <div>{renderCurrentStep()}</div>
        </div>
      </div>
    </div>
  );
};

export default App;
