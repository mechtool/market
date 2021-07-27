const fs = require('fs');
try {
  let str = fs.readFileSync('./dist/market/stage/market.ngsw.js');
  fs.writeFileSync('./dist/market/stage/market.ngsw.js', `${str}; let stamp = ${ Math.random()};`)
}catch (err){true};
try {
  let str = fs.readFileSync('./dist/market/prod/market.ngsw.js');
  fs.writeFileSync('./dist/market/prod/market.ngsw.js', `${str}; let stamp = ${ Math.random()};`)
}catch (err){true}


