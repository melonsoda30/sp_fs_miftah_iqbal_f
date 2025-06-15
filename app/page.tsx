import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { FolderKanban, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();
  return (
    <div className="min-h-screen bg-muted">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            Multi-User Project Management App
          </h2>
          <p className="text-stone-600 text-lg mb-8">
            Manage your projects efficiently with our simple and intuitive
            dashboard
          </p>

          {/* Main CTA Card */}
          <Card className="max-w-md mx-auto border-stone-200 shadow-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-stone-800 flex items-center justify-center space-x-2">
                <FolderKanban className="w-5 h-5 text-orange-500" />
                <span>Get Started</span>
              </CardTitle>
              <CardDescription>
                Access your dashboard to view and manage all your projects
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col align-center justify-center gap-4">
              {session?.user?.id ? (
                <Link href="/dashboard">
                  <Button
                    // onClick={handleDashboardRedirect}

                    className="`w-full   hover:pointer"
                    size="lg"
                  >
                    Go To Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  {" "}
                  <Link href="/login">
                    <Button
                      // onClick={handleDashboardRedirect}
                      className="`w-full   hover:pointer"
                      size="lg"
                    >
                      Go To Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      // onClick={handleDashboardRedirect}
                      variant="outline"
                      className="`w-full   hover:pointer"
                      size="lg"
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Feature Preview */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="border-stone-200 hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FolderKanban className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg text-stone-800">
                Project Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-600 text-center">
                Organize your projects with intuitive kanban boards and task
                tracking
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-200 hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg text-stone-800">
                Team Collaboration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-600 text-center">
                Work together with your team members and track progress in
                real-time
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-200 hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg text-stone-800">
                Analytics & Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-600 text-center">
                Get insights into your project performance and team productivity
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
