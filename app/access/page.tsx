import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Unit Task Management Access",
};

export default function AccessPage() {
  return (
    <div className="flex min-h-screen justify-center bg-sand-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-combat-600">
          Unit Daily Management
        </p>
        <h1 className="mt-1 text-center text-xl font-bold uppercase tracking-wide text-combat-800">
          Task Dashboard Access
        </h1>

        <div className="mt-6 rounded border border-sand-200 bg-white p-6">
          <div className="flex justify-center rounded border border-sand-200 bg-white p-4">
            <Image
              src="/qr-access.png"
              alt="QR code that opens the Unit Task Management site"
              width={260}
              height={260}
              className="h-auto w-full max-w-[260px]"
            />
          </div>
          <p className="mt-3 text-center text-sm text-sand-500">Point your phone camera at this code</p>

          <div className="mt-4 text-center">
            <span className="inline-block rounded bg-sand-100 px-3 py-2 font-mono text-sm text-combat-800">
              naimurtaskmgt.duckdns.org
            </span>
          </div>

          <hr className="my-6 border-sand-200" />

          <p className="text-xs font-semibold uppercase tracking-widest text-combat-600">Android app</p>
          <p className="mt-2 text-sm text-sand-600">
            Prefer a real installable app instead of a browser tab? Download it directly — no Play Store needed.
          </p>
          <a
            href="/unit-tasks.apk"
            download
            className="mt-3 block rounded-md bg-combat-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-combat-700"
          >
            Download Android App (.apk)
          </a>
          <p className="mt-2 text-xs text-sand-500">
            Android will ask to confirm installing from this source the first time — tap <b>Install anyway</b> /{" "}
            <b>Allow</b>. This is normal for apps not from the Play Store and is safe for this file.
          </p>

          <hr className="my-6 border-sand-200" />

          <p className="text-xs font-semibold uppercase tracking-widest text-combat-600">First-time setup</p>
          <ol className="mt-3 space-y-3">
            <li className="flex items-start gap-3 text-sm text-sand-900">
              <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-combat-100 font-mono text-xs font-semibold text-combat-800">
                1
              </span>
              Scan the code, or type the address above into any browser.
            </li>
            <li className="flex items-start gap-3 text-sm text-sand-900">
              <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-combat-100 font-mono text-xs font-semibold text-combat-800">
                2
              </span>
              Sign in with your <b className="font-semibold">role</b> (Admin, Clerk, or Viewer) and its password.
            </li>
            <li className="flex items-start gap-3 text-sm text-sand-900">
              <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-combat-100 font-mono text-xs font-semibold text-combat-800">
                3
              </span>
              Add it to your home screen so it opens like a normal app next time — no address to remember.
            </li>
          </ol>

          <p className="mt-6 border-t border-sand-200 pt-4 text-center text-xs text-sand-500">
            Save this page or print it and keep it at the unit office for anyone who needs access.
          </p>
        </div>
      </div>
    </div>
  );
}
