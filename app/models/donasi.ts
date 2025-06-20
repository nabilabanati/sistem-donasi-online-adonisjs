import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Donatur from '#models/donatur'
import Kategori from '#models/kategori'
import TransaksiDonasi from '#models/transaksi_donasi'

export default class Donasi extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare donaturId: number

  @column()
  declare kategoriId: number

  @column()
  declare jumlah: number

  @column.date()
  declare tanggal: DateTime

  @belongsTo(() => Donatur)
  declare donatur: BelongsTo<typeof Donatur>

  @belongsTo(() => Kategori)
  declare kategori: BelongsTo<typeof Kategori>

  @hasOne(() => TransaksiDonasi)
  declare transaksiDonasi: HasOne<typeof TransaksiDonasi>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}