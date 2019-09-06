state = [];
function init() {
	api
		.getBitCoins()
		.then((coins) => {
			console.log(coins.splice(1, 10));
			coins.splice(1, 10).map((coin) => {
				const newCoin = new CoinList(coin.id, coin.symbol, coin.name);
				state.push(newCoin);
			});
		})
		.then(() => draw())
		.catch((e) => console.log(e));
}

function draw() {
	state.map((coin) => {
		const documentCard = $('#coin-card').clone();
		documentCard.css({ display: 'inline-block' });
		documentCard.find('#symbol').html('Symbol: ' + coin.symbol);
		documentCard.find('#name').html('Coin: ' + coin.name);
		$('#main').append(documentCard);
	});
}

$(function() {
	init();
});
