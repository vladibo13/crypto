//storing coins from api
// let state = [];
//storing when user clicked on more info button to prevenet additional api calls
// let state.infoState = {};
//storing the data to display on the chart
// let state.chartState = [];

const state = {
	appState: [],
	infoState: {},
	chartState: []
};

function init() {
	// $('#main').addClass('spinner-border', 'text-center');
	$('#main').html('');
	//spinner for loading data
	$('#spinner-container').removeClass('d-none');
	//call to the api
	if (state.appState.length === 0) {
		api
			.getBitCoins()
			.then((coins) => {
				coins.splice(25, 150).map((coin) => {
					const newCoin = new CoinList(coin.id, coin.symbol, coin.name);
					state.appState.push(newCoin);
				});
			})
			.then(() => {
				draw(state.appState);
			})
			.catch((e) => console.log(e));
	} else {
		//no need to send api call if data already loaded
		draw(state.appState);
	}
}

function draw(stateUI) {
	$('#search-coins').removeClass('d-none');
	//remove spinner
	$('.spinner-border').addClass('d-none');
	//clean ui if i draw again
	$('#main').html('');
	stateUI.map((coin) => {
		//create document
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
				// bring the modal if chart state bigger than 5
				if (state.chartState.length >= 5) {
					//prevent from checking the six switch checkbox when draw again
					coin.selected = false;
					//prevent from checking the six switch checkbox when selecting
					$(this).prop('checked', false);
					//show and draw modal
					$('#myModal').modal('show');
					$('#main-modal').append(drawModal());
					return;
				}
				//push to chart state
				state.chartState.push(coin);
			} else {
				// Checkbox is not checked..
				// delete from chart state
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
						//toggle show coin boolean
						state.infoState[coin.id].showCoinInfo = !state.infoState[coin.id].showCoinInfo;
						//create and append all the data
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
						//show the collapse
						$('#' + coin.id).collapse();
					})
					// .then(() => $('.collapse').collapse())
					.catch((e) => console.log(e));
			} else {
				//if coin exist do not make api call
				state.infoState[coin.id].showCoinInfo = !state.infoState[coin.id].showCoinInfo;
				//toggle collapse
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
		//create the modal
		const documentModalCloned = $('#cloned-modal').clone();
		documentModalCloned.css({ display: 'block' });
		documentModalCloned.find('.switch');
		documentModalCloned.find('.modal-symbol').html(chart.symbol.toUpperCase());
		documentModalCloned.find('input').prop('checked', true);
		$('#main-modal').append(documentModalCloned);
		documentModalCloned.find('input[name=modal-checkbox]').on('change', function() {
			if ($(this).is(':checked')) {
				// Checkbox is checked..
				// alert('checked');
				//find index in state to update selected toggle button
				const stateIndexToUpdate = state.appState.findIndex((stateCoin) => stateCoin.id === chart.id);
				//update state toggle button
				state.appState[stateIndexToUpdate].selected = true;
				// bring the popup if chart state bigger than 5
				state.appState.chartState.push(chart);
			} else {
				// Checkbox is not checked..
				// alert('unchecked');
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

function initChart() {
	$('#search-coins').addClass('d-none');
	$('#main').html('<div id="chartContainer" class="w-100"></div>');
	createChart();
}

function clearMainDOM() {
	$('#main').html('');
}
//clean infostate to prevent bugs
function initInfoState() {
	state.infoState = {};
}

function createTable() {
	if (state.chartState !== 0) draw(state.chartState);
}

$(function() {
	init();
	//event when i close the modal
	$('#myModal').on('hidden.bs.modal', function() {
		draw(state.appState);
	});
	//search for coins
	$('#search-btn').on('click', function() {
		const result = searchAction(state.appState);
		$('#search-input').val('');
		result.length === 0 ? draw(state.appState) : draw(result);
	});

	$('#home-tab').on('click', function() {
		$('#search-coins').removeClass('d-none');
		initInfoState();
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

	$('#favorites-tab').on('click', function() {
		clearMainDOM();
		initInfoState();
		createTable();
	});
});
