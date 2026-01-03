export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  author: string;
  authorBio: string;
  image: string;
  readTime: number;
  featured?: boolean;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "react-18-latest-features",
    title: "React 18: A Deep Dive into the Latest Features",
    excerpt:
      "Explore the groundbreaking features introduced in React 18, including concurrent rendering, automatic batching, and transitions.",
    content: `React 18 brings a paradigm shift in how we build performant user interfaces. With concurrent rendering as its foundation, applications can now handle multiple tasks simultaneously without blocking the UI thread.

## Concurrent Rendering

The most significant addition to React 18 is concurrent rendering. This allows React to interrupt long-running renders, prioritize urgent updates, and maintain a responsive user experience.

### How It Works

When rendering large component trees, React can now pause the render process and return to the browser to handle high-priority updates like user input or animations.

\`\`\`javascript
// Example of using startTransition
import { startTransition } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  
  const handleChange = (e) => {
    const value = e.target.value;
    startTransition(() => {
      setQuery(value);
    });
  };
  
  return <input onChange={handleChange} />;
}
\`\`\`

## Automatic Batching

React 18 automatically batches state updates from event handlers, promises, and timers, reducing unnecessary re-renders.

## Transitions API

The new Transitions API helps you mark non-urgent updates, allowing React to prioritize urgent UI updates.

## Suspense Improvements

Suspense now supports selective hydration on the server, enabling more efficient streaming of Server Components.

React 18 is a significant step forward in building scalable, performant applications.`,
    date: "2024-01-15",
    category: "Web Dev",
    author: "Sarah Chen",
    authorBio: "React developer with 8+ years of experience building scalable applications.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800&h=400&fit=crop",
    readTime: 8,
    featured: true,
    tags: ["React", "JavaScript", "Frontend"],
  },
  {
    slug: "ai-transforming-software-development",
    title: "How AI is Transforming Software Development",
    excerpt:
      "From code generation to testing, artificial intelligence is reshaping how developers build software. Here's what you need to know.",
    content: `Artificial Intelligence has moved from theoretical concept to practical tool in software development. Let's explore how AI is transforming different aspects of our work.

## Code Generation

AI-powered tools like GitHub Copilot can generate code suggestions, helping developers write code faster and with fewer errors.

\`\`\`python
# Example of AI-assisted code
def fibonacci(n):
    """Generate Fibonacci sequence up to n terms"""
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
\`\`\`

## Automated Testing

AI can analyze code patterns and generate comprehensive test cases, improving code coverage and reliability.

## Bug Detection

Machine learning models can predict potential bugs by analyzing code patterns and historical data.

## Performance Optimization

AI tools can identify performance bottlenecks and suggest optimizations based on profiling data.

The future of software development will be augmented by AI, allowing developers to focus on higher-level architecture and innovation.`,
    date: "2024-01-10",
    category: "AI & ML",
    author: "Alex Rivera",
    authorBio: "Machine learning engineer passionate about AI applications in software development.",
    image: "https://images.unsplash.com/photo-1677442d019cecf74e8fa18836da7af4e438f67d139ace500e0ecc5004de7ce?w=800&h=400&fit=crop",
    readTime: 10,
    tags: ["AI", "Development", "Future"],
  },
  {
    slug: "kubernetes-production-deployment",
    title: "Kubernetes in Production: Best Practices and Pitfalls",
    excerpt:
      "Learn essential strategies for deploying and managing containerized applications at scale using Kubernetes.",
    content: `Kubernetes has become the industry standard for container orchestration. Here's how to use it effectively in production.

## Cluster Architecture

A well-designed Kubernetes cluster separates concerns into control plane and worker nodes.

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  containers:
  - name: app
    image: my-app:1.0
    resources:
      requests:
        memory: "256Mi"
        cpu: "100m"
\`\`\`

## Resource Management

Proper resource requests and limits ensure fair allocation across your cluster and prevent resource exhaustion.

## Security Considerations

- Use RBAC for access control
- Implement network policies
- Scan container images for vulnerabilities
- Use secrets for sensitive data

## Monitoring and Logging

Implement comprehensive monitoring with tools like Prometheus and logging with ELK stack.

Kubernetes in production requires careful planning, but the benefits in scalability and reliability are substantial.`,
    date: "2024-01-05",
    category: "Cloud",
    author: "David Kowalski",
    authorBio: "DevOps engineer with expertise in cloud infrastructure and Kubernetes deployment.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop",
    readTime: 12,
    featured: true,
    tags: ["Kubernetes", "DevOps", "Cloud"],
  },
  {
    slug: "web-security-vulnerabilities",
    title: "Common Web Security Vulnerabilities and How to Fix Them",
    excerpt:
      "Understanding OWASP Top 10 vulnerabilities and implementing fixes to protect your web applications.",
    content: `Web security is paramount in today's threat landscape. Let's examine common vulnerabilities and their solutions.

## SQL Injection

SQL injection remains a critical threat. Always use parameterized queries.

\`\`\`javascript
// Bad: vulnerable to SQL injection
const query = "SELECT * FROM users WHERE id = " + userId;

// Good: use parameterized queries
const query = "SELECT * FROM users WHERE id = ?";
db.query(query, [userId]);
\`\`\`

## Cross-Site Scripting (XSS)

Prevent XSS by properly escaping user input and using Content Security Policy headers.

## Cross-Site Request Forgery (CSRF)

Implement CSRF tokens and use SameSite cookies to prevent unauthorized actions.

## Sensitive Data Exposure

- Use HTTPS for all communications
- Encrypt sensitive data at rest
- Implement proper authentication and authorization

## Security Headers

Implement important headers like CSP, X-Frame-Options, and X-Content-Type-Options.

Regular security audits and staying updated with the latest vulnerabilities are essential practices.`,
    date: "2023-12-28",
    category: "Security",
    author: "Emily Watson",
    authorBio: "Security researcher focused on web application vulnerabilities and defensive practices.",
    image: "https://images.unsplash.com/photo-1563986768817-ea2bbc67ee35?w=800&h=400&fit=crop",
    readTime: 9,
    tags: ["Security", "Web Dev", "Best Practices"],
  },
  {
    slug: "typescript-advanced-patterns",
    title: "Advanced TypeScript Patterns for Scalable Applications",
    excerpt:
      "Master advanced TypeScript patterns including generics, decorators, and utility types to build robust, type-safe applications.",
    content: `TypeScript offers powerful features for building scalable applications. Let's explore advanced patterns.

## Generics

Generics allow you to create reusable components that work with multiple types.

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

// Works with any type
const result = identity<string>("hello");
\`\`\`

## Utility Types

TypeScript provides utility types for common transformations:
- Partial<T>: Make all properties optional
- Readonly<T>: Make all properties readonly
- Pick<T, K>: Select properties from T
- Record<K, T>: Create object with keys K and values T

## Conditional Types

\`\`\`typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>; // false
\`\`\`

## Mapped Types

\`\`\`typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};
\`\`\`

Mastering these patterns will significantly improve your TypeScript code quality and maintainability.`,
    date: "2023-12-20",
    category: "Web Dev",
    author: "Marcus Johnson",
    authorBio: "TypeScript expert and open-source contributor with focus on type systems.",
    image: "https://images.unsplash.com/photo-1516534775068-bb57a52b0b91?w=800&h=400&fit=crop",
    readTime: 11,
    tags: ["TypeScript", "JavaScript", "Programming"],
  },
  {
    slug: "nextjs-13-app-router",
    title: "Next.js 13 App Router: Building Modern Web Apps",
    excerpt:
      "Explore the revolutionary App Router in Next.js 13 and how it simplifies building modern, full-stack web applications.",
    content: `The Next.js 13 App Router represents a significant evolution in how we build web applications with React.

## File-Based Routing

The App Router uses a directory structure to define routes automatically.

\`\`\`
app/
  page.tsx (/)
  about/
    page.tsx (/about)
  blog/
    [slug]/
      page.tsx (/blog/[slug])
\`\`\`

## Server Components

By default, components in the App Router are Server Components, improving performance and security.

## Layout Components

\`\`\`typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
\`\`\`

## API Routes

Define API endpoints using route handlers:

\`\`\`typescript
// app/api/posts/route.ts
export async function GET() {
  return Response.json({ posts: [] });
}
\`\`\`

The App Router simplifies development while improving performance and developer experience.`,
    date: "2023-12-15",
    category: "Web Dev",
    author: "Jessica Lee",
    authorBio: "Full-stack developer specializing in React and Next.js ecosystem.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop",
    readTime: 7,
    tags: ["Next.js", "React", "Web Dev"],
  },
];

export const categories = [
  { name: "AI & ML", count: 2 },
  { name: "Web Dev", count: 4 },
  { name: "Cloud", count: 1 },
  { name: "Security", count: 1 },
];
