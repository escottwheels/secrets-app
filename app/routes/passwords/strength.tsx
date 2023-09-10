import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { ContentLayout } from "~/components/layout/ContentLayout";
import { loader as parentLoader } from "../passwords"
import { useLoaderData } from "@remix-run/react";
import type { Password } from "@prisma/client";
import type { DangerSubstring } from "../../business/findPasswordStrength";
import { findPasswordSimilarity } from "../../business/findPasswordStrength"

export async function loader(args: LoaderArgs) {
    const { passwords } = await (await parentLoader(args)).json()
    const dangerSubstrings = findPasswordSimilarity(passwords);
    return json({ dangerSubstrings, passwords })
}

export default function PasswordsSimilarityStrength() {
    const { passwords, dangerSubstrings } = useLoaderData() as { passwords: Password[], dangerSubstrings: DangerSubstring[] };
    return (
        <ContentLayout>
            <div className="flex flex-col items-center justify-center rounded-xl ">
                {dangerSubstrings.length == 0 &&
                    <div className="w-full text-stone bg-white p-8 rounded-lg mt-2">
                        <h1 className="text-xl">
                            <span className="text-2xl">No similarities detected</span>
                            <span className="ml-4 font-bold text-green-500">Good job!</span>
                        </h1>
                    </div>
                }
                {dangerSubstrings.map(p => <>
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

                </>)}
            </div>
        </ContentLayout >
    )
}