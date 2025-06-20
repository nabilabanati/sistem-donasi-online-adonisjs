import type { HttpContext } from '@adonisjs/core/http'
import Kategori from '#models/kategori'

export default class KategorisController {
  public async index({ view }: HttpContext) {
    const kategori = await Kategori.all()
    return view.render('pages/kategori/index', { kategori })
  }

  public async create({ view }: HttpContext) {
    return view.render('pages/kategori/create')
  }

  public async save({ request, response }: HttpContext) {
    const data = request.only(['namaKategori'])
    await Kategori.create(data)
    response.redirect().toRoute('kategori.index')
  }

  public async show({ view, params }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)
    return view.render('pages/kategori/show', { kategori })
  }

  public async edit({ view, params }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)
    return view.render('pages/kategori/edit', { kategori })
  }

  public async update({ request, response, params }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)
    const data = request.only(['namaKategori'])
    kategori.merge(data)
    await kategori.save()
    response.redirect().toRoute('kategori.index')
  }

  public async destroy({ response, params, session }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)
    await kategori.delete()
    session.flash('notification', {
      type: 'success',
      message: 'Kategori berhasil dihapus!',
    })
    return response.redirect().toRoute('kategori.index')
  }
}
