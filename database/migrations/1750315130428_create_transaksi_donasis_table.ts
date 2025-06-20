import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transaksi_donasis'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('donasi_id')
        .unsigned()
        .references('id')
        .inTable('donasis')
        .onDelete('CASCADE')
      table
        .integer('kampanye_id')
        .unsigned()
        .references('id')
        .inTable('kampanyes')
        .onDelete('CASCADE')
      table.enum('status', ['pending', 'terverifikasi', 'gagal']).defaultTo('pending')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
