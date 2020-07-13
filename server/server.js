const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
let setHistory = [];
let total = 0;
let runIndex = 0;
let runTotal = 0;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('server/public'));

app.listen(PORT, () => {
	console.log('Server is running on port', PORT);
});

app.get('/total', (req, res) => {
	let domTotal = { total: total };
	res.send(domTotal);
	total = 0;
});

app.get('/history', (req, res) => {
	let setDomHistory = setHistory;
	res.send(setDomHistory);
});

app.get('/run', (req, res) => {
	let returnAns = { runTotal: runTotal };
	res.send(returnAns);
	runTotal = 0;
});

app.post('/index', (req, res) => {
	let index = req.body.search;
	runIndex = index;
	let runSet = setHistory[runIndex];
	let sliceRun = sliceOperationalSet(runSet);
	runTotal = calculateObject(sliceRun);
	res.send(true);
});

app.post('/operation', (req, res) => {
	let tempObject = req.body;
	let sliceSet = sliceOperationalSet(tempObject);
	setHistory.push(tempObject);
	let setTotal = calculateObject(sliceSet);
	total += setTotal;
	res.send(true);
});

app.delete('/delete', (req, res) => {
	setHistory = [];
	res.send(true);
});

function sliceOperationalSet(obj) {
	const operators = '- / + *';
	let arrCalculate = [];
	let tempWord = '';

	for (key in obj) {
		for (let i = 0; i < obj[key].length; i++) {
			tempWord += obj[key][i];
			if (operators.includes(obj[key][i])) {
				arrCalculate.push(Number(tempWord.substring(0, tempWord.length - 1)));
				arrCalculate.push(obj[key][i]);
				tempWord = '';
			}
		}
		arrCalculate.push(Number(tempWord));
	}
	return arrCalculate;
}

function calculateObject(arr) {
	let el = arr;
	let ans = 0;
	let num = arr[0];

	for (let i = 0; i < el.length; i++) {
		switch (el[i]) {
			case '+':
				ans = num + el[i + 1];
				num = ans;
				break;
			case '-':
				ans = num - el[i + 1];
				num = ans;
				break;
			case '*':
				ans = num * el[i + 1];
				num = ans;
				break;
			case '/':
				ans = num / el[i + 1];
				num = ans;
				break;
		}
	}
	return num;
}
