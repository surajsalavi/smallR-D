const mysql = require('mysql')
const util = require('util')

const pool = mysql.createPool({
  connectionLimit: 10,
  password: 'workbench',
  user: 'workbench_user',
  database: 'wowleads',
  host: 'localhost',
  port: 3306,
})

const executeMysqlQuery = (sql) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, (error, elements) => {
      if (error) {
        return reject(error)
      }
      return resolve(elements)
    })
  })
}

const rows = await executeMysqlQuery(
  `select * from companies where id in (${ids.join(',')})`
)
