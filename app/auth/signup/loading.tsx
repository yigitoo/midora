import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SignUpLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Skeleton className="h-4 w-24" />
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            <Skeleton className="h-10 w-full" />

            <div className="text-center">
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Skeleton className="h-3 w-64 mx-auto" />
        </div>
      </div>
    </div>
  )
}
