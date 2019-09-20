//storing coins from api
// let state = [];
//storing when user clicked on more info button to prevenet additional api calls
// let state.infoState = {};
//storing the data to display on the chart
// let state.chartState = [];

let state = {
	appState: [],
	infoState: {},
	chartState: []
};

function init() {
	//call to the api
	//spinner for loading data
	// $('#main').addClass('spinner-border', 'text-center');
	$('#main').html('');
	$('#spinner-container').removeClass('d-none');
	api
		.getBitCoins()
		.then((coins) => {
			console.log(coins.splice(1, 10));
			coins.splice(0, 50).map((coin) => {
				const newCoin = new CoinList(coin.id, coin.symbol, coin.name);
				state.appState.push(newCoin);
			});
			$('.spinner-border').addClass('d-none');
		})
		.then(() => {
			// $('#main').removeClass('spinner-border', 'text-center');
			draw(state.appState);
			// $('.collapse').collapse();
		})
		.catch((e) => console.log(e));
}

function draw(stateUI) {
	//clean ui if i draw again
	$('#search-coins').removeClass('d-none');

	$('#main').html('');
	stateUI.map((coin) => {
		const documentCard = $('#coin-card').clone();
		documentCard.css({ display: 'inline-block' });
		documentCard.find('#symbol').html('Symbol: ' + coin.symbol);
		documentCard.find('#name').html('Coin: ' + coin.name);
		//add id to collapse so later i can access it via collapse bootstrap
		documentCard.find('.collapse').attr({ id: coin.id });
		//dynamicly set switch state

		documentCard.find('input[name=checkbox]').prop('checked', coin.selected);
		$('#main').append(documentCard);
		//toggle switch
		documentCard.find('input[name=checkbox]').on('change', function() {
			if ($(this).is(':checked')) {
				// Checkbox is checked..
				coin.selected = true;
				// bring the popup if chart state bigger than 5
				if (state.chartState.length >= 5) {
					//prevent from checking the six switch checkbox when draw again
					coin.selected = false;
					//prevent from checking the six switch checkbox when selecting
					$(this).prop('checked', false);
					$('#myModal').modal('show');
					$('#main-modal').append(drawModal());
					return;
				}
				state.chartState.push(coin);
			} else {
				// Checkbox is not checked..
				const chartToDelete = state.chartState.findIndex((chartCoin) => chartCoin.id === coin.id);
				state.chartState.splice(chartToDelete, 1);
			}
		});

		// more info button
		documentCard.find('#btn-toggle').on('click', function() {
			//if coin does not exist in state.infoState call the api
			if (!state.infoState[coin.id]) {
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

						state.infoState[coin.id] = newCoinInfo;
						state.infoState[coin.id].showCoinInfo = !state.infoState[coin.id].showCoinInfo;
						documentCard.find('img').addClass('img-fluid').attr({ src: state.infoState[coin.id].image });
						documentCard
							.find('#usd')
							.addClass('mt-3')
							.html(state.infoState[coin.id].usdCoinPrice + ' <i class="fas fa-dollar-sign"></i>');
						documentCard
							.find('#eur')
							.html(state.infoState[coin.id].eurCoinPrice + ' <i class="fas fa-euro-sign"></i>');
						documentCard
							.find('#ils')
							.html(state.infoState[coin.id].ilsCoinPrice + ' <i class="fas fa-shekel-sign"></i>');
						$('#' + coin.id).collapse();
					})
					// .then(() => $('.collapse').collapse())
					.catch((e) => console.log(e));
			} else {
				//if coin exist do not make api call
				state.infoState[coin.id].showCoinInfo = !state.infoState[coin.id].showCoinInfo;

				!state.infoState[coin.id].showCoinInfo
					? $('#' + coin.id).collapse('hide')
					: $('#' + coin.id).collapse('show');
			}
		});
	});
}

function drawModal() {
	//clean ui if i draw again
	$('#main-modal').html('');
	return state.chartState.map((chart) => {
		const documentModalCloned = $('#cloned-modal').clone();
		documentModalCloned.css({ display: 'block' });
		documentModalCloned.find('.switch').append(chart.symbol.toUpperCase());
		documentModalCloned.find('input').prop('checked', true);

		$('#main-modal').append(documentModalCloned);
		documentModalCloned.find('input[name=modal-checkbox]').on('change', function() {
			if ($(this).is(':checked')) {
				// Checkbox is checked..
				alert('checked');
				//find index in state to update selected toggle button
				const stateIndexToUpdate = state.appState.findIndex((stateCoin) => stateCoin.id === chart.id);
				//update state toggle button
				state.appState[stateIndexToUpdate].selected = true;
				// bring the popup if chart state bigger than 5
				state.appState.chartState.push(chart);
			} else {
				// Checkbox is not checked..
				alert('unchecked');
				//update the ui to false selected
				const stateIndexToUpdate = state.appState.findIndex((stateCoin) => stateCoin.id === chart.id);
				state.appState[stateIndexToUpdate].selected = false;
				//delete from state.chartState
				const chartToDelete = state.chartState.findIndex((chartCoin) => chartCoin.id === chart.id);
				state.chartState.splice(chartToDelete, 1);
			}
		});
	});
}

function searchAction(state) {
	console.log('search = ' + state);
	const searchTerm = $('#search-input').val();
	const result = state.filter((coin) => coin.symbol.includes(searchTerm));
	return result;
}

function initAbout() {
	$('#search-coins').addClass('d-none');
	const aboutDocument = $('#about').clone();
	aboutDocument.removeClass('d-none');
	$('#main').html(aboutDocument);
}

function createChart() {
	// const promises = state.chartState.map((chart) => api.getSingleCoin(chart.symbol.toUpperCase()));
	// Promise.all(promises).then((res) => console.log(res));
	if (state.chartState.length < 4) {
		$('#main').html('Need To Select at least 5 coins');
		return;
	}
	state.chartState.map((chart) => api.getSingleCoin(chart.symbol.toUpperCase()));
	api
		.getMultiCoins(
			state.chartState[0].symbol.toUpperCase(),
			state.chartState[1].symbol.toUpperCase(),
			state.chartState[2].symbol.toUpperCase(),
			state.chartState[3].symbol.toUpperCase(),
			state.chartState[4].symbol.toUpperCase()
		)
		.then((res) => {
			console.log('res = ' + res);
			const chartNames = Object.keys(res).filter((key) => key).map((key) => {
				return { label: key, y: res[key].USD };
			});
			const chartLength = chartNames.length;
			console.log(chartNames);
			var options = {
				title: {
					text: 'Number of Active Users in Website'
				},

				data: [
					{
						type: 'column',
						yValueFormatString: '#,###',
						indexLabel: '{y}',
						color: '#546BC1',
						// dataPoints: [ getChartObject(chartNames) ]
						// dataPoints: [ chartNames[0], chartNames[1], chartNames[2], chartNames[3], chartNames[4] ]
						dataPoints: [ chartNames.map((chartObj) => chartObj) + ',' ]
					}
				]
			};
			$('#chartContainer').CanvasJSChart(options);
		})
		.catch((e) => $('#main').html('NO COINS FOUND'));
	// 	BTC: {USD: 10350.75}
	// ETH: {USD: 194.03}
}

function getChartObject(charts) {
	return charts.map((c) => c);
}

function initChart() {
	$('#search-coins').addClass('d-none');
	$('#main').html('<div id="chartContainer" class="w-100"></div>');
	createChart();
}

function clearMainDOM() {
	$('#main').html('');
}

function initInfoState() {
	state.infoState = {};
}

function getMultiCoinsBySymbol() {
	const promise = api.getMultiCoins(
		state.chartState[0].symbol.toUpperCase(),
		state.chartState[1].symbol.toUpperCase(),
		state.chartState[2].symbol.toUpperCase(),
		state.chartState[3].symbol.toUpperCase(),
		state.chartState[4].symbol.toUpperCase()
	);
	promise.then((p) => console.log(p));
}

$(function() {
	init();
	//event when i close the modal
	$('#myModal').on('hidden.bs.modal', function() {
		draw(state.appState);
	});

	$('#search-btn').on('click', function() {
		const result = searchAction(state.appState);
		$('#search-input').val('');
		result.length === 0 ? draw(state.appState) : draw(result);
	});

	$('#home-tab').on('click', function() {
		$('#search-coins').removeClass('d-none');
		clearMainDOM();
		init();
	});

	$('#about-tab').on('click', function() {
		clearMainDOM();
		initInfoState();
		initAbout();
	});

	$('#chart-tab').on('click', function() {
		clearMainDOM();
		initInfoState();
		initChart();
	});
});
