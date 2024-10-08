"use client";
import { useSession, signIn, signOut } from "next-auth/react"

function page() {
    const { data: session } = useSession();
    if (session) {
      return (
        <>
          Signed in as {session.user.email} <br />
          <button className="bg-red-500 px-2 py-1.5" onClick={() => signOut()}>Sign out</button>
        </>
      )
    }
    return (
      <>
        Not signed in <br />
        <button className="bg-sky-500 px-2 py-1.5" onClick={() => signIn()}>Sign in</button>
      </>
   )
}

export default page
