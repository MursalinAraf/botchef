import { Form, Field } from "react-final-form";
import { Button, Alert } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useSignupMutation } from "./authApi";
import { setCredentials } from "./authSlice";
import AuthLeftPanel from "./components/AuthLeftPanel";

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();

  const onSubmit = async (values) => {
    try {
      const result = await signup(values).unwrap();
      dispatch(
        setCredentials({
          token: result.token,
          user: result.user,
        }),
      );
      navigate("/dashboard");
    } catch (err) {
      const errors = err.data?.errors;
      if (errors?.length) {
        return { FORM_ERROR: errors.join(", ") };
      }
      return { FORM_ERROR: "Something went wrong. Please try again." };
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.first_name) errors.first_name = "Required";
    if (!values.last_name) errors.last_name = "Required";
    if (!values.email) errors.email = "Required";
    if (!values.password) errors.password = "Required";
    if (!values.password_confirmation) {
      errors.password_confirmation = "Required";
    } else if (values.password !== values.password_confirmation) {
      errors.password_confirmation = "Passwords do not match";
    }
    return errors;
  };

  return (
    <div className="min-h-screen grid grid-cols-2">
      <AuthLeftPanel
        title="Start your free 14-day trial"
        subtitle="No credit card needed. Get your chatbot live in minutes."
        features={[
          "Setup in under 5 minutes",
          "No technical knowledge needed",
          "Cancel anytime",
        ]}
      />

      <div className="flex flex-col justify-center px-16 py-12 bg-white">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">
          Create your account
        </h1>
        <p className="text-sm text-gray-500 mb-7">
          Get started with your free trial today
        </p>

        <Form onSubmit={onSubmit} validate={validate}>
          {({ handleSubmit, submitError }) => (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {submitError && (
                <Alert message={submitError} type="error" showIcon />
              )}

              <div className="grid grid-cols-2 gap-3">
                <Field name="first_name">
                  {({ input, meta }) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-500">
                        First name
                      </label>
                      <input
                        {...input}
                        type="text"
                        placeholder="Ahmed"
                        className={`border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors
                          ${
                            meta.touched && meta.error
                              ? "border-red-400"
                              : "border-gray-200 focus:border-emerald-500"
                          }`}
                      />
                      {meta.touched && meta.error && (
                        <span className="text-xs text-red-500">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  )}
                </Field>

                <Field name="last_name">
                  {({ input, meta }) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-500">
                        Last name
                      </label>
                      <input
                        {...input}
                        type="text"
                        placeholder="Rahman"
                        className={`border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors
                          ${
                            meta.touched && meta.error
                              ? "border-red-400"
                              : "border-gray-200 focus:border-emerald-500"
                          }`}
                      />
                      {meta.touched && meta.error && (
                        <span className="text-xs text-red-500">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  )}
                </Field>
              </div>

              <Field name="email">
                {({ input, meta }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">
                      Email address
                    </label>
                    <input
                      {...input}
                      type="email"
                      placeholder="ahmed@restaurant.com"
                      className={`border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors
                        ${
                          meta.touched && meta.error
                            ? "border-red-400"
                            : "border-gray-200 focus:border-emerald-500"
                        }`}
                    />
                    {meta.touched && meta.error && (
                      <span className="text-xs text-red-500">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>

              <Field name="password">
                {({ input, meta }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">
                      Password
                    </label>
                    <input
                      {...input}
                      type="password"
                      placeholder="••••••••"
                      className={`border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors
                        ${
                          meta.touched && meta.error
                            ? "border-red-400"
                            : "border-gray-200 focus:border-emerald-500"
                        }`}
                    />
                    {meta.touched && meta.error ? (
                      <span className="text-xs text-red-500">{meta.error}</span>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Minimum 6 characters
                      </span>
                    )}
                  </div>
                )}
              </Field>

              <Field name="password_confirmation">
                {({ input, meta }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">
                      Confirm password
                    </label>
                    <input
                      {...input}
                      type="password"
                      placeholder="••••••••"
                      className={`border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors
                        ${
                          meta.touched && meta.error
                            ? "border-red-400"
                            : "border-gray-200 focus:border-emerald-500"
                        }`}
                    />
                    {meta.touched && meta.error && (
                      <span className="text-xs text-red-500">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>

              <Button
                htmlType="submit"
                loading={isLoading}
                block
                style={{
                  background: "#059669",
                  borderColor: "#059669",
                  color: "white",
                  height: 42,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Create account
              </Button>

              <p className="text-xs text-center text-gray-400">
                By signing up you agree to our{" "}
                <span className="text-emerald-600 cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-emerald-600 cursor-pointer">
                  Privacy Policy
                </span>
              </p>

              <p className="text-xs text-center text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-emerald-600 font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </Form>
      </div>
    </div>
  );
}
