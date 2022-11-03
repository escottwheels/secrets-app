import { Outlet, useSubmit } from "@remix-run/react";
import { ContentLayout } from "~/components/layout/ContentLayout";

export default function Home() {
  const submit = useSubmit();
  return (
    <ContentLayout>
      <button
        onClick={() => submit({}, { method: "post", action: "/logout" })}
        className="absolute top-8 right-8 rounded-xl bg-cobalt-midnight font-semibold text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
      >
        Log Out
      </button>
      <Outlet />
    </ContentLayout>
  );
}
