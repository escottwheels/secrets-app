import type { Password } from "@prisma/client";
import { SuffixTree } from "../utils/suffixtree"
var checkewdWord = require('check-if-word')
var levenshtein = require("js-levenshtein")

export type PasswordSimilarityScore = [{ website: string, password: string }?, { website: string, password: string }?, number?] // [[website1, password1],[website2, password2], score]

export type DangerSubstring = {
    sub: string;
    occurences?: number[],
    startIndices: number[],
    numOccurences: number;
    capsMatter?: boolean;
    isWord?: boolean;
}

export function findPasswordSimilarityScore(passwords: Password[]) {
    const newDistances = findRepeatingSubstrings(passwords, .6)

    return newDistances.sort((a, b) => (a[2] ?? 0) < (b[2] ?? 0) ? 1 : -1);
}

export function generateSuffixTree(passwords: Password[]) {
    const randomUnicodeCharBank: string = "⪴✑␧⒕⽒‗⢈⧩ⷐ␀ⷋ⟡↏₁⇭⎇ⶪ⦷⬰♖⺌ⅲ⊞⍚◹⑕⻨⽝⨨╥✊⏴⁚Ⱔ⺰├◯⒠⇣⤟⹃⸻⹥⚈⑜⳺⯑⨀₸Ⓡ⥢Ⲳ⒢⽙⧇⡜Ⳁ✒⾝⣴⤀⋕✃⩑⚢⍄ⵂ✣⮖♼⡱⏇⟨ⰱ↬⣯ⷡ◤⢉⭕⸀⓻⸳≛⚿ⳅ⡀╍┱⧪⚯➘⬞✿⼊⍐╂↹⫭⾭";
    const wordsDict = checkewdWord('en')
    let passwordRatingDict: DangerSubstring[] = []

    const suffixTree = new SuffixTree();
    for (let i = 0; i < passwords.length; ++i) {
        suffixTree.addString(passwords[i].password + randomUnicodeCharBank[i]);
    }
    const jsonTree = suffixTree.convertToJson();
    for (let node of jsonTree.children) {
        if (node.children.length >= 1 && node.name.length > 2) {
            passwordRatingDict.push({ sub: node.name, occurences: node.children.map((c: { seq: any; }) => c.seq), startIndices: node.children.map((c: { start: any; }) => parseInt(c.start)), numOccurences: node.children.length, isWord: wordsDict.check(node.name) })
        }
    }
}

function findRepeatingSubstrings(passwordList: Password[], threshold: number) {
    // const passwordsMatched: number[] = []
    const repeatingStrings: PasswordSimilarityScore[] = [];
    const n = passwordList.length;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            let dist = levenshtein(passwordList[i].password, passwordList[j].password)
            let score = 1 - (dist / Math.max(passwordList[i].password.length, passwordList[j].password.length))
            if (score >= threshold) {
                repeatingStrings.push([{ website: passwordList[i].website, password: passwordList[i].password }, { website: passwordList[j].website, password: passwordList[j].password }, score * 100])
                // passwordsMatched.push(passwordList[i].id)
            }
        }

    }
    return repeatingStrings
}
