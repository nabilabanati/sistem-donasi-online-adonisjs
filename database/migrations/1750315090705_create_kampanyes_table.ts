import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'kampanyes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nama_kampanye').notNullable()
      table
        .integer('kategori_id')
        .unsigned()
        .references('id')
        .inTable('kategoris')
        .onDelete('CASCADE')
      table.decimal('target', 15, 2).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
