import type { HttpContext } from '@adonisjs/core/http'
import Donasi from '#models/donasi'
import Donatur from '#models/donatur'
import Kampanye from '#models/kampanye'
import TransaksiDonasi from '#models/transaksi_donasi'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class DonasisController {
  public async index({ view }: HttpContext) {
    const donasis = await Donasi.query()
      .preload('donatur')
      .preload('kategori')
      .preload('transaksiDonasi', (query) => {
        query.preload('kampanye')
      })
      .orderBy('tanggal', 'desc')
    return view.render('pages/donasi/index', { donasis })
  }

  public async create({ view }: HttpContext) {
    const donaturs = await Donatur.all()
    const kampanyes = await Kampanye.query().preload('kategori')
    return view.render('pages/donasi/create', { donaturs, kampanyes })
  }

  public async save({ request, response, session }: HttpContext) {
    const trx = await db.transaction()
    try {
      const data = request.only(['donaturId', 'kategoriId', 'jumlah', 'tanggal', 'kampanyeId'])
      const kampanye = await Kampanye.findOrFail(data.kampanyeId)

      const donasi = await Donasi.create(
        {
          donaturId: data.donaturId,
          kategoriId: kampanye.kategoriId,
          jumlah: data.jumlah,
          tanggal: DateTime.fromISO(data.tanggal),
        },
        { client: trx }
      )

      // Create TransaksiDonasi
      await TransaksiDonasi.create(
        {
          donasiId: donasi.id,
          kampanyeId: data.kampanyeId,
          status: 'terverifikasi',
        },
        { client: trx }
      )

      await trx.commit()
      session.flash('success', 'Donasi berhasil disimpan.')
      response.redirect().toRoute('donasi.index')
    } catch (error) {
      console.error(error)
      await trx.rollback()
      session.flash('error', 'Gagal menyimpan donasi. Pastikan semua data terisi dengan benar.')
      response.redirect().back()
    }
  }

  public async show({ view, params }: HttpContext) {
    const donasi = await Donasi.query()
      .where('id', params.id)
      .preload('donatur')
      .preload('kategori')
      .preload('transaksiDonasi', (query) => {
        query.preload('kampanye')
      })
      .firstOrFail()
    return view.render('pages/donasi/show', { donasi })
  }

  public async edit({ view, params }: HttpContext) {
    const donasi = await Donasi.query()
      .where('id', params.id)
      .preload('transaksiDonasi')
      .firstOrFail()
    const donaturs = await Donatur.all()
    const kampanyes = await Kampanye.query().preload('kategori')
    return view.render('pages/donasi/edit', { donasi, donaturs, kampanyes })
  }

  public async update({ request, response, params, session }: HttpContext) {
    const trx = await db.transaction()
    try {
      const donasi = await Donasi.findOrFail(params.id)
      const data = request.only(['donaturId', 'kategoriId', 'jumlah', 'tanggal', 'kampanyeId'])
      const kampanye = await Kampanye.findOrFail(data.kampanyeId)

      donasi.merge({
        donaturId: data.donaturId,
        kategoriId: kampanye.kategoriId,
        jumlah: data.jumlah,
        tanggal: DateTime.fromISO(data.tanggal),
      })

      await donasi.save()

      // Update TransaksiDona
      const transaksi = await TransaksiDonasi.query().where('donasiId', donasi.id).firstOrFail()

      transaksi.merge({
        kampanyeId: data.kampanyeId,
        status: 'terverifikasi',
      })

      await transaksi.save()

      await trx.commit()

      session.flash('success', 'Donasi berhasil diperbarui.')
      response.redirect().toRoute('donasi.index')
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Gagal memperbarui donasi. Pastikan semua data terisi dengan benar.')
      response.redirect().back()
    }
  }

  public async updateStatus({ request, response, params, session }: HttpContext) {
    try {
      const { status } = request.only(['status'])
      if (!['pending', 'terverifikasi', 'gagal'].includes(status)) {
        session.flash('error', 'Status tidak valid.')
        response.redirect().back()
        return
      }

      const transaksi = await TransaksiDonasi.query().where('donasiId', params.id).firstOrFail()

      await transaksi.merge({ status }).save()

      session.flash('success', 'Status donasi berhasil diperbarui.')
      response.redirect().toRoute('donasi.index')
    } catch (error) {
      session.flash('error', 'Gagal memperbarui status donasi.')
      response.redirect().back()
    }
  }

  public async destroy({ response, params, session }: HttpContext) {
    const trx = await db.transaction()
    try {
      const donasi = await Donasi.findOrFail(params.id)
      await TransaksiDonasi.query().where('donasiId', donasi.id).delete()
      await donasi.delete()
      await trx.commit()
      session.flash('success', 'Donasi berhasil dihapus.')
      response.redirect().toRoute('donasi.index')
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Gagal menghapus donasi.')
      response.redirect().back()
    }
  }
}
