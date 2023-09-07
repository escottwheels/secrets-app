import type { Password } from "@prisma/client";
import { SuffixTreeOld } from "../utils/suffixtree-old"
var checkewdWord = require('check-if-word')
export type DangerSubstring = {
    sub: string;
    occurences?: number[],
    startIndices: number[],
    numOccurences: number;
    capsMatter?: boolean;
    isWord?: boolean;

}

export function findPasswordSimilarity(passwords: Password[]) {

    const randomUnicodeCharBank: string = "⪴✑␧⒕⽒‗⢈⧩ⷐ␀ⷋ⟡↏₁⇭⎇ⶪ⦷⬰♖⺌ⅲ⊞⍚◹⑕⻨⽝⨨╥✊⏴⁚Ⱔ⺰├◯⒠⇣⤟⹃⸻⹥⚈⑜⳺⯑⨀₸Ⓡ⥢Ⲳ⒢⽙⧇⡜Ⳁ✒⾝⣴⤀⋕✃⩑⚢⍄ⵂ✣⮖♼⡱⏇⟨ⰱ↬⣯ⷡ◤⢉⭕⸀⓻⸳≛⚿ⳅ⡀╍┱⧪⚯➘⬞✿⼊⍐╂↹⫭⾭";

    const wordsDict = checkewdWord('en')
    let passwordRatingDict: DangerSubstring[] = []

    // go through height of 1 and check for duplicate words
    const suffixTree = new SuffixTreeOld();
    for (let i = 0; i < passwords.length; ++i) {
        suffixTree.addString(passwords[i].password + randomUnicodeCharBank[i]);
    }

    const jsonTree = suffixTree.convertToJson();
    for (let node of jsonTree.children) {
        if (node.children.length >= 1 && node.name.length > 2) {
            passwordRatingDict.push({ sub: node.name, occurences: node.children.map((c: { seq: any; }) => c.seq), startIndices: node.children.map((c: { start: any; }) => parseInt(c.start)), numOccurences: node.children.length, isWord: wordsDict.check(node.name) })
        }
    }

    return passwordRatingDict;
}
