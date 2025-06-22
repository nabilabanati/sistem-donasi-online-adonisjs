import type { HttpContext } from '@adonisjs/core/http'
import Donatur from '#models/donatur'
import db from '@adonisjs/lucid/services/db'


export default class DonatursController {
  public async index({ view }: HttpContext) {
    const donaturs = await Donatur.all()
    return view.render('pages/donatur/index', { donaturs })
  }

  public async create({ view }: HttpContext) {
    return view.render('pages/donatur/create')
  }

  public async save({ request, response }: HttpContext) {
    const data = request.only(['nama', 'email', 'telepon'])
    await Donatur.create(data)
    response.redirect().toRoute('donatur.index')
  }

  public async show({ view, params }: HttpContext) {
    const donatur = await Donatur.query()
      .where('id', params.id)
      .preload('Donasi', (query) => {
        query
          .preload('kategori')
          .preload('transaksiDonasi', (subQuery) => {
            subQuery.preload('kampanye')
          })
          .orderBy('tanggal', 'desc')
      })
      .firstOrFail()

    // Hitung total donasi terverifikasi
    const totalDonasiTerverifikasi = await db.from('donasis') // Mengakses tabel 'donasis'
      .join('transaksi_donasis', 'donasis.id', '=', 'transaksi_donasis.donasi_id') // Menggabungkan dengan tabel 'transaksi_donasis'
      .where('donasis.donatur_id', params.id) // Memfilter berdasarkan donatur yang sedang dilihat
      .where('transaksi_donasis.status', 'terverifikasi') // Memfilter donasi yang statusnya 'terverifikasi'
      .sum('jumlah as total') // Menjumlahkan kolom 'jumlah'
      .first() // Mengambil hasil pertama dari agregasi

    return view.render('pages/donatur/show', { donatur, totalDonasiTerverifikasi: totalDonasiTerverifikasi.total || 0 })
  }

  public async edit({ view, params }: HttpContext) {
    const donatur = await Donatur.findOrFail(params.id)
    return view.render('pages/donatur/edit', { donatur })
  }

  public async update({ request, response, params }: HttpContext) {
    const donatur = await Donatur.findOrFail(params.id)
    const data = request.only(['nama', 'email', 'telepon'])
    donatur.merge(data)
    await donatur.save()
    response.redirect().toRoute('donatur.index')
  }

  public async destroy({ response, params }: HttpContext) {
    const donatur = await Donatur.findOrFail(params.id)
    await donatur.delete()
    response.redirect().toRoute('donatur.index')
  }
}
