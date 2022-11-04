/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id');
      table.string('firstName');
      table.string('lastName');
      table.string('password');
      table.string('email').unique();
      table.integer('walletId');
      table.timestamps();
    })
    .createTable('wallets', function (table) {
      table.increments('id');
      table.string('balance');
      table.text('externalAccount');
      table.text('history');
      table.timestamps();
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('users').dropTable('wallets');
}
