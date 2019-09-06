const config = {
	getBitCoinsURL: `‫‪https://api.coingecko.com/api/v3/coins/list‬‬?`
};

const api = {
	getBitCoins: () => {
		return $.ajax({
			url: `https://api.coingecko.com/api/v3/coins/list?‬‬`,
			method: 'get'
		});
	}
};

//working
//url: `https://api.coingecko.com/api/v3/coins/list?‬‬`,
