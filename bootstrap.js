/**
 * Bootstrap code for Narwhal on WScript
 * @author Nathan L Smith <nlloyds@gmail.com>
 * @date September 24, 2009
 */

/*global ActiveXObject, WScript */
/*jslint evil:true */

(function (evalGlobal) {
    var // TODO: Get environment
        prefix, // TODO: check in env for this
        fs = {}, // for filesystem methods
        print;


    // TODO: get the prefix from the environment and fall back on c:\narwhal
    //prefix = "C:\\narwhal";
    prefix = "Z:\\My Desktop\\narwhal";

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

        if (this.isFile(path)) {
            file = this.o.getFile(path);
            if (file.size > 0) {
                contents = this.o.openTextFile(path).readAll();
            }
        }
        return contents;
    };

    fs.isFile = function (path) {
        return this.o.fileExists(path);
    };

    // Workaround is here for a bug in jscript's eval implementation
    // http://www.bigresource.com/ASP-JScript-eval-bug-6nZST3Bk.html
    (eval("var _n=" + fs.read(prefix + "\\narwhal.js") + ";_n"))({
        global: this,
        evalGlobal: evalGlobal,
        engine: 'wscript',
        engines: ['wscript', 'default'],
        print : print,
        evaluate: function (text) {
            eval("var _n=function(require, exports, module, system, print) {" +
                text + "};_n()");
        },
        fs: fs,
        prefix : prefix,
        prefixes: [prefix]
    });
})(function () { return eval(arguments[0]); });
