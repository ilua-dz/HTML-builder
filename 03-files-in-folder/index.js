const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
	if (err) {
		throw err
	} else {
		files.forEach(file => {
			if (file.isFile()) {
				fs.stat(path.join(dirPath, file.name), (err, stats) => {
					if (err) {
						throw err
					} else {
						fileName = file.name.substring(0, file.name.lastIndexOf('.'));
						fileExt = file.name.split('.').pop();
						fileSize = stats.size + ' B';
						console.log(fileName.padEnd(10),
							' - ', fileExt.padEnd(4),
							' - ', fileSize.padStart(10));
					}
				});
			}
		})
	}
});