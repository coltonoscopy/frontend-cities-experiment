import React, { useEffect, useState } from 'react'

import {Container, Form, Header, List, Segment} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import citiesData from './citiesData'

const App = () => {
  const [top10, setTop10] = useState([])
  const [cities, setCities] = useState([])
  const [cityNames, setCityNames] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState([])

  useEffect(() => {
    const citiesLines = citiesData().split('\n')
    const citiesChunked = citiesLines.map(cl => cl.split('\t'))
    
    let indexed = {}
    citiesChunked.forEach(cc => {
      indexed[`${cc[0]}, ${cc[3]}`] = {lat: cc[1], lon: cc[2], ctr: cc[3]}
    })
    
    setCities(indexed)
    setCityNames(citiesChunked.map(cc => `${cc[0]}, ${cc[3]}`))
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!text) return;

    findTop10()
  }, [text])

  const findTop10 = () => {
    let tempMatches = []
    let insensReg = new RegExp(text, 'i')
    setLoading(true)

    for (let i = 0; i < cityNames.length; i++) {
      if (cityNames[i].match(insensReg)) {
        tempMatches.push(cityNames[i])
        if (tempMatches.length >= 10) break;
      }
    }

    setMatches(tempMatches)
    setLoading(false)
  }

  return (
    <Container>
      <Segment raised loading={loading}>
        <Form>
          <Form.Input 
            onChange={(e, {value}) => setText(value)}
            value={text}
          />
        </Form>
        <Header as='h3'>{`${cityNames.length} cities indexed!`}</Header>
        <List>
          {matches.map(m => <List.Item><Header>{m}<Header.Subheader>{`${cities[m]?.lat}, ${cities[m]?.lon}`}</Header.Subheader></Header></List.Item>)}
        </List>
      </Segment>
    </Container>
  )
}

export default App