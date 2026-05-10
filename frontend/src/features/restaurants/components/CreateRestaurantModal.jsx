import { Modal, Button, Alert } from 'antd'
import { Form, Field } from 'react-final-form'
import { useTranslation } from 'react-i18next'
import { useCreateRestaurantMutation, useUpdateRestaurantMutation } from '../restaurantsApi'
import { inputClass } from 'utils/formStyles'

function TextField({ name, label, placeholder }) {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">{label}</label>
          <input
            {...input}
            type="text"
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

export default function CreateRestaurantModal({ open, restaurant, onClose }) {
  const { t } = useTranslation()
  const [createRestaurant, { isLoading: isCreating }] = useCreateRestaurantMutation()
  const [updateRestaurant, { isLoading: isUpdating }] = useUpdateRestaurantMutation()
  const isEditing = !!restaurant
  const isLoading = isCreating || isUpdating

  const initialValues = restaurant
    ? {
        name: restaurant.name,
        phone: restaurant.phone,
        location: restaurant.location,
        opening_hours: restaurant.opening_hours,
      }
    : undefined

  const validate = (values) => {
    const required = t('auth.validation.required')
    const errors = {}
    if (!values.name) errors.name = required
    if (!values.phone) errors.phone = required
    if (!values.location) errors.location = required
    if (!values.opening_hours) errors.opening_hours = required
    return errors
  }

  const onSubmit = async (values) => {
    try {
      if (isEditing) {
        await updateRestaurant({ id: restaurant.id, ...values }).unwrap()
      } else {
        await createRestaurant(values).unwrap()
      }
      onClose()
    } catch (err) {
      const msgs = err.data?.errors || err.data?.error
      return {
        FORM_ERROR: Array.isArray(msgs) ? msgs.join(', ') : msgs || t('common.error_generic'),
      }
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={isEditing ? t('dashboard.create_modal.title_edit') : t('dashboard.create_modal.title_create')}
      footer={null}
      destroyOnClose
    >
      <Form onSubmit={onSubmit} validate={validate} initialValues={initialValues}>
        {({ handleSubmit, submitError }) => (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-3">
            {submitError && <Alert message={submitError} type="error" showIcon />}

            <TextField
              name="name"
              label={t('dashboard.create_modal.name_label')}
              placeholder="The Golden Fork"
            />
            <TextField
              name="phone"
              label={t('dashboard.create_modal.phone_label')}
              placeholder="+1 (555) 000-0000"
            />
            <TextField
              name="location"
              label={t('dashboard.create_modal.location_label')}
              placeholder="123 Main St, New York, NY"
            />
            <TextField
              name="opening_hours"
              label={t('dashboard.create_modal.hours_label')}
              placeholder="Mon–Fri 9am–10pm, Sat–Sun 10am–11pm"
            />

            <div className="flex justify-end gap-2 pt-1">
              <Button onClick={onClose}>{t('common.cancel')}</Button>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {isEditing
                  ? t('dashboard.create_modal.submit_edit')
                  : t('dashboard.create_modal.submit_create')}
              </Button>
            </div>
          </form>
        )}
      </Form>
    </Modal>
  )
}
