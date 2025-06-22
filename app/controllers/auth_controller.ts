import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { registerValidator } from '#validators/register'
import { loginValidator } from '#validators/login'

export default class AuthController {

  async showLogin({ view }: HttpContext) {
    return view.render('auth/login')
  }

  async login({ request, response, auth, session }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
       const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      session.flash('success', 'Login berhasil!')
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      session.flash('error', 'Email atau password salah!')
      return response.redirect().back()
    }
  }

  async showRegister({ view }: HttpContext) {
    return view.render('auth/register')
  }

  async register({ request, auth, response, session }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)
      const existingUser = await User.findBy('email', data.email)
      if (existingUser) {
        session.flash('error', 'Email sudah terdaftar!')
        return response.redirect().back()
      }
      const user = await User.create({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      })
      await auth.use('web').login(user)
      session.flash('success', 'Registrasi berhasil!')
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      session.flash('error', 'Terjadi kesalahan saat registrasi')
      return response.redirect().back()
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('login')
  }
}
