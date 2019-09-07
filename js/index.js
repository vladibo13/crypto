//storing coins from api
state = [];
//storing when user clicked on more info button to prevenet additional api calls
stateInfo = {};
//storing the data to display on the chart
chartState = [];
function init() {
	//call to the api
	//spinner for loading data
	// $('#main').addClass('spinner-border', 'text-center');
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
			// $('#main').removeClass('spinner-border', 'text-center');
			draw();
			// $('.collapse').collapse();
		})
		.catch((e) => console.log(e));
}

function draw() {
	state.map((coin) => {
		const documentCard = $('#coin-card').clone();
		documentCard.css({ display: 'inline-block' });
		documentCard.find('#symbol').html('Symbol: ' + coin.symbol);
		documentCard.find('#name').html('Coin: ' + coin.name);
		documentCard.find('#input-toggle').attr({
			type: 'checkbox',
			'data-toggle': 'toggle',
			'data-onstyle': 'info',
			'data-size': 'small'
		});
		// native bootstrap button toggle, so far not working

		// documentCard.find('#btn-toggle').attr({ id: coin.id });
		// documentCard.find('#btn-toggle').attr({ 'data-target': '#' + coin.id });

		//add id to collapse so later i can access it via collapse bootstrap
		documentCard.find('.collapse').attr({ id: coin.id });
		//toggle switch
		$('#main').append(documentCard);

		documentCard.find('input[name=checkbox]').on('change', function() {
			if ($(this).is(':checked')) {
				// Checkbox is checked..

				// bring the popup if chart state bigger than 5
				if (chartState.length >= 5) {
					$(this).prop('checked', false);
					$('#myModal').modal('show');
					$('#main-modal').append(drawModal());
					return;
				}
				chartState.push(coin);
			} else {
				// Checkbox is not checked..
				const chartToDelete = chartState.findIndex((chartCoin) => chartCoin.id === coin.id);
				chartState.splice(chartToDelete, 1);
			}
		});

		// more info button
		documentCard.find('#btn-toggle').on('click', function() {
			//if coin does not exist in stateInfo call the api
			if (!stateInfo[coin.id]) {
				api
					.getBitCoinInfo(coin.id)
					.then((coinInfo) => {
						console.log(coinInfo);
						//create a new CoinInfo
						const newCoinInfo = new CoinInfo(
							coinInfo.image.large,
							coinInfo.market_data.current_price.usd,
							coinInfo.market_data.current_price.eur,
							coinInfo.market_data.current_price.ils
						);
						//push to state info object with key:{object}

						stateInfo[coin.id] = newCoinInfo;
						stateInfo[coin.id].showCoinInfo = !stateInfo[coin.id].showCoinInfo;
						documentCard.find('img').addClass('img-fluid', 'my-3').attr({ src: stateInfo[coin.id].image });
						documentCard.find('#usd').html(stateInfo[coin.id].usdCoinPrice + ' $');
						documentCard.find('#eur').html(stateInfo[coin.id].eurCoinPrice + ' eur');
						documentCard.find('#ils').html(stateInfo[coin.id].ilsCoinPrice + ' ils');
						$('#' + coin.id).collapse();
					})
					// .then(() => $('.collapse').collapse())
					.catch((e) => console.log(e));
			} else {
				//if coin exist do not make api call
				stateInfo[coin.id].showCoinInfo = !stateInfo[coin.id].showCoinInfo;

				!stateInfo[coin.id].showCoinInfo
					? $('#' + coin.id).collapse('hide')
					: $('#' + coin.id).collapse('show');
			}
		});
	});
}

function drawModal() {
	return chartState.map((chart) => {
		const documentModalCloned = $('#cloned-modal').clone();
		documentModalCloned.css({ display: 'block' });
		documentModalCloned.find('.switch').html(` 
		<label>
			${chart.symbol}
			<input type="checkbox" name="checkbox">
			<span class="lever"></span>
		  </label>`);
		documentModalCloned.find('input').prop('checked', true);
		$('#main-modal').append(documentModalCloned);
	});
}

$(function() {
	init();
});
