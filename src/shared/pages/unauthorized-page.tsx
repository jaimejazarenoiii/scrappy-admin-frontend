import { Link } from 'react-router-dom'
import { LogoutButton } from '@/features/auth/components/logout-button'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-md text-center">
        <CardHeader>
          <CardTitle>Admin Console access required</CardTitle>
          <CardDescription className="text-base">
            You are signed in, but only Active Super Administrators can access the Admin Console in
            this release.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <LogoutButton variant="outline" />
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Switch account
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
