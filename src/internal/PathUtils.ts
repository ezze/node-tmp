
import StringUtils from './StringUtils';

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export default class PathUtils {

    public static isRelative(name: string, root: string): boolean {
        return name.startsWith(root);
    }

    public static containsPathSeparator(name: string): boolean {
        return name.indexOf(path.sep) !== -1;
    }

    public static exists(name: string): boolean {
        return fs.existsSync(name);
    }

    // remove multiple occurrences of forward or backward slash, single/double quotes and handle excessive
    // use of whitespace

    // TODO:maybe split this into a sanitize and normalize, the former being used by Configuration and the latter during name generation, eliminating possible duplicate path.sep
    public static normalize(name: string): string {
        if (StringUtils.isBlank(name)) {
            return '';
        }

        const result = [];
        const components = name.replace(/[/]+/g, '/')
            .replace(/[\\]+/g, '\\')
            .replace(/["]/g, '')
            .replace(/[']/g, '')
            .split(path.sep);

        // FIXME: absolute path under cpmderivative C:\Windows\Temp\custom-dir
        // make sure that we have a leading path separator
        if (components.length > 1) {
            result.push('');
        }
        // eliminate all whitespace only components and trim whitespace around components
        for (const component of components) {
            const trimmed = component.trim();
            if (trimmed) {
                result.push(trimmed);
            }
        }

        return result.join(path.sep);
    }

    public static get osTmpDir(): string {
        return os.tmpdir();
    }

    public static get normalizedOsTmpDir(): string {
        return this.normalize(this.osTmpDir);
    }

    public static resolvePath(name: string, root: string): string {
        return path.resolve(root, name);
    }

    public static makeRelative(name: string, root: string): string {
        let result = '';
        if (this.isRelative(name, root)) {
            let result = name.substr(root.length);
            if (result.startsWith(path.sep)) {
                result = result.substr(path.sep.length);
            }
        }
        return result;
    }
}
