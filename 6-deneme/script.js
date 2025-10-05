const searchInput = document.getElementById("search");
const coinList = document.getElementById("coinList");
const priceDiv = document.getElementById("price");

let allCoins = [];

//binancetan coinleri çek
async function loadBinanceCoins(){
  const res = await fetch('https://api.binance.com/api/v3/ticker/price');
  const data = await res.json();
  
  
//btc/usdt gibi 2. eklentileri kaldır  
  allCoins = [...new Set(data.map(c => c.symbol.replace(/(USDT | BUST | FDUSD | USDC)$/, ""))
  .filter(sym => sym.length < 10))].sort();
  
  renderCoins(allCoins);
}

//listeyi ekrana yaz
function renderCoins(coins){
  coinList.innerHTML = coins.map(sym => 
  `<li onclick ="getPrice('${sym}')">${sym}</li>`).join("");
}


//aramayı filtrele
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toUpperCase();
  const filtered = allCoins.filter(c => c.includes(term));
  renderCoins(filtered);
});




//fiyat çek binancetan
async function getPrice(symbol) {
  priceDiv.textContent = "yukleniyor...";
  try {
    
    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`);
    const data = await res.json();
    
    if(data.price){
      const price = parseFloat(data.price).toLocaleString("en-US", {style: "currency", currency: "USD"});
      priceDiv.textContent = `${symbol} fiyati : ${price} ;`
    }
    else{
      priceDiv.textContent = `${symbol} icin fiyat bulunamadi!` ;
    }
  }
    catch (err) {
      priceDiv.textContent = "bir hata olustu: " + err.message;
    }
  }
loadBinanceCoins();