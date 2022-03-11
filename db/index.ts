import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host     : 'movistardb.cjcmv3tc2pyq.us-east-1.rds.amazonaws.com',
  user     : 'interview',
  password : 'interview123',
  database : 'interview_db',
  port: 3306,
});
