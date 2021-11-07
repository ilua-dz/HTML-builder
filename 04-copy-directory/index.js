const fs = require('fs/promises');
const path = require('path');

const copyDir = async (srcDir, newDir) => {
	try {
		await fs.rm(newDir, { force: true, recursive: true, })
		await fs.mkdir(newDir);
		const files = await fs.readdir(srcDir, { withFileTypes: true });
		files.forEach(file => {
			if (file.isDirectory()) {
				copyDir(path.join(srcDir, file.name),
					path.join(newDir, file.name))
			} else {
				fs.copyFile(path.join(srcDir, file.name),
					path.join(newDir, file.name));
			}
		})
		console.log(`${srcDir}\ncopied to\n${newDir}`)
	} catch (err) { throw err }
}

copyDir(path.join(__dirname, 'files'),
	path.join(__dirname, 'files-copy'));