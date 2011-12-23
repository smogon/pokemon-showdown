// var http = require('http')
//   , request = require('../main')
//   ;
// 
// var s = http.createServer(function (req, resp) {
//   resp.statusCode = 412
//   resp.end('hello')
// })
// s.listen(8000)
// 
// request.put("http://localhost:8000", function (e,_,b){
//   console.log(e,b)
//   s.close()
// })

require('../main').put("http://testnano.iriscouch.com:80/test", function (e,_,b){
  console.log(e,b)
})
