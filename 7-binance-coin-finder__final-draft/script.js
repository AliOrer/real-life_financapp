const searchInput = document.getElementById("search");
const coinList = document.getElementById("coinList");
const priceDiv = document.getElementById("price");

let allCoins = [];

//binancetan ""sadece temel"" coinleri çek
async function loadBinanceCoins(){
  const res = await fetch('https://api.binance.com/api/v3/exchangeInfo');
  const data = await res.json();
  
  
//""base assetleri çek, fazlalıkları kaldır""
  allCoins = [...new Set(data.symbols.map(s => s.baseAsset))].sort();
  renderCoins(allCoins);
}

//listeyi ekrana yaz
function renderCoins(coins){
  coinList.innerHTML = coins.map(sym => `<li onclick ="selectCoin('${sym}')">${sym}</li>`).join("");
}


// ""coin secildiğinde dropdown listeyi kapat
function selectCoin(symbol){
  searchInput.value = symbol ;
  coinList.innerHTML = ""; //input girildiğinde listeyi kapat
  getPrice(symbol);
}



//aramayı filtrele  ""sadece ilk 30 optionla sınırla""
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toUpperCase();
  const filtered = allCoins.filter(c => c.includes(term));
  renderCoins(filtered.slice(0, 30));
});




//fiyat çek binancetan
async function getPrice(symbol) {
  priceDiv.textContent = "yukleniyor...";
  try {
    
    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`);
    const data = await res.json();
    
    if(data.price){
      const price = parseFloat(data.price).toLocaleString("en-US", {style: "currency", currency: "USD"});
      priceDiv.textContent = `${symbol} fiyati : ${price} `;
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

