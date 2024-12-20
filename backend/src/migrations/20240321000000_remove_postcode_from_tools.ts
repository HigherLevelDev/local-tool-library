import type { Knex } from 'knex';

exports.up = async function(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tools', (table) => {
    table.dropColumn('postcode');
  });
};

exports.down = async function(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tools', (table) => {
    table.string('postcode').notNullable();
  });
};