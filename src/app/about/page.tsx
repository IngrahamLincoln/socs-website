import Header from '@/components/Header'
import { Target, Users, BookOpen, Lightbulb } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Computational Thinking
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn about the four core concepts of computational thinking and how they can transform 
              K-5 education across all subject areas.
            </p>
          </div>

          {/* What is CT Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What is Computational Thinking?</h2>
            <p className="text-lg text-gray-600 mb-6">
              Computational thinking is a problem-solving process that includes four key concepts: 
              decomposition, pattern recognition, abstraction, and algorithms. These concepts help 
              students break down complex problems, recognize patterns, focus on important details, 
              and create step-by-step solutions.
            </p>
            <p className="text-lg text-gray-600">
              Rather than being limited to computer science, computational thinking can be integrated 
              into any subject area, helping students develop critical thinking skills that apply 
              across disciplines.
            </p>
          </section>

          {/* Four Concepts */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">The Four Core Concepts</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Decomposition</h3>
                <p className="text-gray-600">
                  Breaking down complex problems or systems into smaller, more manageable parts. 
                  This helps students tackle overwhelming tasks by focusing on one piece at a time.
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Pattern Recognition</h3>
                <p className="text-gray-600">
                  Identifying similarities, differences, and patterns in data or problems. 
                  This helps students make connections and predict outcomes based on previous experiences.
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Abstraction</h3>
                <p className="text-gray-600">
                  Focusing on the most important details while ignoring irrelevant information. 
                  This helps students simplify complex concepts and focus on what matters most.
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Algorithms</h3>
                <p className="text-gray-600">
                  Creating step-by-step instructions or procedures to solve problems. 
                  This helps students develop logical thinking and create reproducible solutions.
                </p>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits for K-5 Students</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Academic Benefits</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Improved problem-solving skills</li>
                  <li>• Enhanced logical thinking</li>
                  <li>• Better understanding of cause and effect</li>
                  <li>• Increased ability to break down complex tasks</li>
                  <li>• Stronger pattern recognition skills</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Life Skills</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Critical thinking development</li>
                  <li>• Improved organization and planning</li>
                  <li>• Enhanced creativity and innovation</li>
                  <li>• Better collaboration and communication</li>
                  <li>• Increased confidence in problem-solving</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Integration Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Cross-Curricular Integration</h2>
            <p className="text-lg text-gray-600 mb-6">
              Computational thinking isn&apos;t just for computer science. Our lesson plans demonstrate 
              how these concepts can be integrated into:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">English Language Arts</h4>
                <p className="text-sm text-gray-600">Story structure, writing processes, and text analysis</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Mathematics</h4>
                <p className="text-sm text-gray-600">Problem-solving strategies, number patterns, and logical reasoning</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Science</h4>
                <p className="text-sm text-gray-600">Scientific method, data analysis, and system thinking</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Social Studies</h4>
                <p className="text-sm text-gray-600">Historical analysis, cause and effect, and cultural patterns</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Social-Emotional Learning</h4>
                <p className="text-sm text-gray-600">Emotional regulation, relationship building, and conflict resolution</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Arts & PE</h4>
                <p className="text-sm text-gray-600">Creative processes, movement patterns, and artistic analysis</p>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section className="bg-primary-50 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-6">
              Explore our collection of lesson plans and start integrating computational thinking 
              into your classroom today.
            </p>
            <a
              href="/search"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Lesson Plans
            </a>
          </section>
        </div>
      </div>
    </div>
  )
}