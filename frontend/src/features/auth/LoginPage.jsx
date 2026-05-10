import { Form, Field } from "react-final-form";
import { Button, Alert } from "antd";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLoginMutation } from "./authApi";
import { setCredentials } from "./authSlice";
import AuthLeftPanel from "./components/AuthLeftPanel";
import useAppNavigate from "hooks/useAppNavigate";
import { ROUTES } from "app/routes";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { inputClass } from "utils/formStyles";

export default function LoginPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { toDashboard } = useAppNavigate();
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
      toDashboard();
    } catch (err) {
      return {
        FORM_ERROR: err.data?.error || t("auth.login.invalid_credentials"),
      };
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.email) errors.email = t("auth.validation.required");
    if (!values.password) errors.password = t("auth.validation.required");
    return errors;
  };

  return (
    <div className="min-h-screen grid grid-cols-2">
      <AuthLeftPanel
        title={t("auth.left_panel.login.title")}
        subtitle={t("auth.left_panel.login.subtitle")}
        features={t("auth.left_panel.login.features", { returnObjects: true })}
      />

      <div className="flex flex-col justify-center px-16 py-12 bg-white">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>

        <div className="flex flex-col justify-center px-16 py-12 bg-white">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">
            {t("auth.login.title")}
          </h1>
          <p className="text-sm text-gray-500 mb-7">
            {t("auth.login.subtitle")}
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
                        {t("auth.login.email")}
                      </label>
                      <input
                        {...input}
                        type="email"
                        placeholder="ahmed@restaurant.com"
                        className={inputClass(meta.touched, meta.error)}
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
                        {t("auth.login.password")}
                      </label>
                      <input
                        {...input}
                        type="password"
                        placeholder="••••••••"
                        className={inputClass(meta.touched, meta.error)}
                      />
                      {meta.touched && meta.error && (
                        <span className="text-xs text-red-500">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  )}
                </Field>

                <div className="text-right -mt-2">
                  <span className="text-xs text-emerald-600 cursor-pointer hover:underline">
                    {t("auth.login.forgot_password")}
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
                  {t("auth.login.submit")}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  {t("auth.login.no_account")}{" "}
                  <Link
                    to={ROUTES.signup}
                    className="text-emerald-600 font-medium"
                  >
                    {t("auth.login.create_one")}
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
