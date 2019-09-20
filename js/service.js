const APIKEY = 'a4706b5503d8e3e48072ac26852b079dc220947283e540e107a0587ce0c3282d';
// API CALL https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,ABC&tsyms=USD

const config = {
	getBitCoinsURL: `‫‪https://api.coingecko.com/api/v3/coins/list‬‬?`
};

const api = {
	getSingleCoin: (coin) => {
		console.log(coin);
		return $.ajax({
			url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coin}&tsyms=USD‬`,
			method: 'get'
		});
	},
	getMultiCoins: (coin1, coin2, coin3, coin4, coin5) => {
		return $.ajax({
			url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coin1},${coin2},${coin3},${coin4},${coin5}&tsyms=USD,EUR‬‬`,
			method: 'get'
		});
	},
	getBitCoins: () => {
		return $.ajax({
			url: `https://api.coingecko.com/api/v3/coins/list?‬‬`,
			method: 'get'
		});
	},
	getBitCoinInfo: (coinID) => {
		return $.ajax({
			url: `https://api.coingecko.com/api/v3/coins/${coinID}?`,
			method: 'get'
		});
	}
};

//working
//url: `https://api.coingecko.com/api/v3/coins/list?‬‬`,
//https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR‬‬
