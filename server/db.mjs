import sqlite from 'sqlite3';

export const db = new sqlite.Database('db.db', (err) => {
  if (err) throw err;
});