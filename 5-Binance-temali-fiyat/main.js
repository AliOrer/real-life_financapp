// HTML elementlerini seçiyoruz
const searchInput = document.getElementById("searchInput");
const coinSelect = document.getElementById("coinSelect");
const priceEl = document.getElementById("price");

// Tüm coinleri saklamak için bir dizi oluşturuyoruz.
let allBinanceCoins = [];

/**
 * Binance API'sinden sadece işlemde olan ("TRADING") coinlerin listesini çeker.
 * Sadece ana coinleri (baseAsset) alırız, USDT, TRY gibi karşıt coinleri almayız.
 */
async function getBinanceCoins() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
        const data = await response.json();
        const coins = new Set(); // Set kullanarak her coinin sadece bir kere eklenmesini sağlıyoruz.

        data.symbols.forEach(symbol => {
            if (symbol.status === 'TRADING') {
                coins.add(symbol.baseAsset);
            }
        });

        // Set'i diziye çevirip alfabetik olarak sıralıyoruz.
        return Array.from(coins).sort();
    } catch (error) {
        console.error("Binance coin listesi alınamadı:", error);
        coinSelect.innerHTML = '<option>Hata! Coinler alınamadı.</option>';
        return []; // Hata durumunda boş dizi döndür.
    }
}

/**
 * Verilen coin listesine göre select kutusunu doldurur.
 * @param {string[]} coins - Doldurulacak coinlerin listesi (örn: ['BTC', 'ETH'])
 */
function populateCoinList(coins) {
    coinSelect.innerHTML = ''; // Select kutusunu temizle
    if (coins.length === 0) {
        coinSelect.innerHTML = '<option>Sonuç bulunamadı</option>';
        return;
    }
    coins.forEach(coin => {
        const option = document.createElement("option");
        option.value = coin;
        option.textContent = coin;
        coinSelect.appendChild(option);
    });
}

/**
 * Seçilen coinin USDT paritesindeki anlık fiyatını çeker ve ekranda gösterir.
 */
async function getSelectedCoinPrice() {
    const selectedCoin = coinSelect.value;
    if (!selectedCoin) return;

    // Fiyatı çekmeye başlamadan önce kullanıcıya bilgi verelim.
    priceEl.innerText = `${selectedCoin} fiyatı yükleniyor...`;

    try {
        // Genellikle en popüler parite USDT olduğu için ona göre fiyat çekiyoruz.
        const symbol = `${selectedCoin}USDT`;
        const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        
        if (!response.ok) {
            throw new Error(`'${symbol}' paritesi bulunamadı.`);
        }
        
        const data = await response.json();
        
        // Fiyatı daha okunaklı hale getirelim.
        const price = parseFloat(data.price);
        const formattedPrice = price < 1 ? price.toPrecision(4) : price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
        
        priceEl.innerHTML = `${selectedCoin} <br> <span style="color: #f0b90b;">$${formattedPrice}</span>`;
    
    } catch (error) {
        console.error("Fiyat alınırken hata oluştu:", error);
        priceEl.innerText = `${selectedCoin} için fiyat alınamadı.`;
    }
}


// --- OLAY DİNLEYİCİLERİ (EVENT LISTENERS) ---

// Arama kutusuna her harf girildiğinde coin listesini filtreler.
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toUpperCase();
    const filteredCoins = allBinanceCoins.filter(coin => coin.startsWith(searchTerm));
    populateCoinList(filteredCoins);
});

// Select kutusundan yeni bir coin seçildiğinde fiyatı getirir.
coinSelect.addEventListener('change', getSelectedCoinPrice);


// --- SAYFA YÜKLENDİĞİNDE BAŞLATMA ---

// Sayfa ilk yüklendiğinde tüm işlemleri başlatan ana fonksiyon.
async function initializeApp() {
    allBinanceCoins = await getBinanceCoins();
    if (allBinanceCoins.length > 0) {
        populateCoinList(allBinanceCoins);
        // İlk coinin fiyatını otomatik olarak getir.
        getSelectedCoinPrice();
    }
}

initializeApp();
