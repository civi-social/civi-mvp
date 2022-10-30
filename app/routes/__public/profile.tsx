import type {
    ActionFunction,  
    LoaderFunction,
    MetaFunction,
  } from "@remix-run/node";
  import { json, redirect } from "@remix-run/node";
  import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
  import * as React from "react";
  import { FaChevronLeft } from "react-icons/fa";
  
  import { createUserSession, getUserId } from "~/session.server";
  import { verifyLogin } from "~/models/user.server";
  import { safeRedirect, validateEmail } from "~/utils";
  
  export const loader: LoaderFunction = async ({ request }) => {
    const userId = await getUserId(request);
    if (userId) return redirect("/");
    return json({});
  };
  
  interface ActionData {
    errors?: {
      email?: string;
      password?: string;
    };
  }
  
  // export const action: ActionFunction = async ({ request }) => {
  //   const formData = await request.formData();
  //   const email = formData.get("email");
  //   const password = formData.get("password");
  //   const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  //   const remember = formData.get("remember");
  
  //   if (!validateEmail(email)) {
  //     return json<ActionData>(
  //       { errors: { email: "Email is invalid" } },
  //       { status: 400 }
  //     );
  //   }
  
  //   if (typeof password !== "string" || password.length === 0) {
  //     return json<ActionData>(
  //       { errors: { password: "Password is required" } },
  //       { status: 400 }
  //     );
  //   }
  
  //   if (password.length < 8) {
  //     return json<ActionData>(
  //       { errors: { password: "Password is too short" } },
  //       { status: 400 }
  //     );
  //   }
  
  //   const user = await verifyLogin(email, password);
  
  //   if (!user) {
  //     return json<ActionData>(
  //       { errors: { email: "Invalid email or password" } },
  //       { status: 400 }
  //     );
  //   }
  
  //   return createUserSession({
  //     request,
  //     userId: user.id,
  //     remember: remember === "on" ? true : false,
  //     redirectTo,
  //   });
  // };
  
  // export const meta: MetaFunction = () => {
  //   return {
  //     title: "Login",
  //   };
  // };
  
  export default function ProfilePage() {
    // const [searchParams] = useSearchParams();
    // const redirectTo = searchParams.get("redirectTo") || "/";
    // const actionData = useActionData() as ActionData;
    // const emailRef = React.useRef<HTMLInputElement>(null);
    // const passwordRef = React.useRef<HTMLInputElement>(null);
  
    // React.useEffect(() => {
    //   if (actionData?.errors?.email) {
    //     emailRef.current?.focus();
    //   } else if (actionData?.errors?.password) {
    //     passwordRef.current?.focus();
    //   }
    // }, [actionData]);
  
    return (
      // <div className="mx-auto w-full max-w-md px-8 py-10">
      //   <div className="text-right">
      //     <Link
      //       className="link link-hover mb-4 inline-flex items-center"
      //       to="/search"
      //     >
      //       <FaChevronLeft className="mr-1 inline-flex" />
      //       Search
      //     </Link>
      //   </div>
  
      //   <Form method="post" className="space-y-6" noValidate>
      //     <div>
      //       <label htmlFor="email" className="label">
      //         <span className="label-text">Email address</span>
      //       </label>
      //       <input
      //         ref={emailRef}
      //         id="email"
      //         required
      //         autoFocus={true}
      //         name="email"
      //         type="email"
      //         autoComplete="email"
      //         aria-invalid={actionData?.errors?.email ? true : undefined}
      //         aria-describedby="email-error"
      //         className={`input input-bordered w-full max-w-sm ${
      //           actionData?.errors?.email ? "input-error" : ""
      //         }`}
      //       />
      //       {actionData?.errors?.email && (
      //         <label className="label" id="email-error">
      //           <span className="label-text-alt text-error">
      //             {actionData.errors.email}
      //           </span>
      //         </label>
      //       )}
      //     </div>
  
      //     <div>
      //       <label htmlFor="password" className="label">
      //         <span className="label-text">Password</span>
      //       </label>
      //       <div className="mt-1">
      //         <input
      //           id="password"
      //           ref={passwordRef}
      //           name="password"
      //           type="password"
      //           autoComplete="current-password"
      //           aria-invalid={actionData?.errors?.password ? true : undefined}
      //           aria-describedby="password-error"
      //           className={`input input-bordered w-full max-w-sm ${
      //             actionData?.errors?.password ? "input-error" : ""
      //           }`}
      //         />
      //         {actionData?.errors?.password && (
      //           <label className="label" id="password-error">
      //             <span className="label-text-alt text-error">
      //               {actionData.errors.password}
      //             </span>
      //           </label>
      //         )}
      //       </div>
      //     </div>
  
      //     <input type="hidden" name="redirectTo" value={redirectTo} />
      //     <button
      //       type="submit"
      //       className="btn w-full rounded bg-indigo-500 py-2 px-4 text-white hover:bg-indigo-600 focus:bg-indigo-400"
      //     >
      //       Log in!!!!!
      //     </button>
      //     <div className="flex items-center justify-between">
      //       <div className="flex items-center">
      //         <input
      //           id="remember"
      //           name="remember"
      //           type="checkbox"
      //           className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      //         />
      //         <label htmlFor="remember" className="label ml-2">
      //           <span className="label-text-alt">Remember me</span>
      //         </label>
      //       </div>
      //       <div className="text-center text-sm text-gray-500">
      //         Don't have an account?{" "}
      //         <Link className="link link-hover" to="/join">
      //           Sign up
      //         </Link>
      //       </div>
      //     </div>
      //   </Form>
      // </div>
      <div className="p-16">
<div className="p-8 bg-white shadow mt-24">
  <div className="grid grid-cols-1 md:grid-cols-3">
    <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
      <div>
        <p className="font-bold text-yellow-700 text-xl">?</p>
        <p className="text-gray-400">vote streak</p>
      </div>
      <div>
           <p className="font-bold text-green-700 text-xl">2022</p>
        <p className="text-gray-400">member since</p>
      </div>
          <div>
           <p className="font-bold text-red-700 text-xl">no</p>
        <p className="text-gray-400">verified neighbor</p>
      </div>

    </div>
    <div className="relative">
      
      <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
<svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
</svg>
      </div>
    </div>

    <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
<button
  className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
>
  Connect
</button>
    <button
  className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
>
  Message
</button>
    </div>
  </div>

  <div className="mt-20 text-center border-b pb-12">
  <button
  className="text-indigo-500 py-2 px-4  font-medium mb-4"
>
  Do you know Rene?  Help them get verified, it's EASY!
</button>
    <h1 className="text-4xl font-medium text-gray-700">Rene R.</h1>
    <p className="font-light text-gray-600 mt-3">Chicago, Illinois</p>
    <p className="mt-8 text-black-900 font-bold">Self-Reported Political Scores:</p>
    <p className="mt-2 text-gray-500">Importance of Democracy: 9 - Very pro-Democracy  </p>
    <p className="mt-2 text-gray-500">Social Views: 10 - Very Liberal </p>
    <p className="mt-2 text-gray-500">Engagement: 6 - Somewhat Engaged </p>
  </div>

  <div className="mt-12 flex flex-col justify-center">
    <p className="text-gray-600 text-center font-light lg:px-16">Hi Neighbors! I'm Rene, and I'm excited to be here!  I've never been very actvie in politics, but am looking forward to changing that and engaging with my neighbors and local officials!</p>
  </div>

</div>
</div>
    );
  }
  