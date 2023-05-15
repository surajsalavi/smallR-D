import React, { useState } from 'react'
import axios from 'axios'
function App() {
  const [solrQuery, setSolrQuery] = useState('')
  const [response, setResponse] = useState([])

  const getData = () => {
    if (solrQuery === '') {
      alert('please enter query')
      return
    }
    const request = {
      url: 'http://localhost:5001/get-data',
      method: 'POST',
      data: { solrQuery },
    }
    axios(request)
      .then((response) => {
        console.log(response.data)
        setResponse(response.data)
      })
      .catch((err) => {
        alert('failure')
        console.log(err)
      })
  }

  return (
    <>
      <input type='text' onChange={(e) => setSolrQuery(e.target.value)} />
      <button onClick={() => getData()}>Get Data</button>
      <br />
      <br />
      <br />
      <table border='1'>
        {response.length > 0
          ? response.map((row, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.address}</td>
                </tr>
              )
            })
          : 'No Data Present'}
      </table>
    </>
  )
}

export default App
