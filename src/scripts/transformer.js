"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const find_lua_requires_1 = require("typescript-to-lua/dist/transpilation/find-lua-requires");
function getModName() {
    // Путь к файлу конфигурации
    const configPath = './src_package/package.json';
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configContent);
    // Возвращение значения modName из конфига
    return config["id"] || "test_mod";
}

const plugin = {
    beforeEmit: function (program, options, emitHost, result) {
        const modName = getModName();
        for (let _i = 0, result_1 = result; _i < result_1.length; _i++) {
            const file = result_1[_i];
            const requires = (0, find_lua_requires_1.findLuaRequires)(file.code);
            for (let i = requires.length - 1; i >= 0; i--) {
                const newRequireString = "load_script(\"".concat(modName, ":").concat(requires[i].requirePath.replace(/\./g, '/'), ".lua\", false)");
                // file.code = file.code.slice(0, requires[i].from) + "load_script" + file.code.slice(requires[i].from + "require".length);
                file.code = file.code.slice(0, requires[i].from) + newRequireString + file.code.slice(requires[i].to + 1);
            }
        }
    },
};
exports.default = plugin;
