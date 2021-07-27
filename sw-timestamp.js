const fs = require('fs');
  if (fs.existsSync('./dist/market/prod')){
    try {
      fs.writeFileSync('./dist/market/prod/market.ngsw.js', `${fs.readFileSync('./dist/market/prod/market.ngsw.js')}; var stamp = ${ Math.random()};`)
    }catch (err){true}

  }else if(fs.existsSync('./dist/market/stage')){
    try {
      fs.writeFileSync('./dist/market/stage/market.ngsw.js', `${fs.readFileSync('./dist/market/stage/market.ngsw.js')}; var stamp = ${ Math.random()};`)
    }catch (err){true}
  }

