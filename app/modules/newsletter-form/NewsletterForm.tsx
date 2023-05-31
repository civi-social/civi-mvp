import React from "react";

export const NewsletterForm = () => (
  <section
    className=" flex flex-col items-center 
justify-center p-4"
  >
    <h2 className="mb-2 text-center text-xl font-bold">Like what you see?</h2>
    <h3 className="text-center italic">
      Sign up! We need 500 people from the 40th Ward on our waiting list
    </h3>
    <form
      className="w-full max-w-sm justify-center"
      action="https://social.us11.list-manage.com/subscribe/post?u=5d27cdfc23603091d05858a9b&amp;id=e52325cbc0&amp;f_id=00f5a6e0f0"
      method="post"
    >
      <div className="flex items-center border-b border-secondary-400 py-2">
        <input
          className="mr-3 w-full appearance-none border-none bg-transparent py-1 px-2 leading-tight text-gray-700 focus:outline-none"
          type="email"
          name="EMAIL"
          placeholder="email address"
          aria-label="E-mail Address"
        />
        <div
          style={{ position: "absolute", left: "-5000px" }}
          aria-hidden="true"
        >
          <input
            type="text"
            name="b_5d27cdfc23603091d05858a9b_e52325cbc0"
            tabIndex={-1}
            value=""
          />
        </div>
        <button
          className="flex-shrink-0 rounded border-4 border-secondary-400 bg-secondary-400 py-1 px-2 text-sm text-zinc-50 hover:border-secondary-200 hover:bg-secondary-200 hover:text-gray-800"
          type="submit"
          name="submit"
        >
          Sign Up For Our Waitlist
        </button>
      </div>
    </form>
  </section>
);
