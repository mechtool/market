const fs = require('fs');
  if (fs.existsSync('./dist/market/prod')){
    try {
      let p = './dist/market/prod/market.ngsw.js';
      fs.writeFileSync(p, `${fs.readFileSync(p)}; var stamp = ${ Math.random()};`)
    }catch (err){true}

  }else if(fs.existsSync('./dist/market/stage')){
    try {
      let p = './dist/market/stage/market.ngsw.js';
      fs.writeFileSync(p, `${fs.readFileSync(p)}; var stamp = ${ Math.random()};`)
    }catch (err){true}
  }

