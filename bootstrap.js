/**
 * Bootstrap code for Narwhal on WScript
 * @author Nathan L Smith <nlloyds@gmail.com>
 * @date September 24, 2009
 */

/*global ActiveXObject, WScript */
/*jslint evil:true */

(function (global, evalGlobal) {
    var shell = new ActiveXObject("WScript.Shell"),
        env = shell.Environment("Process"),
        prefix = env("NARWHAL_HOME") || "C:\\NARWHAL",
        fs = {}, // for filesystem methods
        print;

    // Create the print function if wscript echo is available
    if (typeof WScript === "object") {
        print = function () { 
            WScript.echo(Array.prototype.slice.call(arguments).join(", "));
        };
    } else {
        print = function () {};
    }

    // This is a handle on the fs object used by the wscript engine
    fs.o = new ActiveXObject("Scripting.FileSystemObject");

    fs.read = function (path) {
        var contents = "", // File contents
            file; // File descriptor

        if (fs.isFile(path)) {
            file = fs.o.getFile(path);
            if (file.size > 0) {
                contents = fs.o.openTextFile(path).readAll();
            }
        }
        return contents; };

    fs.isFile = function (path) {
        return fs.o.fileExists(path);
    };

    try {
        // Workaround is here for a bug in jscript's eval implementation
        // http://www.bigresource.com/ASP-JScript-eval-bug-6nZST3Bk.html
        (eval("var _n=" + fs.read(prefix + "\\narwhal.js") + ";_n"))({
            system: {
                global: global,
                evalGlobal: evalGlobal,
                engine: "wscript",
                engines: ["wscript", "default"],
                os: "windows", // FIXME: env("OS"),
                print : print,
                prefix : prefix,
                evaluate: function (text, fileName, lineNumber) {
                    return eval("var _n=function(" +
                        "require, exports, module, system, print) {" + 
                        text + "};_n");
                },
                debug: true, // env("NARWHAL_DEBUG"),
                verbose: true // env("NARWHAL_VERBOSE"),
            },
            file: fs
        });
    } catch (e) {
        throw e; // TODO: More descriptive errors
    }
})(this, function () { return eval(arguments[0]); });
