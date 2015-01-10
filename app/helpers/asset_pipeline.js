var Mincer, hbs, path;

hbs = require('hbs');

path = require('path');

Mincer = require('mincer');

module.exports = function (app) {
	var environment, find_asset_paths, rewrite_extension;
	environment = new Mincer.Environment();
	environment.appendPath('app/assets/js');
	environment.appendPath('app/assets/css');
	app.use("/assets", Mincer.createServer(environment));
	rewrite_extension = function (source, ext) {
		var source_ext;
		source_ext = path.extname(source);
		if (source_ext === ext) {
			return source;
		} else {
			return source + ext;
		}
	};
	find_asset_paths = function (logicalPath, ext) {
		var asset, paths;
		asset = environment.findAsset(logicalPath);
		paths = [];
		if (!asset) {
			return null;
		}
		if ('production' !== process.env.NODE_ENV && asset.isCompiled) {
			asset.toArray().forEach(function (dep) {
				return paths.push('/assets/' + rewrite_extension(dep.logicalPath, ext) + '?body=1');
			});
		} else {
			paths.push('/assets/' + rewrite_extension(asset.digestPath, ext));
		}
		return paths;
	};
	hbs.registerHelper('js', function (logicalPath) {
		var paths, result;
		paths = find_asset_paths(logicalPath, ".js");
		if (!paths) {
			return new hbs.SafeString('<script type="application/javascript">alert(Javascript file ' + JSON.stringify(logicalPath).replace(/"/g, '\\"') + ' not found.")</script>');
		}
		result = paths.map(function (path) {
			return '<script type="application/javascript" src="' + path + '"></script>';
		});
		return new hbs.SafeString(result.join("\n"));
	});
	return hbs.registerHelper('css', function (logicalPath) {
		var paths, result;
		paths = find_asset_paths(logicalPath, ".css");
		if (!paths) {
			return new hbs.SafeString('<script type="application/javascript">alert(CSS file ' + JSON.stringify(logicalPath).replace(/"/g, '\\"') + ' not found.")</script>');
		}
		result = paths.map(function (path) {
			return '<link rel="stylesheet" type="text/css" href="' + path + '" />';
		});
		return new hbs.SafeString(result.join("\n"));
	});
};
