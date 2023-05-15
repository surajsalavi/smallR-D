const express = require('express')
const SolrClient = require('solr-client')
const mysql = require('mysql')
const util = require('util')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const solrClient = SolrClient.createClient({
  host: '127.0.0.1',
  port: '8983',
  core: 'companies',
  protocol: 'http',
})

const pool = mysql.createPool({
  connectionLimit: 10,
  password: 'workbench',
  user: 'workbench_user',
  database: 'wowleads',
  host: 'localhost',
  port: 3306,
})
// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'wowleads',
//   // charset: 'utf8mb4',
//   debug: false,
// })
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

app.post('/get-data', async (req, res) => {
  try {
    const result = await solrClient.search(req.body.solrQuery)
    var ids = []
    await result.response.docs.map((doc) => ids.push(doc.mysqlid))

    const rows = await executeMysqlQuery(
      `select * from companies where id in (${ids.join(',')})`
    )
    res.json(rows)
  } catch (err) {
    console.log(err)
    res.send(err)
  }
})

app.listen(5001, (result) => {
  console.log('app started on port 5001')
})
