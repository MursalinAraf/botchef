export const inputClass = (touched, error) =>
  `border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors w-full ${
    touched && error ? 'border-red-400' : 'border-gray-200 focus:border-emerald-500'
  }`

export const selectClass =
  'border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-emerald-500 bg-white w-full transition-colors'
