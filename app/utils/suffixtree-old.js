// Credits to maclandrol at https://github.com/maclandrol/SuffixTreeJS for this code
// This implementation is adapted from the one here the snippets provided here
// http://www.allisons.org/ll/AlgDS/Tree/Suffix/

'use strict';

function Node() {
    this.transition = {};
    this.suffixLink = null;
}

Node.prototype.addTransition = function (node, start, end, t) {
    this.transition[t] = [node, start, end];
}

Node.prototype.isLeaf = function () {
    return Object.keys(this.transition).length === 0;
}



export class SuffixTreeOld {
    constructor() {
        this.text = '';
        this.str_list = [];
        this.seps = [];
        this.root = new Node();
        this.bottom = new Node();
        this.root.suffixLink = this.bottom;
        this.s = this.root;
        this.k = 0;
        this.i = -1;
    }
}



SuffixTreeOld.prototype.addString = function (str) {
    var temp = this.text.length;
    this.text += str;
    this.seps.push(str[str.length - 1])
    this.str_list.push(str);
    var s, k, i;
    s = this.s;
    k = this.k;
    i = this.i;

    for (var j = temp; j < this.text.length; j++) {
        this.bottom.addTransition(this.root, j, j, this.text[j]);
    }

    while (this.text[i + 1]) {
        i++;
        var up = this.update(s, k, i);
        up = this.canonize(up[0], up[1], i);
        s = up[0];
        k = up[1];
    }

    this.s = s;
    this.k = k;
    this.i = i;
    return this;
}


SuffixTreeOld.prototype.update = function (start, k, i) {

    var oldRoot = this.root;
    var endAndr = this.testAndSplit(start, k, i - 1, this.text[i]);
    var endPoint = endAndr[0];
    var r = endAndr[1]

    while (!endPoint) {
        r.addTransition(new Node(), i, Infinity, this.text[i]);

        if (oldRoot != this.root) {
            oldRoot.suffixLink = r;
        }

        oldRoot = r;
        var sAndk = this.canonize(start.suffixLink, k, i - 1);
        start = sAndk[0];
        k = sAndk[1];
        endAndr = this.testAndSplit(start, k, i - 1, this.text[i]);
        endPoint = endAndr[0]; r = endAndr[1]
    }

    if (oldRoot != this.root) {
        oldRoot.suffixLink = start;
    }

    return [start, k];
}


SuffixTreeOld.prototype.testAndSplit = function (s, k, p, t) {
    if (k <= p) {
        var traNs = s.transition[this.text[k]];
        var s2 = traNs[0], k2 = traNs[1], p2 = traNs[2];
        if (t == this.text[k2 + p - k + 1]) {
            return [true, s];
        } else {
            var r = new Node();
            s.addTransition(r, k2, k2 + p - k, this.text[k2]);
            r.addTransition(s2, k2 + p - k + 1, p2, this.text[k2 + p - k + 1]);
            return [false, r];
        }
    } else {
        if (!s.transition[t])
            return [false, s];
        else
            return [true, s];
    }
}


SuffixTreeOld.prototype.canonize = function (s, k, p) {
    if (p < k)
        return [s, k];
    else {
        var traNs = s.transition[this.text[k]];
        var s2 = traNs[0], k2 = traNs[1], p2 = traNs[2];

        while (p2 - k2 <= p - k) {
            k = k + p2 - k2 + 1;
            s = s2;

            if (k <= p) {
                traNs = s.transition[this.text[k]];
                s2 = traNs[0]; k2 = traNs[1]; p2 = traNs[2];
            }
        }

        return [s, k];
    }
}


SuffixTreeOld.prototype.convertToJson = function () {
    // convert tree to json to use with d3js

    var text = this.text;
    var ret = {
        "name": "",
        "parent": "null",
        "suffix": "",
        "children": []
    }

    function traverse(node, seps, str_list, ret) {
        for (var t in node.transition) {
            var traNs = node.transition[t];
            var s = traNs[0], a = traNs[1], b = traNs[2];
            var name = text.substring(a, b + 1);
            var position = seps.length - 1;
            for (var pos = name.length - 1; pos > -1; pos--) {
                var insep = seps.indexOf(name[pos]);
                position = insep > -1 ? insep : position;
            }

            var names = name.split(seps[position]);
            if (names.length > 1) {
                name = names[0] + seps[position];
            }
            var suffix = ret["suffix"] + name;
            var cchild = {
                "name": name,
                "parent": ret['name'],
                "suffix": suffix,
                "children": [],
            };
            if (s.isLeaf()) {
                cchild['start'] = "" + (str_list[position].length - suffix.length);
                cchild['seq'] = position + 1;
            }
            cchild['seq'] = position
            cchild = traverse(s, seps, str_list, cchild);
            ret["children"].push(cchild)
        }

        return ret;

    }
    return traverse(this.root, this.seps, this.str_list, ret);

}

SuffixTreeOld.prototype.toString = function () {
    var text = this.text;

    function traverse(node, offset, ret) {
        offset = typeof offset !== 'undefined' ? offset : '';
        ret = typeof ret !== 'undefined' ? ret : '';
        for (var t in node.transition) {
            var traNs = node.transition[t];
            var s = traNs[0], a = traNs[1], b = traNs[2];
            // console.log(s);
            ret += offset + '["' + text.substring(a, b + 1) + '", ' + a + ', ' + b + ']' + '\r\n';
            ret += traverse(s, offset + '\t');
        }
        return "";
    }
    var res = traverse(this.root)
    return "";
}

SuffixTreeOld.prototype.print = function () {
    console.log(this.toString());
}