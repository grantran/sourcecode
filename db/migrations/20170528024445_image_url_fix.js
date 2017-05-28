
exports.up = function(knex, Promise) {
  return knex.schema.table('resources', (table) => {
    table.dropColumn('image');
  })
};


exports.down = function(knex, Promise) {
  return knex.schema.table('resources', (table) => {
    table.text('image');
})
};

