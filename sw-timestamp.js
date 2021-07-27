const fs = require('fs');
try {
  fs.writeFileSync('./dist/market/stage/market.ngsw.js', `${fs.readFileSync('./dist/market/stage/market.ngsw.js')}; var stamp = ${ Math.random()};`)
}catch (err){true}
