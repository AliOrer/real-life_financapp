//binance api - grab the main coins

async function getBinanceCoins() {
  
  const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
  const data = await response.json();
  const coins = new Set();
  data.symbols.forEach(symbol => {
    if (symbol.status == 'TRADING') {
      coins.add(symbol.baseAsset);
      coins.add(symbol.quoteAsset);
    }
  });
  return Array.from(coins);
}


//okx api - grab the main coins again

async function getOKXCoins(){
  
  const response = await fetch('https://www.okx.com/api/v5/public/instruments');
  const data = await response.json();
  const coins = new Set();
  data.data.forEach(instrument => {
    if (instrument.state === 'live'){
      const [base, quote] = instrument.instId.split('-');
      coins.add(base);
      coins.add(quote);
    }
  });
  return Array.from(coins);
}


//take the coins and list

async function listCoins(){
  const binanceCoins = await getBinanceCoins();
  const okxCoins = await getOKXCoins();
  const allCoins = [... new Set([...binanceCoins, ...okxCoins])];
  console.log(allCoins);
}

listCoins();