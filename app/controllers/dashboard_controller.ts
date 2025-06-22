import Donasi from '#models/donasi'
import Donatur from '#models/donatur'
import Kampanye from '#models/kampanye'
import Kategori from '#models/kategori'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  public async index({ view }: HttpContext) {
    const kategori = await Kategori.query().count('* as total').pojo<{ total: number }>()
    const totalKategori = kategori[0].total

    const kampanye = await Kampanye.query().count('* as total').pojo<{ total: number }>()
    const totalKampanye = kampanye[0].total

    const donatur = await Donatur.query().count('* as total').pojo<{ total: number }>()
    const totalDonatur = donatur[0].total

    const donasi = await Donasi.query().count('* as total').pojo<{ total: number }>()
    const totalDonasi = donasi[0].total

    return view.render('pages/dashboard', { totalKategori, totalKampanye, totalDonatur, totalDonasi })
  }
}
