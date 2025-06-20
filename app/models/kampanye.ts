import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Kategori from '#models/kategori'
import TransaksiDonasi from './transaksi_donasi.js'

export default class Kampanye extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare namaKampanye: string

  @column()
  declare kategoriId: number

  @column()
  declare target: number

  @belongsTo(() => Kategori)
  declare kategori: BelongsTo<typeof Kategori>

  @hasMany(() => TransaksiDonasi)
  declare transaksiDonasi: HasMany<typeof TransaksiDonasi>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
