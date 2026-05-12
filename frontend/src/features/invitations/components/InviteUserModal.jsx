import { useState } from 'react'
import { Modal, Button, Alert } from 'antd'
import { Form, Field } from 'react-final-form'
import { useTranslation } from 'react-i18next'
import { useSendInvitationMutation } from '../invitationsApi'
import { inputClass } from 'utils/formStyles'

export default function InviteUserModal({ open, onClose }) {
  const { t } = useTranslation()
  const [sentTo, setSentTo] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [sendInvitation, { isLoading }] = useSendInvitationMutation()

  const validate = (values) => {
    const errors = {}
    if (!values.email) errors.email = t('auth.validation.required')
    else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = t('invite.send.invalid_email')
    return errors
  }

  const onSubmit = async (values) => {
    setApiError(null)
    try {
      await sendInvitation(values.email).unwrap()
      setSentTo(values.email)
    } catch (err) {
      const msgs = err.data?.errors || err.data?.error
      setApiError(Array.isArray(msgs) ? msgs.join(', ') : msgs || t('common.error_generic'))
    }
  }

  const handleClose = () => {
    setSentTo(null)
    setApiError(null)
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={t('invite.send.modal_title')}
      footer={null}
      destroyOnClose
      afterClose={() => setSentTo(null)}
    >
      {sentTo ? (
        <div className="py-4">
          <Alert
            message={t('invite.send.success', { email: sentTo })}
            type="success"
            showIcon
          />
          <div className="flex justify-end mt-4">
            <Button onClick={handleClose}>{t('common.cancel')}</Button>
          </div>
        </div>
      ) : (
        <Form onSubmit={onSubmit} validate={validate}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-3">
              {apiError && <Alert message={apiError} type="error" showIcon />}

              <Field name="email">
                {({ input, meta }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">
                      {t('invite.send.email_label')}
                    </label>
                    <input
                      {...input}
                      type="email"
                      placeholder={t('invite.send.email_placeholder')}
                      className={inputClass(meta.touched, meta.error)}
                    />
                    {meta.touched && meta.error && (
                      <span className="text-xs text-red-500">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>

              <div className="flex justify-end gap-2 pt-1">
                <Button onClick={handleClose}>{t('common.cancel')}</Button>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  {t('invite.send.submit')}
                </Button>
              </div>
            </form>
          )}
        </Form>
      )}
    </Modal>
  )
}
