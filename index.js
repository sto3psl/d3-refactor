import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import Chart from './Chart'

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('./data.json')
      const d = await res.json()

      setData(d.data)
    }
    fetchData()
  }, [])

  return (
    <div className="App">
      <Chart dataset={data} width={500} height={300} marginTop={0} marginLeft={0} />
    </div>
  )
}

const rootElement = document.getElementById('app')
ReactDOM.render(<App />, rootElement)
