import { MessageCircleWarningIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export function ErrorAlert({ error }: { error: Error }) {
  return (
    <Alert>
      <MessageCircleWarningIcon className="h-4 w-4" />
      <AlertTitle>Unknown Error</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )
}
