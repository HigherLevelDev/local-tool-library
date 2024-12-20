import type { Knex } from 'knex';

exports.up = async function(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tools', (table) => {
    table.dropColumn('latitude');
    table.dropColumn('longitude');
  });
};

exports.down = async function(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tools', (table) => {
    table.decimal('latitude', 10, 8).notNullable();
    table.decimal('longitude', 11, 8).notNullable();
  });
};