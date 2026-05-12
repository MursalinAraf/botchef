import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Form, Field } from 'react-final-form'
import { Button, Alert, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useGetInvitationQuery, useAcceptInvitationMutation } from './invitationsApi'
import { setCredentials } from 'features/auth/authSlice'
import useAppNavigate from 'hooks/useAppNavigate'
import { inputClass } from 'utils/formStyles'

function FieldRow({ name, label, type = 'text', placeholder }) {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">{label}</label>
          <input
            {...input}
            type={type}
            placeholder={placeholder}
            className={inputClass(meta.touched, meta.error)}
          />
          {meta.touched && meta.error && (
            <span className="text-xs text-red-500">{meta.error}</span>
          )}
        </div>
      )}
    </Field>
  )
}

export default function AcceptInvitePage() {
  const { token } = useParams()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { toDashboard } = useAppNavigate()
  const { data: invitation, isLoading, isError } = useGetInvitationQuery(token)
  const [acceptInvitation, { isLoading: isAccepting }] = useAcceptInvitationMutation()
  const [apiError, setApiError] = useState(null)

  const validate = (values) => {
    const required = t('auth.validation.required')
    const errors = {}
    if (!values.first_name) errors.first_name = required
    if (!values.last_name) errors.last_name = required
    if (!values.password) errors.password = required
    if (!values.password_confirmation) errors.password_confirmation = required
    else if (values.password_confirmation !== values.password)
      errors.password_confirmation = t('auth.signup.passwords_not_match')
    return errors
  }

  const onSubmit = async (values) => {
    setApiError(null)
    try {
      const result = await acceptInvitation({ token, ...values }).unwrap()
      dispatch(setCredentials({ token: result.token, user: result.user }))
      toDashboard()
    } catch (err) {
      const msgs = err.data?.errors || err.data?.error
      setApiError(Array.isArray(msgs) ? msgs.join(', ') : msgs || t('common.error_generic'))
    }
  }

  const statusMessage = () => {
    if (invitation?.expired) return t('invite.accept.expired')
    if (invitation?.accepted) return t('invite.accept.already_accepted')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">{t('invite.accept.title')}</h1>
        </div>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        )}

        {isError && (
          <Alert message={t('invite.accept.not_found')} type="error" showIcon />
        )}

        {!isLoading && !isError && invitation && (
          <>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600 space-y-1">
              <p>
                {t('invite.accept.invited_by', {
                  name: `${invitation.invited_by.first_name} ${invitation.invited_by.last_name}`,
                })}
              </p>
              <p className="text-gray-400 text-xs">
                {t('invite.accept.expires', { date: invitation.expires_at })}
              </p>
            </div>

            {statusMessage() ? (
              <Alert message={statusMessage()} type="warning" showIcon />
            ) : (
              <Form onSubmit={onSubmit} validate={validate}>
                {({ handleSubmit }) => (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {apiError && (
                      <Alert message={apiError} type="error" showIcon />
                    )}

                    <div className="mb-1">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        {t('invite.accept.email_label')}
                      </p>
                      <p className="text-sm text-gray-900 border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5">
                        {invitation.email}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <FieldRow
                        name="first_name"
                        label={t('invite.accept.first_name')}
                        placeholder="Ahmed"
                      />
                      <FieldRow
                        name="last_name"
                        label={t('invite.accept.last_name')}
                        placeholder="Rahman"
                      />
                    </div>

                    <FieldRow
                      name="password"
                      label={t('invite.accept.password')}
                      type="password"
                      placeholder="••••••••"
                    />
                    <FieldRow
                      name="password_confirmation"
                      label={t('invite.accept.confirm_password')}
                      type="password"
                      placeholder="••••••••"
                    />

                    <Button
                      htmlType="submit"
                      loading={isAccepting}
                      block
                      style={{
                        background: '#059669',
                        borderColor: '#059669',
                        color: 'white',
                        height: 42,
                        fontSize: 14,
                        fontWeight: 500,
                        marginTop: 4,
                      }}
                    >
                      {t('invite.accept.submit')}
                    </Button>
                  </form>
                )}
              </Form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
