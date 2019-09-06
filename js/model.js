class CoinList {
	constructor(id, symbol, name) {
		this.id = id;
		this.symbol = symbol;
		this.name = name;
	}
}

class CoinInfo {
	constructor(image, usdCoinPrice, eurCoinPrice, ilsCoinPrice) {
		this.image = image;
		this.usdCoinPrice = usdCoinPrice;
		this.eurCoinPrice = eurCoinPrice;
		this.ilsCoinPrice = ilsCoinPrice;
	}
}
