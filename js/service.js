const APIKEY = 'a4706b5503d8e3e48072ac26852b079dc220947283e540e107a0587ce0c3282d';

const config = {
	getBitCoinsURL: `‫‪https://api.coingecko.com/api/v3/coins/list‬‬?`
};

const api = {
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
