import { Form, Field } from "react-final-form";
import { Button, Alert } from "antd";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSignupMutation } from "./authApi";
import { setCredentials } from "./authSlice";
import AuthLeftPanel from "./components/AuthLeftPanel";
import useAppNavigate from "hooks/useAppNavigate";
import { ROUTES } from "app/routes";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function SignupPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { toDashboard } = useAppNavigate();
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
      toDashboard();
    } catch (err) {
      const errors = err.data?.errors;
      if (errors?.length) {
        return { FORM_ERROR: errors.join(", ") };
      }
      return { FORM_ERROR: t("auth.signup.something_wrong") };
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.first_name) errors.first_name = t("auth.validation.required");
    if (!values.last_name) errors.last_name = t("auth.validation.required");
    if (!values.email) errors.email = t("auth.validation.required");
    if (!values.password) errors.password = t("auth.validation.required");
    if (!values.password_confirmation) {
      errors.password_confirmation = t("auth.validation.required");
    } else if (values.password !== values.password_confirmation) {
      errors.password_confirmation = t("auth.signup.passwords_not_match");
    }
    return errors;
  };

  return (
    <div className="min-h-screen grid grid-cols-2">
      <AuthLeftPanel
        title={t("auth.left_panel.signup.title")}
        subtitle={t("auth.left_panel.signup.subtitle")}
        features={t("auth.left_panel.signup.features", { returnObjects: true })}
      />

      <div className="flex flex-col justify-center px-16 py-12 bg-white">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>

        <div className="flex flex-col justify-center px-16 py-12 bg-white">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">
            {t("auth.signup.title")}
          </h1>
          <p className="text-sm text-gray-500 mb-7">
            {t("auth.signup.subtitle")}
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
                          {t("auth.signup.first_name")}
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
                          {t("auth.signup.last_name")}
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
                        {t("auth.signup.email")}
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
                        <span className="text-xs text-red-500">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  )}
                </Field>

                <Field name="password">
                  {({ input, meta }) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-500">
                        {t("auth.signup.password")}
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
                        <span className="text-xs text-red-500">
                          {meta.error}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {t("auth.signup.password_hint")}
                        </span>
                      )}
                    </div>
                  )}
                </Field>

                <Field name="password_confirmation">
                  {({ input, meta }) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-500">
                        {t("auth.signup.confirm_password")}
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
                        <span className="text-xs text-red-500">
                          {meta.error}
                        </span>
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
                  {t("auth.signup.submit")}
                </Button>

                <p className="text-xs text-center text-gray-400">
                  {t("auth.signup.terms")}{" "}
                  <span className="text-emerald-600 cursor-pointer">
                    {t("auth.signup.terms_link")}
                  </span>{" "}
                  {t("auth.signup.and")}{" "}
                  <span className="text-emerald-600 cursor-pointer">
                    {t("auth.signup.privacy_link")}
                  </span>
                </p>

                <p className="text-xs text-center text-gray-500">
                  {t("auth.signup.have_account")}{" "}
                  <Link
                    to={ROUTES.login}
                    className="text-emerald-600 font-medium"
                  >
                    {t("auth.signup.sign_in")}
                  </Link>
                </p>
              </form>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
}
