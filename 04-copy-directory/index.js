const fs = require('fs/promises');
const path = require('path');

const copyDir = async (srcDir, newDir) => {
	try {
		await fs.rm(newDir, { force: true, recursive: true, })
		await fs.mkdir(newDir);
		const files = await fs.readdir(srcDir, { withFileTypes: true });
		files.forEach(file => {
			src = path.join(srcDir, file.name);
			dest = path.join(newDir, file.name);
			if (file.isDirectory()) {
				copyDir(src, dest)
			} else {
				fs.copyFile(src, dest);
			}
		})
		console.log(`-----\n${srcDir}\ncopied to\n${newDir}\n-----`)
	} catch (err) { throw err }
}

copyDir(path.join(__dirname, 'files'),
	path.join(__dirname, 'files-copy'));