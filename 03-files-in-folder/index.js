const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
	files.forEach(file => {
		if (file.isFile()) {
			fs.stat(path.join(dirPath, file.name), (err, stats) => {
				console.log(file.name.substring(0, file.name.lastIndexOf('.')).padEnd(10), ' - ',
					file.name.split('.').pop().padEnd(4), ' - ',
					(stats.size + ' B').padStart(10));
			});
		}
	})
});