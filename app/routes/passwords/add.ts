import type { LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";

export function loader(args: LoaderArgs) {

    return redirect("..")


}


// export default function Add() {
//     return null;
// }