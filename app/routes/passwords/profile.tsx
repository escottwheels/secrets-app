import { CheckIcon } from "@heroicons/react/outline";
import type { User } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import invariant from "tiny-invariant";
import { authenticator } from "~/utils/authenticate";
import { prisma } from "~/utils/prisma.server";

export async function loader(args: LoaderArgs) {
    const user = await authenticator.isAuthenticated(args.request, {
        failureRedirect: "/",
    }) as User;
    return json({ user })
}


export async function action(args: ActionArgs) {
    const body = await args.request.formData();
    const userData = await loader(args);
    const { user } = await userData.json()
    invariant(user.id != null, "Need a user id")
    let firstName = body.get("first");
    let lastName = body.get("last");

    let data = user
    if (firstName != null) {
        firstName = firstName as string;
        invariant(!/\d/.test(firstName), "Names must not have numbers")
        data.firstName = firstName;
    }
    if (lastName != null) {
        lastName = lastName as string;
        invariant(!/\d/.test(lastName), "Names must not have numbers")
        data.lastName = lastName;
    }
    await prisma.user.update({
        where: { id: user.id },
        data: data
    })

    return redirect("..");
}

export default function ProfileScreen() {
    const submitter = useSubmit();
    const { user } = useLoaderData();
    return (
        <>
            <button
                onClick={() => submitter({}, {
                    method: "post",
                    action: "/?index"
                })}
                className="z-10 absolute top-4 right-16 transform-gpu transition-all mr-1 rounded-xl bg-cobalt-midnight border border-white font-semibold text-white px-3 py-2 duration-300 ease-out hover:-translate-y-1 hover:bg-yellow-400 hover:border-cobalt-midnight"
            >
                {`Log out ${user.firstName ?? ""}`}
            </button >
            <Form method="post">
                <span className={"z-20 absolute overflow-hidden transform-gpu transition-all duration-300 ease-in-out border-l-4 h-screen border-white top-0 right-64"} />
                <div className="bg-cobalt-midnight flex flex-col justify-around z-0 absolute w-64 h-screen top-0 right-0 px-3 py-2">
                    <div>
                        <h2 className="text-whites text-2xl  font-semibold">Name</h2>
                        <hr className="mt-1 mb-4 font-semibold" />
                        <input name="first" id="first" autoFocus placeholder={"Enter your first name"} defaultValue={user.firstName}
                            className="focus:outline-none text-stone w-full p-1 border rounded-xl" />
                        <div className="mt-4 flex justify-center">
                            <input name="last" id="last" placeholder={"Enter your last name"} defaultValue={user.lastName}
                                className="w-full text-stone focus:outline-none p-1 border rounded-xl" />
                            <button type="submit"><CheckIcon className="cursor-pointer border border-white hover:border-cobalt-midnight bg-cobalt-midnight rounded-xl hover:bg-yellow-400 hover:-translate-y-1  duration-300 ease-in-out p-1 ml-2 text-white h-8 inline" /></button>
                        </div>
                        <hr className="mt-4 mb-4 font-bold" />
                    </div>
                </div>
            </Form>
        </>
    )

}