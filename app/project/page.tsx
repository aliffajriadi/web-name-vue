"use client";

import Image from "next/image";
import { useState } from "react";
import { MenuBar } from "@/components/manual/MenuBar";
import Footer from "@/components/manual/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { projects } from "@/lib/data";

const categories = ["all", "web", "iot & computer vision", "backend"];

const ProjectPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <MenuBar />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold mb-4">my projects</h1>
          <p className="text-muted-foreground text-md max-w-2xl">
          a collection of my works including web apps, backend programs, and more.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="mb-2"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mb-16">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video overflow-hidden">
                <Image
                  loading="lazy"
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">
                      {project.title}
                    </CardTitle>
                    <Badge variant="secondary" className="mb-2">
                      {project.category}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                {project.githubUrl && project.githubUrl !== "close" && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      code
                    </a>
                  </Button>
                )}

                {project.githubUrl === "close" && (
                  <Button variant="outline" size="sm" disabled>
                    <Github className="w-4 h-4 mr-2" />
                    close source
                  </Button>
                )}

                {project.liveUrl && project.liveUrl !== "close" && (
                  <Button size="sm" asChild>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      live demo
                    </a>
                  </Button>
                )}

                {project.liveUrl === "close" && (
                  <Button size="sm" variant="secondary" disabled>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    closed demo
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">coming soon</h3>
            <p className="text-muted-foreground">
              projects for this category are coming soon
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProjectPage;
