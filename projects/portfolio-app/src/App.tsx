import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Globe, Laptop } from "lucide-react"

function App() {
  const projects = [
    {
      title: "Portfolio Website",
      description: "A responsive portfolio website built with React and Tailwind CSS",
      icon: Globe
    },
    {
      title: "Task Management App",
      description: "A full-stack task management application with real-time updates",
      icon: Laptop
    },
    {
      title: "Code Analyzer",
      description: "A tool for analyzing and improving code quality in JavaScript projects",
      icon: Code
    }
  ]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">My Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <project.icon className="w-6 h-6 text-zinc-500" />
                  <CardTitle>{project.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{project.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
