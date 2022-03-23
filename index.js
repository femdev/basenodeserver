const express = require('express')
const app = express()
let stringify = require('json-stringify-safe');
const fs = require('fs')

const port = 8888 

app.use(express.static('public')) 
app.use(express.json({limit:'100mb'}))
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})





// Generic Hello World Fxn
// localhost:8888
app.get('/echo', (req, res) => {
console.log(req)
//  console.log("BODY: " + JSON.parse(req.body))
  //console.log("QUERY: " + JSON.parse(req.query))
 // console.log("PARAMS: " + JSON.parse(req.params))
 // console.log("URL: " + JSON.parse(req.url))
  res.send(req.body)
})

app.post('/echo', (req, res) => {
  console.log("POST" + req)
  res.send(req.body)
})



app.post('/', (req, res) => {
  console.log(req)

  var response = { 
    "updates": { 
      "action": {
        "attributes": { 
          "value": "HELLO WORLD!"
        }
      }
    }
  } 
  res.send(response)
})

// Queue example ////////////////////////////////////////////////////////
var q = []
function enque(queueme) {
  q.push(queueme)
}

function deque(dequeme) {
  return (q.shift())
}

// Posthook action only - sends a pass/fail
app.post('/enque', (req, res) => {
  var response = {}

  try {
    let body = JSON.stringify(req.body)
    let step = (body.match(/.*("step.*)}/))[1]
    let action = "{" + step.match(/.*("action".*?)}/)[1]
    let actiontext = action.match(/"text":"(.*?)".*/)[1]

    console.log("Enque: " + actiontext)
    enque(actiontext)

    response = { 
      "updates": { 
        "action": {
          "attributes": { 
            "value": "Enqued successfully!"
            }
        },
          "stepResult": {  // Only for posthook actions
            "status": "pass",
            "message": "Because I said so"
          }  
        }
      }
  }
  catch(err) {
 
    console.log("Error when enquing (see fileerrorRequest.txt): " + err)
    fs.writeFile('errorRequest.txt', stringify(req.body), function(err) {
      if(err) {
        console.error ("ERROR: " + err)
        return 
      }
    })

    response = { 
      "updates": { 
        "action": {
          "attributes": { 
            "value": "Could not Enque!"
            }
        },
          "stepResult": {  // Only for posthook actions
            "status": "fail",
            "message": "Because I said so"
          }  
        }
      }
  
  }


  res.send(response)
})

app.post('/deque', (req, res) => {
  var val = deque()
  console.log("Deque: " + val)

  var response = { 
    "updates": { 
      "action": {
        "attributes": { 
          "value": val ? val : 'empty queue'
        }  
      }
    }
  } 
  res.send(response)
})

// Queue example end ////////////////////////////////////////////////////
