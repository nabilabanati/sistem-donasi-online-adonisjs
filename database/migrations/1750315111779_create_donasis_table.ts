import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'donasis'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('donatur_id')
        .unsigned()
        .references('id')
        .inTable('donaturs')
        .onDelete('CASCADE')
      table
        .integer('kategori_id')
        .unsigned()
        .references('id')
        .inTable('kategoris')
        .onDelete('CASCADE')
      table.decimal('jumlah', 15, 2).notNullable()
      table.date('tanggal').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
