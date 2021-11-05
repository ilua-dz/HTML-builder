const readline = require('readline');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'user_input.txt')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

console.log('Hello, my friend. Type your text:')

fs.writeFile(filePath, '', err => { if (err) throw err })

rl.on('line', input => {
	if (input.toLowerCase() === 'exit') {
		rl.close()
	} else {
		fs.appendFile(filePath, input + '\n', err => { if (err) throw err })
		console.log('Type next string or type "Exit" to exit')
	}
})

rl.on('close', () => { console.log('Good bye, my friend!') })