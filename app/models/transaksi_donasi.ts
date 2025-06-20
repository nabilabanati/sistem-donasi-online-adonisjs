import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Donasi from '#models/donasi'
import Kampanye from '#models/kampanye'

export default class TransaksiDonasi extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare donasiId: number

  @column()
  declare kampanyeId: number

  @column()
  declare status: 'pending' | 'terverifikasi' | 'gagal'

  @belongsTo(() => Donasi, { foreignKey: 'donasiId' })
  declare donasi: BelongsTo<typeof Donasi>

  @belongsTo(() => Kampanye, { foreignKey: 'kampanyeId' })
  declare kampanye: BelongsTo<typeof Kampanye>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
