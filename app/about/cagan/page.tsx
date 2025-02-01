"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { founders } from "../page";

const AboutPage = () => {
  const founder = founders[1];
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      {/* Main container */}
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-6">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold">{founder.name}</h1>
                  <p className="text-muted-foreground">Economist</p>
                  <div className="flex gap-4">
                    <Link
                      href="https://github.com/yigitoo"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      GitHub
                    </Link>
                    <Link
                      href="https://www.linkedin.com/in/-yigitgumus/"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      LinkedIn
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6">About Me</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Hello! I'm a passionate software developer focused on creating elegant solutions
                    to complex problems. With expertise in modern web technologies, I strive to build
                    applications that make a difference.
                  </p>
                  <p>
                    My journey in software development began with a curiosity for how things work,
                    which evolved into a career building robust and scalable applications.
                  </p>
                  <p>
                    When I'm not coding, you can find me exploring new technologies, contributing
                    to open-source projects, or sharing knowledge with the developer community.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Technical Skills */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Technical Skills</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>React & Next.js</li>
                <li>TypeScript</li>
                <li>Node.js</li>
                <li>Database Design</li>
              </ul>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Experience</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Full Stack Development</li>
                <li>Cloud Architecture</li>
                <li>API Design</li>
                <li>Team Leadership</li>
              </ul>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Interests</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Open Source</li>
                <li>AI & Machine Learning</li>
                <li>Web3 Technologies</li>
                <li>System Design</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;

