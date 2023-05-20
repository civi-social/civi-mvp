// App.tsx
import React, { useState } from "react";
import { Bill } from "~app/modules/for-you";
import { RepLevel } from "~app/modules/levels";

interface ScreenProps {
  onNextStep: () => void;
  num?: number;
}

const Screen: React.FC<ScreenProps> = ({ onNextStep, num }) => {
  return (
    <div>
      <h2>Step {num}</h2>
      {/* Add your form or content for Step 1 here */}
      <button onClick={onNextStep}>Next</button>
    </div>
  );
};

const BillIntro: React.FC<ScreenProps> = ({ onNextStep }) => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          Alder Vasquez wants your opinion on this bill?
        </h1>
        <p className="text-3xl text-gray-600">
          Establishes the Illinois Psilocybin Advisory Board{" "}
        </p>
        <button
          onClick={onNextStep}
          className="mt-4 rounded bg-blue-500 py-2 px-4 text-3xl font-bold text-white hover:bg-blue-700"
        >
          Learn More
        </button>
        {/* <button
          onClick={onNextStep}
          className="mt-4 rounded bg-blue-500 py-2 px-4 text-3xl font-bold text-white hover:bg-blue-700"
        >
          Whatever You Prefer
        </button>
        <div className="italic">(I Trust You Alder)</div> */}
      </div>
    </div>
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
    <div className="flex h-screen flex-col items-center justify-center overflow-y-auto bg-gray-100">
      <div>
        <FakeBill />
      </div>
      {showVote ? (
        <div className="flex">
          <button
            onClick={onNextStep}
            className="m-4 rounded bg-blue-500 py-2 px-4 text-3xl font-bold text-white hover:bg-blue-700"
          >
            Yay
          </button>
          <button
            onClick={onNextStep}
            className="m-4 rounded bg-blue-500 py-2 px-4 text-3xl font-bold text-white hover:bg-blue-700"
          >
            Nay
          </button>
          <button
            onClick={onNextStep}
            className="m-4 rounded bg-blue-500 py-2 px-4 text-3xl font-bold text-white hover:bg-blue-700"
          >
            Present
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowVote(true)}
          className="mt-4 rounded bg-blue-500 py-2 px-4 text-3xl font-bold text-white hover:bg-blue-700"
        >
          Vote
        </button>
      )}
    </div>
  );
};

const VoteOnBill: React.FC<ScreenProps> = ({ onNextStep }) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center overflow-y-auto bg-gray-100 text-center">
      <div className="text-4xl font-bold">
        We will send Alder Vasquez your vote!
      </div>
      <div>We will send a notification once Alder Vasquez votes</div>
      <div>Want to see a template of what we send?</div>
      <button
        onClick={onNextStep}
        className="mt-4 rounded bg-blue-500 py-2 px-4 text-3xl font-bold text-white hover:bg-blue-700"
      >
        One week later
      </button>
    </div>
  );
};

const SignUp: React.FC<ScreenProps> = ({ onNextStep }) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center overflow-y-auto bg-gray-100 text-center">
      <div className="text-4xl font-bold">Sign Up For Our Waitlist</div>
      <div>
        Alder Vasquez and Rep Hoan have committed to joining the site if we get
        500 signatures.
      </div>
      <div>Sign Up?</div>
    </div>
  );
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

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case WizardStep.BillIntroNotification:
        return (
          <Notification
            onNextStep={handleNextStep}
            title="Alder Vasquez wants your opinion on this bill."
            message="It's regarding magic mushrooms."
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
          <>
            <Notification
              onNextStep={handleNextStep}
              title="Alder Vasquez voted in line with your vote!"
              message="Yay."
            />
            <div className="flex h-screen flex-col items-center justify-center overflow-y-auto bg-gray-100 text-center">
              <button
                onClick={handleNextStep}
                className="mt-4 rounded py-2 px-4 text-3xl font-bold text-black hover:bg-blue-700"
              >
                Demo Over! Are you Interested In Making This App A Reality?
              </button>
            </div>
          </>
        );
      case WizardStep.SignUp:
        return <SignUp onNextStep={handleNextStep} />;
      default:
        return null;
    }
  };

  return <div className="container mx-auto">{renderCurrentStep()}</div>;
};

export default App;

const Notification: React.FC<{
  title: string;
  message: string;
  onNextStep: () => void;
}> = ({ title, message, onNextStep }) => {
  return (
    <div className="fixed top-5 left-5 right-5 flex items-center justify-center rounded-md bg-white p-4 shadow-md">
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
  );
};
