function createChart() {
	// const promises = state.chartState.map((chart) => api.getSingleCoin(chart.symbol.toUpperCase()));
	// Promise.all(promises).then((res) => console.log(res));
	if (state.chartState.length < 4) {
		$('#main').html(`<h2 className='display-4 my-5'>Need To Select at least 5 coins</h2>`);
		return;
	}
	// state.chartState.map((chart) => api.getSingleCoin(chart.symbol.toUpperCase()));
	// api.getSingleCoin(state.chartState[0].symbol.toUpperCase()).then((res) => {
	// 	console.log('res = ' + res);
	// 	const chartNames = Object.keys(res).filter((key) => key).map((key) => {
	// 		return { label: key, y: res[key].USD };
	// 	});
	// 	const chartLength = chartNames.length;
	// 	console.log(chartNames);
	// 	var options = {
	// 		title: {
	// 			text: 'Bitcoins Chart'
	// 		},

	// 		data: [
	// 			{
	// 				type: 'column',
	// 				yValueFormatString: '#,###',
	// 				indexLabel: '{y}',
	// 				color: '#546BC1',
	// 				dataPoints: [ chartNames ]
	// 			}
	// 		]
	// 	};
	// 	$('#chartContainer').CanvasJSChart(options);
	// });
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
					text: 'Bitcoins Chart'
				},

				data: [
					{
						type: 'column',
						yValueFormatString: '#,###',
						indexLabel: '{y}',
						color: '#546BC1',
						dataPoints: [ chartNames[0], chartNames[1], chartNames[2], chartNames[3], chartNames[4] ]
					}
				]
			};
			$('#chartContainer').CanvasJSChart(options);
		})
		.catch((e) => $('#main').html('NO COINS FOUND'));
	// 	BTC: {USD: 10350.75}
	// ETH: {USD: 194.03}
}
