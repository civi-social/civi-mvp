import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";
import { FaChevronLeft } from "react-icons/fa";

import { getUserId, createUserSession } from "~/session.server";

import { createUser, getUserByEmail } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const address = formData.get("address") as string;
  const password = formData.get("password") as string;
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const user = await createUser({
    email,
    firstName,
    lastName,
    address,
    password,
  });

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData() as ActionData;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const firstNameRef = React.useRef<HTMLInputElement>(null);
  const lastNameRef = React.useRef<HTMLInputElement>(null);
  const addressRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="w-full max-w-md px-8 py-10">
      <div className="text-right">
        <Link
          className="link link-hover mb-4 inline-flex items-center"
          to="/search"
        >
          <FaChevronLeft className="mr-1 inline-flex" />
          Search
        </Link>
      </div>

      <Form method="post" className="space-y-6" noValidate>
        <div>
          <label htmlFor="email" className="label">
            <span className="label-text">Email address</span>
          </label>
          <input
            ref={emailRef}
            id="email"
            required
            autoFocus={true}
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={actionData?.errors?.email ? true : undefined}
            aria-describedby="email-error"
            className={`input input-bordered w-full max-w-sm ${
              actionData?.errors?.email ? "input-error" : ""
            }`}
          />
          {actionData?.errors?.email && (
            <label className="label" id="email-error">
              <span className="label-text-alt text-error">
                {actionData.errors.email}
              </span>
            </label>
          )}
        </div>

        <div className="flex gap-x-2">
          <div className="flex-1">
            <label htmlFor="firstName" className="label">
              <span className="label-text">First name</span>
            </label>
            <input
              ref={firstNameRef}
              id="firstName"
              required
              name="firstName"
              type="text"
              autoComplete="given-name"
              aria-invalid={actionData?.errors?.firstName ? true : undefined}
              aria-describedby="firstName-error"
              className={`input input-bordered w-full max-w-sm ${
                actionData?.errors?.firstName ? "input-error" : ""
              }`}
            />
            {actionData?.errors?.firstName && (
              <label className="label" id="firstName-error">
                <span className="label-text-alt text-error">
                  {actionData.errors.firstName}
                </span>
              </label>
            )}
          </div>
          <div className="flex-1">
            <label htmlFor="lastName" className="label">
              <span className="label-text">Last name</span>
            </label>
            <input
              ref={lastNameRef}
              id="lastName"
              required
              name="lastName"
              type="text"
              autoComplete="given-name"
              aria-invalid={actionData?.errors?.lastName ? true : undefined}
              aria-describedby="lastName-error"
              className={`input input-bordered w-full max-w-sm ${
                actionData?.errors?.lastName ? "input-error" : ""
              }`}
            />
            {actionData?.errors?.lastName && (
              <label className="label" id="lastName-error">
                <span className="label-text-alt text-error">
                  {actionData.errors.lastName}
                </span>
              </label>
            )}
          </div>
        </div>

        <div className="flex-1">
          <label htmlFor="address" className="label">
            <span className="label-text">Home address</span>
          </label>
          <input
            ref={addressRef}
            id="address"
            required
            name="address"
            type="text"
            aria-invalid={actionData?.errors?.address ? true : undefined}
            aria-describedby="address-error"
            className={`input input-bordered w-full max-w-sm ${
              actionData?.errors?.address ? "input-error" : ""
            }`}
          />
          {actionData?.errors?.address && (
            <label className="label" id="address-error">
              <span className="label-text-alt text-error">
                {actionData.errors.address}
              </span>
            </label>
          )}
        </div>

        <div>
          <label htmlFor="password" className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            id="password"
            ref={passwordRef}
            name="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={actionData?.errors?.password ? true : undefined}
            aria-describedby="password-error"
            className={`input input-bordered w-full max-w-sm ${
              actionData?.errors?.password ? "input-error" : ""
            }`}
          />
          {actionData?.errors?.password && (
            <label className="label" id="password-error">
              <span className="label-text-alt text-error">
                {actionData.errors.password}
              </span>
            </label>
          )}
        </div>

        <input type="hidden" name="redirectTo" value={redirectTo} />
        <button
          type="submit"
          className="btn w-full rounded bg-indigo-500 py-2 px-4 text-white hover:bg-indigo-600 focus:bg-indigo-400"
        >
          Create Account
        </button>
        <div className="flex items-center justify-center">
          <div className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              className="link link-hover"
              to={{
                pathname: "/login",
                search: searchParams.toString(),
              }}
            >
              Log in
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
}
