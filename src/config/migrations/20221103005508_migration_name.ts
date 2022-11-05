/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id').primary();
      table.string('firstname');
      table.string('lastname');
      table.string('password');
      table.string('username').unique();
      table.integer('wallet');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
    })
    .createTable('wallets', function (table) {
      table.increments('id').primary();
      table.integer('balance');
      table.text('history');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('users').dropTable('wallets');
}
