import type { Knex } from 'knex';

exports.up = async function(knex: Knex): Promise<void> {
  await knex.schema.createTable('tools', (table) => {
    table.string('id').primary(); // ULID
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.string('image_url').notNullable();
    table.string('owner_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.float('latitude').notNullable();
    table.float('longitude').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tools');
};