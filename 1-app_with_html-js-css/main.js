async function getPrice() {
  try {
    const res = await 
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
    const data = await res.json();
    
    document.getElementById("price").innerText = data.bitcoin.usd + "USD";
  } catch (error) {
    document.getElementById("price").innerText = "Hata: " + error.message;
  }
}

getPrice();
setInterval(getPrice, 5000);