const Kucoin = require("./index")

const client = new Kucoin()

// Maximum 100 Symbol / Connection!
const symbols = ["BTC-USDT", "ETH-BTC"]

let test = async () => {
    let connection = await client.Ticker(symbols, (data) => {
        console.log(data)
    });
}

// Start
test()