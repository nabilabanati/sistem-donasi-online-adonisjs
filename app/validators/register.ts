import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().nullable(), // fullName bisa null
    email: vine.string().email().unique(async (db, value) => {
      const user = await db.from('users').where('email', value).first()
      return !user
    }),
    password: vine.string().minLength(8).confirmed(),
    password_confirmation: vine.string(), // Ini penting untuk konfirmasi password
  })
)