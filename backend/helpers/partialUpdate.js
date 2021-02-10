/**
 * Generate a selective update query based on a request body:
 *
 * - table: where to make the query
 * - items: an object with keys of columns you want to update and values with updated values
 * - key: the column that we query by (e.g. username, handle, id)
 * - id: current record ID
 *
 * Returns object containing a DB query as a string, and array of
 * string values to be updated
 *
 */

const sqlForPartialUpdate = (table, items, key, id) => {
  let idx = 1;
  let columns = [];
  for(const key in items) {
    if(key.startsWith("_")) delete items[key]
  };
  for(const column in items) {
    columns.push(column + "=" + idx);
    idx++;
  }
  let cols = columns.join(", ");
  let query = `UPDATE ${table} SET ${cols} WHERE ${key}=$${idx} RETURNING *`;
  let values = Object.values(items);
  values.push(id);
  return { query, values }
};

module.exports = sqlForPartialUpdate;
