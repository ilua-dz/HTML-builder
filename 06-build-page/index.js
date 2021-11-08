const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const createBundle = async (bundleDir) => {
	await fsPromises.rm(bundleDir, { force: true, recursive: true, })
	fsPromises.mkdir(bundleDir)
	copyDir(path.join(__dirname, 'assets'),
		path.join(bundleDir, 'assets'));
	mergeStyles(bundleDir, path.join(__dirname, 'styles'))
	buildHtml(bundleDir,
		path.join(__dirname, 'template.html'),
		path.join(__dirname, 'components'))
}

const copyDir = async (srcDir, newDir) => {
	try {
		await fsPromises.rm(newDir, { force: true, recursive: true, })
		await fsPromises.mkdir(newDir);
		const files = await fsPromises.readdir(srcDir, { withFileTypes: true });
		files.forEach(file => {
			src = path.join(srcDir, file.name);
			dest = path.join(newDir, file.name);
			if (file.isDirectory()) {
				copyDir(src, dest)
			} else {
				fsPromises.copyFile(src, dest);
			}
		})
	} catch (err) { throw err }
}

const isFileCss = fileName => fileName.split('.').pop() === 'css'

const mergeStyles = async (projectPath, stylesPath) => {
	const bundlePath = path.join(projectPath, 'style.css')
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

const buildHtml = async (projectPath, templatePath, modulesPath) => {
	const modsObj = {};
	const modules = await fsPromises.readdir(modulesPath, { withFileTypes: true });
	for (const module of modules) {
		const moduleName = module.name.substring(0, module.name.lastIndexOf('.'));
		const modulePath = path.join(modulesPath, module.name);
		const stream = fs.createReadStream(modulePath, 'utf8');
		stream.on('data', chunk => {
			modsObj[moduleName] = chunk;
		})
	}

	const stream = fs.createReadStream(templatePath, 'utf8');
	let templateString = '';
	stream.on('data', chunk => {
		templateString = chunk;
	})

	setTimeout(() => {
		stream.on('end', () => {
			for (const module in modsObj) {
				if (templateString.match(`\{\{${module}\}\}`)) {
					templateString = templateString.replace(`\{\{${module}\}\}`, modsObj[module])
				}
			}
			fsPromises.writeFile(path.join(projectPath, 'index.html'), templateString)
		}, 100);
	})
}

createBundle(path.join(__dirname, 'project-dist'));