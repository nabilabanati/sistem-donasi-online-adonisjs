import type { HttpContext } from '@adonisjs/core/http'
import Kampanye from '#models/kampanye'
import Kategori from '#models/kategori'
import db from '@adonisjs/lucid/services/db'

export default class KampanyesController {
  public async index({ view }: HttpContext) {
    const kampanyes = await Kampanye.query()
      .preload('kategori')
      .preload('transaksiDonasi', (query) => {
        query.where('status', 'terverifikasi').preload('donasi')
      })

    // Hitung total donasi terkumpul untuk setiap kampanye
    const kampanyesWithTotal = await Promise.all(
      kampanyes.map(async (kampanye) => {
        const totalResult = await db
          .from('transaksi_donasis')
          .join('donasis', 'transaksi_donasis.donasi_id', 'donasis.id')
          .where('transaksi_donasis.kampanye_id', kampanye.id)
          .where('transaksi_donasis.status', 'terverifikasi')
          .sum('donasis.jumlah as total')
          .first()

        const totalTerkumpul = totalResult?.total || 0
        const persentase =
          kampanye.target > 0 ? Math.round((totalTerkumpul / kampanye.target) * 100) : 0

        return {
          ...kampanye.toJSON(),
          totalTerkumpul,
          persentase,
          sisaTarget: kampanye.target - totalTerkumpul,
        }
      })
    )

    return view.render('pages/kampanye/index', { kampanyes: kampanyesWithTotal })
  }

  public async create({ view }: HttpContext) {
    const kategoris = await Kategori.all()
    return view.render('pages/kampanye/create', { kategoris })
  }

  public async save({ request, response }: HttpContext) {
    const data = request.only(['namaKampanye', 'kategoriId', 'target'])
    await Kampanye.create(data)
    response.redirect().toRoute('kampanye.index')
  }

  public async show({ view, params }: HttpContext) {
    const kampanye = await Kampanye.query().where('id', params.id).preload('kategori').firstOrFail()
    return view.render('pages/kampanye/show', { kampanye })
  }

  public async edit({ view, params }: HttpContext) {
    const kampanye = await Kampanye.findOrFail(params.id)
    const kategoris = await Kategori.all()
    return view.render('pages/kampanye/edit', { kampanye, kategoris })
  }

  public async update({ request, response, params }: HttpContext) {
    const kampanye = await Kampanye.findOrFail(params.id)
    const data = request.only(['namaKampanye', 'kategoriId', 'target'])
    kampanye.merge(data)
    await kampanye.save()
    response.redirect().toRoute('kampanye.index')
  }

  public async destroy({ response, params }: HttpContext) {
    const kampanye = await Kampanye.findOrFail(params.id)
    await kampanye.delete()
    response.redirect().toRoute('kampanye.index')
  }
}
