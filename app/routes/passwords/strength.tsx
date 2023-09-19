import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { ContentLayout } from "~/components/layout/ContentLayout";
import { loader as parentLoader } from "../passwords"
import { useLoaderData } from "@remix-run/react";
import type { Password } from "@prisma/client";
import type { PasswordSimilarityScore} from "../../business/calculatePasswordStrengths";
import { findPasswordSimilarityScore } from "../../business/calculatePasswordStrengths"

export async function loader(args: LoaderArgs) {
    const { passwords } = await (await parentLoader(args)).json()
    const levenshteinDistances = findPasswordSimilarityScore(passwords);
    const newLevenshteinDistances: PasswordSimilarityScore[] = [];
    const passwordsMatched: string[] = [];
    for (let i = 0; i < levenshteinDistances.length; i++) {
        if (!passwordsMatched.includes(levenshteinDistances[i][0]?.website ?? "")) {
            console.log('adding');
            passwordsMatched.push(levenshteinDistances[i][0]?.website ?? "")
            newLevenshteinDistances.push(levenshteinDistances[i])
        }
    }
    return json({ newLevenshteinDistances, passwords })
}

export default function PasswordsSimilarityStrength() {
    const { newLevenshteinDistances } = useLoaderData() as { newLevenshteinDistances: PasswordSimilarityScore[], passwords: Password[] };
    console.log(newLevenshteinDistances);
    return (
        <ContentLayout>
            <div className="bg-white p-8 rounded-lg flex flex-col items-center justify-center rounded-xl mt-1 ">
                <h2 className="text-2xl text-cobalt-midnight font-extrabold w-full"> {`Found ${newLevenshteinDistances.length} password/s that are similar`}</h2>
                {newLevenshteinDistances.map((pair) => {
                    return (
                        <div key={pair[0]?.website} className="w-full text-stone bg-white p-6 rounded-lg ">
                            <span className="flex justify-between items-center">
                                <h2 className="text-xl">
                                    <span className="flex justify-start items-center">
                                        <span className="font-bold">{pair[0]?.password.trim()}{'\n'}</span>
                                        <span className="ms-1 text-base text-yellow-400 italic">{pair[0]?.website}{'\n'}</span>
                                    </span>
                                    <span className="flex justify-start items-center">
                                        <span className="font-bold">{pair[1]?.password.trim()}{'\n'}</span>
                                        <span className="ms-1 text-base text-yellow-400 italic">{pair[1]?.website}</span>
                                    </span>
                                </h2>
                                {<h2 className="font-bold text-xl text-red-500 ml-6">{`${pair[2]}%`}</h2>}
                            </span>
                            {/* {p.occurences?.map((occur, i) => {
                            return (
                                <div>
                                    <h1 className="text-xl">
                                        {passwords[occur - 1].password.substring(0, p.startIndices[i])}
                                        <span className="text-yellow-400">{passwords[occur - 1].password.substring(p.startIndices[i], p.startIndices[i] + p.sub.length)}</span>
                                        <span>{passwords[occur - 1].password.substring(p.startIndices[i] + p.sub.length)}</span>
                                    </h1>
                                    {"\t"}
                                    <h1 className="text-sm ml-2 italic">{`${passwords[occur - 1].website}`}</h1>
                                </div>
                            )
                        })} */}
                        </div >
                    )
                })}
                {newLevenshteinDistances.length == 0 &&
                    <div className="w-full text-stone bg-white p-8 rounded-lg mt-2">
                        <h1 className="text-xl">
                            <span className="text-2xl">No similarities detected</span>
                            <span className="ml-4 font-bold text-green-500">Good job!</span>
                        </h1>
                    </div>
                }
                {/* {dangerSubstrings.map(p => <>
                    <div key={p.sub} className="w-full text-stone bg-white p-8 rounded-lg mt-2">
                        <span className="flex justify-between items-center">
                            <h2 className="text-2xl">{`Found ${p.numOccurences} instances of `}<span className="font-bold">{` ${p.sub} `}</span></h2>
                            {p.isWord && <h2 className="font-bold text-md text-red-500 ml-6">Word</h2>}
                        </span>
                        {p.occurences?.map((occur, i) => {
                            return (
                                <div>
                                    <h1 className="text-xl">
                                        {passwords[occur - 1].password.substring(0, p.startIndices[i])}
                                        <span className="text-yellow-400">{passwords[occur - 1].password.substring(p.startIndices[i], p.startIndices[i] + p.sub.length)}</span>
                                        <span>{passwords[occur - 1].password.substring(p.startIndices[i] + p.sub.length)}</span>
                                    </h1>
                                    {"\t"}
                                    <h1 className="text-sm ml-2 italic">{`${passwords[occur - 1].website}`}</h1>
                                </div>
                            )
                        })}
                    </div >

                </>)} */}
            </div>
        </ContentLayout >
    )
}