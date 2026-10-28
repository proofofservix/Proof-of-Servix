import { getSession } from "../../lib/session"
import { redirect } from "next/navigation"
import Form from "./form"

export const instant = false

export default async function NewTransactionPage() {
  const session = await getSession()
  if (!session?.userId) redirect("/login")

  return <Form senderId={session.userId} />
}