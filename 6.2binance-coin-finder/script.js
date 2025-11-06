const searchInput = document.getElementById("search");
const coinList = document.getElementById("coinList");
const priceDiv = document.getElementById("price");

let allCoins = [];
let currentSymbol = null;//secilen coini saklamak icin

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
  currentSymbol = symbol; //secili coini kaydet
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
  priceDiv.textContent = "loading...";
  try {
    
    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`);
    const data = await res.json();
    
    if(data.price){
      const price = parseFloat(data.price).toLocaleString("en-US", {style: "currency", currency: "USD"});
      priceDiv.textContent = `${symbol} : ${price} `;
    }
    else{
      priceDiv.textContent = `${symbol} didn't find the price!` ;
    }
  }
    catch (err) {
      priceDiv.textContent = "an error occured: " + err.message;
    }
  }
loadBinanceCoins();

//her10 saniyede guncelle fiyati
setInterval(() => {
  if(currentSymbol){
    getPrice(currentSymbol);
  }
}, 5000/2);  //dahaaaaaa hizli refresh


console.log("%cCreated by Ali Örer", "color: #00bcd4; font-size: 14px; font-weight: bold;");









/*

//binancetan usdt paritelerini cekelim
async function getBinanceCoins() {
  const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
  const data = await response.json();
  const coins = new Set();
  data.symbols.forEach(symbol => {
    if (symbol.status === 'TRADING' && symbol.quoteAsset === 'USDT') {
      coins.add(symbol.baseAsset);
    }
  });
  return Array.from(coins).sort();
}

//coin fiyatlarini getirelim
async function getPrice(symbol){
  try {
    const response =  await fetch('https://api.binance.com/v3/ticker/price?symbol=${symbol}USDT');
    const data = await response.json();
    return parseFloat(data.price).toFixed(2);
  } catch (err) {
    return  null;
  }
}



//fiyati guncelle
async function updatePrice () {
  const select = document.getElementById("coinSelect");
  const symbol = select.value;
  
  if(!symbol) return;
  
  const price = await getPrice(symbol);
  if(price) {
    document.getElementById("price").textContent = `${symbol} fiyati: ${price} USDT`;
  }
}

//coin listesini getir ve ilk fiyati goster
async function listCoins(){
  const select = document.getElementById("coinSelect");
  const coins = await getBinanceCoins();
  select.innerHTML = "";
  coins.forEach(coin => {
    const option = document.createElement("option");
    option.value = coin;
    option.textContent = coin;
    select.appendChild(option);
  });
}

//ilk coin fiyatini goster
updatePrice();

//sayfa yuklendiginde coinleri getir
listCoins();

//coin degistirildiginde fiyati guncelle
document.getElementById("coinSelect").addEventListener("change", updatePrice);


//her saniyede fiyati guncelle
setInterval(() =>  {
  updatePrice();
}, 1000);

*/

