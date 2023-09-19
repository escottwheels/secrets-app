class Node {

    sub = ''; // a substring of the input string
    children: number[] = []; // list of child nodes
    passwordIndex?: number;
}

export class SuffixTree {
    randomUnicodeCharBank: string = "Ω❶⪄⇰≓␂ⵣ⧀⽾◴ℵ⛆⡹‧"
    nodes: Node[] = [];


    constructor(strArr: string[]) {

        const concatendedStr = strArr.map((str, i) => str + this.randomUnicodeCharBank[i]).join("")
        this.nodes.push(new Node());
        for (let i = 0; i < concatendedStr.length; ++i) {
            this.addSuffix(concatendedStr.slice(i));
        }
    }

    addSuffix(suffix: string): number | undefined {
        let n = 0;
        let i = 0;
        let advanceLength = 0;

        while (i < suffix.length) {
            const currChar = suffix.charAt(i);
            const children = this.nodes[n].children;
            let childIndex = 0;
            let newNodeIndex: number;
            while (true) {
                if (childIndex === children.length) {
                    // no matching child, remainder of suf becomes new node.
                    newNodeIndex = this.nodes.length;
                    const temp = new Node();
                    temp.sub = suffix.slice(i);
                    this.nodes.push(temp);
                    children.push(newNodeIndex);
                    return advanceLength;
                }
                newNodeIndex = children[childIndex];
                if (this.nodes[newNodeIndex].sub.charAt(0) === currChar) break;
                childIndex++;
            }
            // find prefix of remaining suffix in common with child
            const sub = this.nodes[newNodeIndex].sub;
            let substringIndex = 0
            while (substringIndex < sub.length) {
                // console.log('suffix: ' + suffix + " " + i);
                if (suffix.charAt(i + substringIndex) !== sub.charAt(substringIndex)) {
                    // split n2
                    const n3 = newNodeIndex;
                    // new node for the part in common
                    newNodeIndex = this.nodes.length;
                    const temp = new Node();
                    temp.sub = sub.slice(0, substringIndex);
                    temp.children.push(n3);
                    this.nodes.push(temp);
                    this.nodes[n3].sub = sub.slice(substringIndex);  // old node loses the part in common
                    this.nodes[n].children[childIndex] = newNodeIndex;
                    advanceLength = temp.sub.length
                    break;  // continue down the tree
                }
                substringIndex++;
            }
            i += substringIndex;  // advance past part in common
            n = newNodeIndex;  // continue down the tree
        }
        return advanceLength
    }

    toString() {
        if (this.nodes.length === 0) {
            return '<empty>';
        }
        return this.toString_f(0, '');
    }

    toString_f(n: number, prefix: string) {
        const children = this.nodes[n].children;
        if (children.length === 0) {
            return '- ' + this.nodes[n].sub + '\n';
        }
        let s = '┐ ' + this.nodes[n].sub + '\n';
        for (let i = 0; i < children.length - 1; i++) {
            const c = children[i];
            s += prefix + '├─';
            s += this.toString_f(c, prefix + '│ ');
        }
        s += prefix + '└─';
        s += this.toString_f(children[children.length - 1], prefix + '  ');
        return s;
    }
}

