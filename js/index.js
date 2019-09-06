state = [];
stateInfo = {};
function init() {
	//call to the api
	api
		.getBitCoins()
		.then((coins) => {
			console.log(coins.splice(1, 10));
			coins.splice(1, 10).map((coin) => {
				const newCoin = new CoinList(coin.id, coin.symbol, coin.name);
				state.push(newCoin);
			});
		})
		.then(() => {
			draw();
			// $('.collapse').collapse();
			$('.collapse').collapse();
		})
		.catch((e) => console.log(e));
}

function draw() {
	state.map((coin) => {
		const documentCard = $('#coin-card').clone();
		documentCard.css({ display: 'inline-block' });
		documentCard.find('#symbol').html('Symbol: ' + coin.symbol);
		documentCard.find('#name').html('Coin: ' + coin.name);
		// native bootstrap button toggle, so far not working

		// documentCard.find('.collapse').attr({ id: coin.id });
		// documentCard.find('.btn-toggle').attr({ 'data-target': '#' + coin.id });
		// documentCard.find('#btn-toggle').attr({ id: coin.id });

		documentCard.find('#btn-toggle').on('click', function() {
			api
				.getBitCoinInfo(coin.id)
				.then((coinInfo) => {
					console.log(coinInfo);
					const newCoinInfo = new CoinInfo(
						coinInfo.image.large,
						coinInfo.market_data.current_price.usd,
						coinInfo.market_data.current_price.eur,
						coinInfo.market_data.current_price.ils
					);
					stateInfo[coin.id] = newCoinInfo;
					documentCard.find('img').addClass('img-fluid', 'my-3').attr({ src: stateInfo[coin.id].image });
					documentCard.find('#usd').html(stateInfo[coin.id].usdCoinPrice + ' $');
					documentCard.find('#eur').html(stateInfo[coin.id].eurCoinPrice + ' eur');
					documentCard.find('#ils').html(stateInfo[coin.id].ilsCoinPrice + ' ils');
				})
				.catch((e) => console.log(e));
		});
		$('#main').append(documentCard);
	});
}

$(function() {
	init();

	// $('.collapse').collapse();
});
