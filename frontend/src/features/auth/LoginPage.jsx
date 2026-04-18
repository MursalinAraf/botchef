import { Form, Field } from "react-final-form";
import { Button, Alert } from "antd";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useLoginMutation } from "./authApi";
import { setCredentials } from "./authSlice";
import AuthLeftPanel from "./components/AuthLeftPanel";
import useAppNavigate from "../../hooks/useAppNavigate";

export default function LoginPage() {
  const dispatch = useDispatch();
  const {toDashboard} = useAppNavigate()
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (values) => {
    try {
      const result = await login(values).unwrap();
      dispatch(
        setCredentials({
          token: result.token,
          user: result.user,
        }),
      );
      toDashboard()
      
    } catch (err) {
      return { FORM_ERROR: err.data?.error || "Invalid email or password." };
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.email) errors.email = "Required";
    if (!values.password) errors.password = "Required";
    return errors;
  };

  return (
    <div className="min-h-screen grid grid-cols-2">
      <AuthLeftPanel
        title="Welcome back to BotChef"
        subtitle="Manage your restaurant chatbots and delight your customers 24/7."
        features={[
          "AI-powered chatbot for your restaurant",
          "Animated mascot unique to your brand",
          "One line embed — live in 5 minutes",
        ]}
      />

      <div className="flex flex-col justify-center px-16 py-12 bg-white">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">Sign in</h1>
        <p className="text-sm text-gray-500 mb-7">
          Enter your credentials to access your dashboard
        </p>

        <Form onSubmit={onSubmit} validate={validate}>
          {({ handleSubmit, submitError }) => (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {submitError && (
                <Alert message={submitError} type="error" showIcon />
              )}

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
                    {meta.touched && meta.error && (
                      <span className="text-xs text-red-500">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>

              <div className="text-right -mt-2">
                <span className="text-xs text-emerald-600 cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>

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
                Sign in
              </Button>

              <p className="text-xs text-center text-gray-500">
                {"Don't have an account?"}{" "}
                <Link to="/signup" className="text-emerald-600 font-medium">
                  Create one
                </Link>
              </p>
            </form>
          )}
        </Form>
      </div>
    </div>
  );
}
