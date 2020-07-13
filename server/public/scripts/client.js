$(document).ready(onReady);

function onReady() {
	setOperationalHistory();
	$('.button').on('click', displaySetCalculation);
	$('#equal-btn').on('click', captureOperationSet);
	$('#ac-btn').on('click', clearCalculator);
	$('#clear-btn').on('click', clearSetHistory);
	$('#history_results').on('click', '.run-btn', returnOperationalSet);
}

function captureOperationSet() {
	if (validateCalculatorEntry()) {
		return;
	}

	let operationSet = $('#cal-display').html();

	let setObj = {
		opset: operationSet,
	};

	clearCalculator();

	$.ajax({
		method: 'POST',
		url: '/operation',
		data: setObj,
	})
		.then(function (response) {})
		.catch(function (error) {
			alert('Bad' + error);
		});
	serverResponse();
	setOperationalHistory();
}

function serverResponse() {
	$.ajax({
		method: 'GET',
		url: '/total',
	})
		.then(function (response) {
			if (response) {
				$('#cal-display').text(Object.values(response));
			}
		})
		.catch(function (err) {
			alert('Error, invalid input:', err);
		});
}

function returnOperationalSet() {
	let searchIndex = $(this).parent().closest('tr').find('.index-val').html();

	let objIndex = {
		search: searchIndex,
	};
	$.ajax({
		method: 'POST',
		url: '/index',
		data: objIndex,
	})
		.then(function (response) {})
		.catch(function (error) {
			alert('Bad' + error);
		});
	runOperationalSet();
}

function runOperationalSet() {
	$.ajax({
		method: 'GET',
		url: '/run',
	})
		.then(function (response) {
			if (response) {
				$('#cal-display').text(Object.values(response));
			}
		})
		.catch(function (err) {
			alert('Error, invalid input:', err);
		});
}

function setOperationalHistory() {
	$.ajax({
		method: 'GET',
		url: '/history',
	})
		.then(function (response) {
			if (response) {
				displaySetHistory(response);
			}
		})
		.catch(function (err) {
			alert('Error, invalid input:', err);
		});
}

function displaySetHistory(objHistory) {
	emptyHistory();
	for (let i = 0; i < objHistory.length; i++) {
		for (key in objHistory[i]) {
			let el = objHistory[i][key];
			$('#history_results').append(`<tr>
		<td colspan="1" class="index-val">${i}</td>
		<td colspan="2">${el}</td>
		<td colspan="1"><button type="button" class="run-btn">Run</button></td>
    	</tr>`);
		}
	}
}

function clearSetHistory() {
	$.ajax({
		method: 'DELETE',
		url: '/delete',
	})
		.then(function (response) {
			if (response) {
				emptyHistory();
				clearCalculator();
			}
		})
		.catch(function (err) {
			alert('Error, invalid input:', err);
		});
}

function displaySetCalculation() {
	let setPartial = $(this).val();
	$('#cal-display').append(setPartial);
}

function clearCalculator() {
	$('#cal-display').empty();
}

function emptyHistory() {
	$('#history_results').empty();
}

function validateCalculatorEntry() {
	const operators = '- / + * .';
	const invalidEntry = 'Invalid Operator Set';

	let display = $('#cal-display').html();
	display.toString();

	if (display.length < 3) {
		$('#cal-display').html(invalidEntry);
		return true;
	} else if (
		isNaN(display[0]) === true ||
		isNaN(display[display.length - 1]) === true
	) {
		$('#cal-display').html(invalidEntry);
		return true;
	} else if (
		isNaN(display[0]) === true &&
		isNaN(display[display.length - 1]) === true
	) {
		$('#cal-display').html(invalidEntry);
		return true;
	}

	let operator = 0;

	for (let i = 1; i < display.length - 1; i++) {
		if (operators.includes(display[i])) {
			operator += 1;
		}
		if (operators.includes(display[i]) && operators.includes(display[i + 1])) {
			$('#cal-display').html(invalidEntry);
			return true;
		}
	}
	if (operator === 0) {
		$('#cal-display').html(invalidEntry);
		return true;
	}

	let mathOp = '+ / - *';
	let comp = [];

	for (let i = 0; i < display.length; i++) {
		if (mathOp.includes(display[i])) {
			comp.push(display[i]);
		} else if (display[i] === '.') {
			comp.push(display[i]);
		}
	}

	let lenComp = 0;
	let decComp = 0;
	for (let i = 0; i < comp.length - 1; i++) {
		if (
			(comp[i] === '.' && mathOp.includes(comp[i + 1])) ||
			(comp[i + 1] === '.' && mathOp.includes(comp[i]))
		) {
			lenComp += 1;
		} else if (comp[i] === '.') {
			decComp += 1;
		}
	}
	console.log(comp);
	if (lenComp !== comp.length - 1 && decComp !== 0) {
		$('#cal-display').html(invalidEntry);
		return true;
	}
	return false;
}
