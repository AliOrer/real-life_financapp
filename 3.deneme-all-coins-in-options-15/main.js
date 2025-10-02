
const coinSelect = document.getElementById("coinSelect");
const priceEl = document.getElementById("price");


async function loadCoins() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/list");
    const coins = await res.json();
    
    
    
    coins.forEach(coin => {
      const option = document.createElement("option");
      option.value = coin.id;
      option.textContent = `${coin.name} ( ${coin.symbol.toUpperCase()})`;
      
      coinSelect.appendChild(option);
    });
   }      catch(error) {
      priceEl.innerText = "Coin listesi yuklenemedi!! " + error.message;
    }
  }
  
  async function getPrice(){
    const coin = coinSelect.value;
    try{
      const url= `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`;
      const res = await fetch(url);
      const data = await res.json();
      
      
      if(data[coin]){
        priceEl.innerText = ` ${coin.toUpperCase()} fiyatı:  ${data[coin].usd} USD`;
      }
        else{
          priceEl.innerText ="fiyat alinamadi!!";
        }
       } catch (error) {
          priceEl.innerText ="hata: " + error.message;
        }
    }

loadCoins();









