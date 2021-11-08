const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const isFileCss = fileName => fileName.split('.').pop() === 'css'

const mergeStyles = async (projectPath, stylesPath) => {
	const bundlePath = path.join(projectPath, 'bundle.css')
	await fsPromises.rm(bundlePath, { force: true, recursive: true, })
	const styleFiles = await fsPromises.readdir(stylesPath, { withFileTypes: true });
	for (const file of styleFiles) {
		if (file.isFile() && isFileCss(file.name)) {
			const stylePath = path.join(stylesPath, file.name)
			const stream = fs.createReadStream(stylePath, 'utf8');
			stream.on('data', chunk => {
				fsPromises.appendFile(bundlePath, chunk + '\n')
			})
		}
	}
}

mergeStyles(path.join(__dirname, 'project-dist'), path.join(__dirname, 'styles'));