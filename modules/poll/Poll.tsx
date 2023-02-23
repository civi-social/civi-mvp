import React from "react";
import { Skin, Spacing } from "~/ui/styles";

const LivePoll = ({
  handleSubmit,
  pollText,
  subText,
  extraText,
}: {
  pollText: string;
  subText: string;
  extraText?: string;
  handleSubmit: Function;
}) => {
  return (
    <div className="bold p-4 text-black">
      <div className="bold mb-4 text-xl">{pollText}</div>
      <div className="italic">{subText}</div>
      <div className="bold">{extraText || "How should they vote?"}</div>
      <div className="mt-4">
        {["Yay", "Nay", "Present"].map((s) => (
          <div
            className="mb-4 flex items-center justify-center"
            key={s}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              borderRadius: "9px",
              color: Skin.Black,
              border: "1px solid #9a949475",
              padding: Spacing.THREE,
            }}
          >
            <input
              id={s}
              type="radio"
              value=""
              name={s}
              className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            />
            <label
              htmlFor={s}
              className="text-white-900 ml-2 text-lg font-medium"
            >
              {s}
            </label>
          </div>
        ))}
        <button
          onClick={() => handleSubmit()}
          className="bold rounded bg-green-600 px-4 py-2 uppercase text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

const SubmittedPoll = () => {
  return (
    <div className="bold bg-gray-100 p-4 text-black">
      Your Vote Has Been Submitted. Results Will Be Shown On November 26.
    </div>
  );
};

const FinishedPoll = () => {
  return (
    <div>
      <div className="mb-4 text-xl uppercase">Poll Results</div>
      <div className="mt-4 pt-4">
        {["Yay: 53%", "Nay: 32%", "Present: 15%"].map((s) => (
          <div className="mb-4 flex items-center justify-center " key={s}>
            <label
              htmlFor={s}
              className="text-white-900 ml-2 text-xl font-medium"
            >
              {s}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

enum States {
  LIVE,
  SUBMITTED,
  FINISHED,
}

export const Poll1 = () => {
  let done = false;
  if (global.window) {
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);
    if (params.get("done")) {
      done = true;
    }
  }

  const [state, setState] = React.useState<States>(
    done ? States.FINISHED : States.LIVE
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      key={state}
    >
      <div
        className="border-radius m-4 border p-4"
        style={{ maxWidth: "400px", boxShadow: "0px 2px 3px rgba(0,0,0,0.3)" }}
      >
        {(() => {
          switch (state) {
            case States.LIVE:
              return (
                <LivePoll
                  pollText="Add Dedicated Bike Lane On Halsted From Chicago Ave to Sheridan"
                  subText="Alderperson is voting Thursday Dec 1"
                  handleSubmit={() => setState(States.SUBMITTED)}
                />
              );
            case States.SUBMITTED:
              return <SubmittedPoll />;
            case States.FINISHED:
              return <FinishedPoll />;
          }
        })()}
      </div>
    </div>
  );
};

export const Poll2 = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="border-radius m-4 border p-4"
        style={{ maxWidth: "400px", boxShadow: "0px 2px 3px rgba(0,0,0,0.3)" }}
      >
        <LivePoll
          pollText="Call for City of Chicago to take Equity in Infrastructure Project pledge"
          subText="Alderperson is voting Thursday Jan 30"
          handleSubmit={() => {}}
        />
      </div>
    </div>
  );
};

export const Poll = () => {
  return (
    <>
      <Poll1 />
      <Poll2 />
    </>
  );
};

export const DynamicPoll = ({
  pollText,
  subText,
  extraText,
}: {
  pollText: string;
  subText: string;
  extraText: string;
}) => {
  let done = false;
  if (global.window) {
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);
    if (params.get("done")) {
      done = true;
    }
  }

  const [state, setState] = React.useState<States>(
    done ? States.FINISHED : States.LIVE
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      key={state}
    >
      <div
        className="border-radius m-4 border p-4"
        style={{ maxWidth: "400px", boxShadow: "0px 2px 3px rgba(0,0,0,0.3)" }}
      >
        {(() => {
          switch (state) {
            case States.LIVE:
              return (
                <LivePoll
                  pollText={pollText}
                  subText={subText}
                  extraText={extraText}
                  handleSubmit={() => setState(States.SUBMITTED)}
                />
              );
            case States.SUBMITTED:
              return <SubmittedPoll />;
            case States.FINISHED:
              return <FinishedPoll />;
          }
        })()}
      </div>
    </div>
  );
};
