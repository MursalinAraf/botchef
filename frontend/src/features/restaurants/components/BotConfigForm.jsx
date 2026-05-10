import { Drawer, Button, Alert, Spin } from 'antd'
import { Form, Field } from 'react-final-form'
import { useTranslation } from 'react-i18next'
import { useGetBotConfigQuery, useUpsertBotConfigMutation } from '../restaurantsApi'
import { TONES, MASCOTS } from 'utils/botConfig'
import { inputClass, selectClass } from 'utils/formStyles'

export default function BotConfigForm({ open, restaurant, onClose }) {
  const { t } = useTranslation()
  const restaurantId = restaurant?.id
  const { data: botConfig, isLoading } = useGetBotConfigQuery(restaurantId, { skip: !restaurantId })
  const [upsertBotConfig, { isLoading: isSaving }] = useUpsertBotConfigMutation()

  const initialValues = botConfig
    ? {
        menu: botConfig.menu || '',
        delivery_info: botConfig.delivery_info || '',
        deals: botConfig.deals || '',
        rules: botConfig.rules || '',
        tone: botConfig.tone || 'friendly',
        mascot_type: botConfig.mascot_type || 'pizza',
        brand_color: botConfig.brand_color || '#059669',
      }
    : { tone: 'friendly', mascot_type: 'pizza', brand_color: '#059669' }

  const validate = (values) => {
    const required = t('auth.validation.required')
    const errors = {}
    if (!values.menu) errors.menu = required
    if (!values.tone) errors.tone = required
    if (!values.mascot_type) errors.mascot_type = required
    if (!values.brand_color) {
      errors.brand_color = required
    } else if (!/^#[0-9a-fA-F]{6}$/.test(values.brand_color)) {
      errors.brand_color = t('dashboard.bot_config.color_error')
    }
    return errors
  }

  const onSubmit = async (values) => {
    try {
      await upsertBotConfig({ restaurantId, ...values }).unwrap()
      onClose()
    } catch (err) {
      const msgs = err.data?.errors || err.data?.error
      return {
        FORM_ERROR: Array.isArray(msgs) ? msgs.join(', ') : msgs || t('common.error_generic'),
      }
    }
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={
        restaurant
          ? t('dashboard.bot_config.drawer_title', { name: restaurant.name })
          : t('dashboard.bot_config.drawer_title_generic')
      }
      width={480}
      destroyOnClose
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spin />
        </div>
      ) : (
        <Form onSubmit={onSubmit} validate={validate} initialValues={initialValues}>
          {({ handleSubmit, submitError }) => (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {submitError && <Alert message={submitError} type="error" showIcon className="mb-1" />}

              <Field name="menu">
                {({ input, meta }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">
                      {t('dashboard.bot_config.menu_label')} <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      {...input}
                      rows={5}
                      placeholder={t('dashboard.bot_config.menu_placeholder')}
                      className={`${inputClass(meta.touched, meta.error)} resize-none`}
                    />
                    {meta.touched && meta.error && (
                      <span className="text-xs text-red-500">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>

              <Field name="delivery_info">
                {({ input, meta }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">
                      {t('dashboard.bot_config.delivery_label')}
                    </label>
                    <textarea
                      {...input}
                      rows={2}
                      placeholder={t('dashboard.bot_config.delivery_placeholder')}
                      className={`${inputClass(meta.touched, meta.error)} resize-none`}
                    />
                  </div>
                )}
              </Field>

              <Field name="deals">
                {({ input, meta }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">
                      {t('dashboard.bot_config.deals_label')}
                    </label>
                    <textarea
                      {...input}
                      rows={2}
                      placeholder={t('dashboard.bot_config.deals_placeholder')}
                      className={`${inputClass(meta.touched, meta.error)} resize-none`}
                    />
                  </div>
                )}
              </Field>

              <Field name="rules">
                {({ input, meta }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">
                      {t('dashboard.bot_config.rules_label')}
                    </label>
                    <textarea
                      {...input}
                      rows={2}
                      placeholder={t('dashboard.bot_config.rules_placeholder')}
                      className={`${inputClass(meta.touched, meta.error)} resize-none`}
                    />
                  </div>
                )}
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field name="tone">
                  {({ input }) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-500">
                        {t('dashboard.bot_config.tone_label')} <span className="text-red-400">*</span>
                      </label>
                      <select {...input} className={selectClass}>
                        {TONES.map((tone) => (
                          <option key={tone} value={tone}>
                            {t(`dashboard.bot_config.tones.${tone}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </Field>

                <Field name="mascot_type">
                  {({ input }) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-500">
                        {t('dashboard.bot_config.mascot_label')} <span className="text-red-400">*</span>
                      </label>
                      <select {...input} className={selectClass}>
                        {MASCOTS.map((mascot) => (
                          <option key={mascot} value={mascot}>
                            {t(`dashboard.bot_config.mascots.${mascot}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </Field>
              </div>

              <Field name="brand_color">
                {({ input, meta }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">
                      {t('dashboard.bot_config.color_label')} <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={/^#[0-9a-fA-F]{6}$/.test(input.value) ? input.value : '#059669'}
                        onChange={input.onChange}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                      />
                      <input
                        {...input}
                        type="text"
                        placeholder="#059669"
                        className={inputClass(meta.touched, meta.error)}
                      />
                    </div>
                    {meta.touched && meta.error && (
                      <span className="text-xs text-red-500">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-1">
                <Button onClick={onClose}>{t('common.cancel')}</Button>
                <Button type="primary" htmlType="submit" loading={isSaving}>
                  {t('dashboard.bot_config.submit')}
                </Button>
              </div>
            </form>
          )}
        </Form>
      )}
    </Drawer>
  )
}
