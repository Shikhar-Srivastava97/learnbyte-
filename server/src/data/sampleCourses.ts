import { ICourse, IQuiz, INote, IStudyPlan, IUser, ITranscript } from '../models/types.js';

export const sampleUser: IUser = {
  _id: 'user_default',
  name: 'Shikhar',
  email: 'shikhar@learnbyte.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  studyStreak: 6,
  totalHoursStudied: 32.4,
  completedLessonsCount: 18,
  preferredStudyHoursPerDay: 2,
  createdAt: new Date('2026-10-01'),
  updatedAt: new Date('2026-11-25')
};

export const sampleDevOpsCourse: ICourse = {
  _id: 'course_devops_30h',
  title: 'Full DevOps Engineering Bootcamp (Docker, Kubernetes, CI/CD, Terraform, AWS)',
  description: 'A comprehensive 30+ hour end-to-end curriculum transforming complete beginners and system administrators into production-ready DevOps engineers. Covers container orchestration, immutable infrastructure, automated build pipelines, and production observability.',
  category: 'DevOps',
  sourceUrl: 'https://www.youtube.com/watch?v=fqMOX6JJ87k',
  videoId: 'fqMOX6JJ87k',
  isPlaylist: false,
  channelTitle: 'TechWorld with Nana & DevOps Directive',
  thumbnailUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
  totalDuration: '31h 45m',
  totalDurationSeconds: 114300,
  difficulty: 'Intermediate',
  tags: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'AWS', 'Linux'],
  generatorModel: 'nvidia/nemotron-4-340b-instruct',
  isDemo: true,
  enrolled: true,
  progressPercent: 32,
  createdAt: new Date('2026-11-10'),
  updatedAt: new Date('2026-11-25'),
  learningObjectives: [
    'Design, containerize, and securely deploy microservices using Docker and multi-stage builds',
    'Architect resilient multi-node Kubernetes clusters with Deployments, StatefulSets, Ingress, and Helm',
    'Write reproducible declarative infrastructure across cloud providers using Terraform and State locking',
    'Build robust automated CI/CD pipelines with automated security testing and rollback strategies',
    'Instrument production systems with Prometheus metric collectors, Alertmanager, and Grafana dashboards',
    'Debug distributed cloud environments using Linux kernel tracing, network packet capture, and journalctl'
  ],
  modules: [
    {
      _id: 'mod_1',
      courseId: 'course_devops_30h',
      title: 'Module 1: Linux Core Systems, Networking & Shell Automation',
      description: 'Foundations of Linux internals, file permissions, systemd services, SSH tunneling, and production Bash scripting.',
      order: 1,
      lessons: [
        {
          _id: 'les_1_1',
          moduleId: 'mod_1',
          courseId: 'course_devops_30h',
          title: 'Linux Kernel Architecture & Process Management',
          description: 'Understanding init systems, process hierarchies, nice values, memory paging, and signals.',
          order: 1,
          startTime: 0,
          endTime: 1240,
          duration: '20:40',
          learningObjectives: [
            'Inspect running processes using ps, top, htop, and /proc filesystem',
            'Manage Linux daemon services with systemctl and custom unit files',
            'Send process interruption, termination, and hangup signals'
          ],
          keyConcepts: ['PID', 'systemd Unit', 'Fork-Exec', 'Zombies & Orphans', 'SIGTERM vs SIGKILL'],
          summary: 'In this opening lesson, we explore how the Linux kernel schedules threads, manages memory mapping, and isolates processes. You will learn to construct custom systemd service files to maintain background worker processes that auto-restart upon unexpected failures.',
          completed: true
        },
        {
          _id: 'les_1_2',
          moduleId: 'mod_1',
          courseId: 'course_devops_30h',
          title: 'Linux Networking: Sockets, IP Tables & DNS Resolution',
          description: 'Deep dive into TCP/IP stack, iptables rules, network namespaces, netstat, ss, and /etc/resolv.conf debugging.',
          order: 2,
          startTime: 1240,
          endTime: 2680,
          duration: '24:00',
          learningObjectives: [
            'Troubleshoot port listening and socket states with ss and lsof',
            'Configure packet routing and packet drops with iptables',
            'Diagnose slow DNS lookups with dig and nslookup'
          ],
          keyConcepts: ['TCP Handshake', 'Loopback', 'Socket Buffers', 'iptables NAT', 'DNS Resolver'],
          summary: 'Networking is the backbone of distributed infrastructure. This lesson breaks down network namespaces, route tables, and how Linux negotiates TLS handshakes over raw sockets.',
          completed: true
        },
        {
          _id: 'les_1_3',
          moduleId: 'mod_1',
          courseId: 'course_devops_30h',
          title: 'Shell Scripting, Cron Automation & Error Handling',
          description: 'Writing robust POSIX-compliant bash scripts with set -euo pipefail, trap handlers, and cron scheduling.',
          order: 3,
          startTime: 2680,
          endTime: 4120,
          duration: '24:00',
          learningObjectives: [
            'Write defensive bash scripts with exit on error flags',
            'Intercept fatal signals with trap handlers for cleanup',
            'Schedule resilient cron jobs with log redirection'
          ],
          keyConcepts: ['set -euo pipefail', 'Trap Exit Handlers', 'Crontab Syntax', 'StdErr vs StdOut'],
          summary: 'Learn how to automate daily maintenance scripts without risk of silent failures. We implement rigorous exit guards and cleanup traps for temporary files.',
          completed: true
        }
      ]
    },
    {
      _id: 'mod_2',
      courseId: 'course_devops_30h',
      title: 'Module 2: Containerization with Docker & Container Security',
      description: 'Container namespaces, cgroups, Dockerfile optimization, multi-stage builds, and non-root runtime best practices.',
      order: 2,
      lessons: [
        {
          _id: 'les_2_1',
          moduleId: 'mod_2',
          courseId: 'course_devops_30h',
          title: 'Docker Internals: Namespaces & Control Groups (cgroups)',
          description: 'How containers actually work under the hood without a hypervisor. Creating chroot jails and unshare namespaces.',
          order: 1,
          startTime: 4120,
          endTime: 5690,
          duration: '26:10',
          learningObjectives: [
            'Explain how PID, NET, and MNT namespaces create isolation',
            'Enforce CPU and RAM hardware limits using cgroups v2',
            'Differentiate between Virtual Machines and OCI containers'
          ],
          keyConcepts: ['Linux Namespaces', 'cgroups v2', 'OverlayFS', 'OCI Runtime (runc)', 'chroot'],
          summary: 'Containers are not lightweight virtual machines—they are standard Linux processes bound by namespace isolations and cgroup throttles. This lesson provides an intuitive mental model for container virtualization.',
          completed: true
        },
        {
          _id: 'les_2_2',
          moduleId: 'mod_2',
          courseId: 'course_devops_30h',
          title: 'Multi-Stage Dockerfiles & Image Size Optimization',
          description: 'Shrinking 1.2GB development images to a crisp 25MB scratch/alpine production artifact with build caching.',
          order: 2,
          startTime: 5690,
          endTime: 7450,
          duration: '29:20',
          learningObjectives: [
            'Structure multi-stage Docker builds to discard compiler tools',
            'Leverage Docker layer caching for lightning-fast CI builds',
            'Configure non-root user execution to prevent container escapes'
          ],
          keyConcepts: ['Multi-Stage Builds', 'Layer Caching', 'Distroless & Alpine', 'USER nonroot', '.dockerignore'],
          summary: 'Production containers must be small and minimal to decrease attack surface and speed up cold starts. We walk through compiling a Go/Node app and copying only the standalone binary into a distroless container.',
          completed: false
        },
        {
          _id: 'les_2_3',
          moduleId: 'mod_2',
          courseId: 'course_devops_30h',
          title: 'Docker Compose, Networks & Health Checks',
          description: 'Orchestrating multi-container local environments with bridge networks, persistent volumes, and depends_on health checks.',
          order: 3,
          startTime: 7450,
          endTime: 9100,
          duration: '27:30',
          learningObjectives: [
            'Spin up multi-tier web + database + cache architectures',
            'Configure bridge network service discovery via DNS',
            'Implement HTTP and socket health check routines'
          ],
          keyConcepts: ['Bridge Network', 'Named Volumes', 'Health Check Probes', 'Service DNS Discovery'],
          summary: 'Master local orchestration with Docker Compose. Connect frontend, backend, PostgreSQL, and Redis with isolated networking and automatic startup health dependency validation.',
          completed: false
        }
      ]
    },
    {
      _id: 'mod_3',
      courseId: 'course_devops_30h',
      title: 'Module 3: Kubernetes Orchestration & Cluster Architecture',
      description: 'Control plane components (etcd, kube-apiserver, scheduler), Pod lifecycle, Deployments, Services, and Helm package manager.',
      order: 3,
      lessons: [
        {
          _id: 'les_3_1',
          moduleId: 'mod_3',
          courseId: 'course_devops_30h',
          title: 'Kubernetes Control Plane & Worker Architecture',
          description: 'Examining kube-apiserver, etcd consensus, kube-controller-manager, kube-scheduler, and kubelet.',
          order: 1,
          startTime: 9100,
          endTime: 10980,
          duration: '31:20',
          learningObjectives: [
            'Understand how declarative manifests flow from kubectl into etcd',
            'Describe the Raft consensus algorithm backing etcd cluster state',
            'Inspect node health and kubelet daemon registration'
          ],
          keyConcepts: ['Control Plane', 'etcd Raft', 'kube-apiserver', 'kubelet', 'Reconciliation Loop'],
          summary: 'Kubernetes is fundamentally a reconciliation loop that continuously drives the cluster actual state toward the desired state defined in declarative manifests.',
          completed: false
        },
        {
          _id: 'les_3_2',
          moduleId: 'mod_3',
          courseId: 'course_devops_30h',
          title: 'Deployments, ReplicaSets & Zero-Downtime Rollouts',
          description: 'RollingUpdate strategy, maxSurge, maxUnavailable, Canary deployments, and rollback commands.',
          order: 2,
          startTime: 10980,
          endTime: 12850,
          duration: '31:10',
          learningObjectives: [
            'Deploy zero-downtime rolling updates with readiness probes',
            'Fine-tune maxSurge and maxUnavailable percentages',
            'Execute rapid rollback to previous revision in production incidents'
          ],
          keyConcepts: ['RollingUpdate', 'ReplicaSet', 'Rollout Undo', 'Readiness vs Liveness Probes'],
          summary: 'Never drop user requests during a deployment. Learn how Kubernetes drains existing pods and verifies readiness before rerouting production ingress traffic.',
          completed: false
        },
        {
          _id: 'les_3_3',
          moduleId: 'mod_3',
          courseId: 'course_devops_30h',
          title: 'Ingress Controllers, Services (ClusterIP/NodePort) & Cert-Manager',
          description: 'Exposing services to the public internet, path-based routing with NGINX Ingress, and automatic Let’s Encrypt SSL/TLS certificates.',
          order: 3,
          startTime: 12850,
          endTime: 14750,
          duration: '31:40',
          learningObjectives: [
            'Route internal microservice traffic with ClusterIP and headless services',
            'Configure an Ingress controller for host-based routing',
            'Automate TLS certificate renewal with cert-manager'
          ],
          keyConcepts: ['ClusterIP', 'Ingress Resource', 'TLS Secret', 'cert-manager ACME', 'LoadBalancer'],
          summary: 'Connect external web traffic safely to internal pods using Ingress rules and TLS encryption with automated certificate renewal.',
          completed: false
        }
      ]
    },
    {
      _id: 'mod_4',
      courseId: 'course_devops_30h',
      title: 'Module 4: Infrastructure as Code (IaC) with Terraform',
      description: 'Declarative cloud provisioning, state locks in S3/DynamoDB, modules, variables, and drift detection.',
      order: 4,
      lessons: [
        {
          _id: 'les_4_1',
          moduleId: 'mod_4',
          courseId: 'course_devops_30h',
          title: 'Terraform HCL Basics, Providers & State Files',
          description: 'Provider blocks, resource definitions, output variables, and the importance of terraform.tfstate.',
          order: 1,
          startTime: 14750,
          endTime: 16500,
          duration: '29:10',
          learningObjectives: [
            'Write clean HashiCorp Configuration Language (HCL) syntax',
            'Manage remote backend state with AWS S3 and DynamoDB lock tables',
            'Run terraform plan and inspect infrastructure changes before apply'
          ],
          keyConcepts: ['HCL', 'Remote State', 'DynamoDB Lock', 'Plan vs Apply', 'State Drift'],
          summary: 'Infrastructure as Code allows teams to review, version, and replicate entire cloud datacenters using git pull requests.',
          completed: false
        },
        {
          _id: 'les_4_2',
          moduleId: 'mod_4',
          courseId: 'course_devops_30h',
          title: 'Reusable Terraform Modules & Multi-Environment Setup',
          description: 'Structuring dev, staging, and prod workspaces with custom VPC, Subnet, and EKS modules.',
          order: 2,
          startTime: 16500,
          endTime: 18200,
          duration: '28:20',
          learningObjectives: [
            'Create composable Terraform modules with typed inputs',
            'Segregate environments with workspaces or directory layouts',
            'Enforce security compliance with tfsec and checkov'
          ],
          keyConcepts: ['Terraform Modules', 'Workspaces', 'Static Analysis', 'tfsec'],
          summary: 'Avoid duplicating code across environments by writing reusable modules with strict input type validations.',
          completed: false
        }
      ]
    },
    {
      _id: 'mod_5',
      courseId: 'course_devops_30h',
      title: 'Module 5: Production CI/CD Pipelines & GitHub Actions',
      description: 'Continuous Integration with GitHub Actions, artifact registries, semantic versioning, and GitOps with ArgoCD.',
      order: 5,
      lessons: [
        {
          _id: 'les_5_1',
          moduleId: 'mod_5',
          courseId: 'course_devops_30h',
          title: 'GitHub Actions Workflows, Secrets & Docker Buildx',
          description: 'Writing workflow YAMLs, matrix testing, multi-arch image compilation, and Docker Hub / ECR pushes.',
          order: 1,
          startTime: 18200,
          endTime: 20050,
          duration: '30:50',
          learningObjectives: [
            'Trigger automated tests on pull requests',
            'Store cloud credentials securely using OpenID Connect (OIDC)',
            'Build multi-platform ARM64/AMD64 images with buildx'
          ],
          keyConcepts: ['GitHub Actions YAML', 'OIDC AWS Auth', 'Buildx', 'Matrix Builds'],
          summary: 'Build a production-grade CI pipeline that compiles code, executes unit tests, scans for vulnerabilities with Trivy, and pushes signed images to container registries.',
          completed: false
        },
        {
          _id: 'les_5_2',
          moduleId: 'mod_5',
          courseId: 'course_devops_30h',
          title: 'GitOps Continuous Delivery with ArgoCD',
          description: 'Reconciling Git repository manifests directly with live Kubernetes cluster state using ArgoCD.',
          order: 2,
          startTime: 20050,
          endTime: 21900,
          duration: '30:50',
          learningObjectives: [
            'Install and configure ArgoCD inside Kubernetes',
            'Define Application manifests linking Git branches to namespaces',
            'Implement automated sync and automated self-healing'
          ],
          keyConcepts: ['GitOps', 'ArgoCD Application', 'Self-Healing', 'Sync Waves'],
          summary: 'GitOps makes Git the single source of truth for declared infrastructure and application state, eliminating manual kubectl interventions.',
          completed: false
        }
      ]
    },
    {
      _id: 'mod_6',
      courseId: 'course_devops_30h',
      title: 'Module 6: Observability, Prometheus, Grafana & SRE',
      description: 'The three pillars of observability (metrics, logs, traces), Prometheus PromQL queries, Grafana dashboards, and Alertmanager routing.',
      order: 6,
      lessons: [
        {
          _id: 'les_6_1',
          moduleId: 'mod_6',
          courseId: 'course_devops_30h',
          title: 'Prometheus Architecture, Exporters & PromQL Metrics',
          description: 'Pull-based metric scraping, Node Exporter, counters, gauges, histograms, and quantile calculations.',
          order: 1,
          startTime: 21900,
          endTime: 23800,
          duration: '31:40',
          learningObjectives: [
            'Deploy Prometheus Server and Node Exporter daemonsets',
            'Query system throughput and error rates using PromQL rate() and histogram_quantile()',
            'Calculate Service Level Indicators (SLI) and Service Level Objectives (SLO)'
          ],
          keyConcepts: ['PromQL', 'Node Exporter', 'Counters vs Gauges', 'Rate & Irate', 'SLO / SLI'],
          summary: 'Discover how time-series metrics let you spot performance regressions and memory leaks hours before systems collapse.',
          completed: false
        },
        {
          _id: 'les_6_2',
          moduleId: 'mod_6',
          courseId: 'course_devops_30h',
          title: 'Grafana Dashboards, Alertmanager & PagerDuty Alerts',
          description: 'Designing high-visibility operational dashboards and routing high-severity alerts to Slack and on-call rotations.',
          order: 2,
          startTime: 23800,
          endTime: 25600,
          duration: '30:00',
          learningObjectives: [
            'Create interactive Grafana dashboards with template variables',
            'Write Alertmanager routing rules with inhibitor logic',
            'Configure incident notification channels'
          ],
          keyConcepts: ['Grafana Datasource', 'Dashboard Panels', 'Alertmanager Route', 'Inhibition Rules'],
          summary: 'Turn raw numbers into actionable charts that illuminate cluster health at a glance, and craft alerts that wake engineers only when real user impact occurs.',
          completed: false
        }
      ]
    }
  ]
};

export const sampleAIMLCourse: ICourse = {
  _id: 'course_aiml_18h',
  title: 'Deep Learning, LLMs & Neural Networks From Scratch with PyTorch',
  description: 'Master deep learning architecture from fundamental matrix calculus to modern transformer attention mechanisms and NVIDIA Nemotron fine-tuning.',
  category: 'AI & Machine Learning',
  sourceUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
  videoId: 'aircAruvnKk',
  isPlaylist: false,
  channelTitle: 'Andrej Karpathy & NVIDIA Deep Learning Institute',
  thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  totalDuration: '18h 30m',
  totalDurationSeconds: 66600,
  difficulty: 'Advanced',
  tags: ['AI', 'PyTorch', 'Transformers', 'Nemotron', 'LLMs', 'Deep Learning'],
  generatorModel: 'nvidia/nemotron-4-340b-instruct',
  isDemo: true,
  enrolled: true,
  progressPercent: 45,
  createdAt: new Date('2026-11-12'),
  updatedAt: new Date('2026-11-25'),
  learningObjectives: [
    'Implement micrograd backpropagation engine from scratch in pure Python',
    'Build multi-layer perceptrons and optimize with AdamW and learning rate schedules',
    'Code scaled dot-product multi-head self-attention mechanisms in PyTorch',
    'Fine-tune open-weights LLMs using LoRA, QLoRA, and FP8 quantization'
  ],
  modules: [
    {
      _id: 'aiml_mod_1',
      courseId: 'course_aiml_18h',
      title: 'Module 1: Automatic Differentiation & Backpropagation Engine',
      description: 'Building micrograd: computational graphs, backward passes, and gradient descent.',
      order: 1,
      lessons: [
        {
          _id: 'aiml_les_1',
          moduleId: 'aiml_mod_1',
          courseId: 'course_aiml_18h',
          title: 'The Calculus of Backpropagation & Computation Graphs',
          description: 'Deriving the chain rule symbolically and constructing DAG nodes with forward and backward lambdas.',
          order: 1,
          startTime: 0,
          endTime: 1800,
          duration: '30:00',
          learningObjectives: ['Trace tensor computational DAGs', 'Implement reverse-mode automatic differentiation'],
          keyConcepts: ['Chain Rule', 'Computational Graph', 'Loss Gradients'],
          summary: 'A deep, hands-on derivation of backpropagation that de-mystifies modern autograd systems.',
          completed: true
        }
      ]
    }
  ]
};

export const sampleWebDevCourse: ICourse = {
  _id: 'course_webdev_12h',
  title: 'TypeScript, Modern React & Full-Stack Systems Architecture',
  description: 'Enterprise React patterns, typed server actions, performance profiling, web vitals, and scalable state machines.',
  category: 'Web Development',
  sourceUrl: 'https://www.youtube.com/watch?v=zQnBQ4tB3ZA',
  videoId: 'zQnBQ4tB3ZA',
  isPlaylist: false,
  channelTitle: 'Jack Herrington & Theo - t3.gg',
  thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
  totalDuration: '12h 15m',
  totalDurationSeconds: 44100,
  difficulty: 'Intermediate',
  tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Architecture'],
  generatorModel: 'nvidia/nemotron-4-340b-instruct',
  isDemo: true,
  enrolled: true,
  progressPercent: 60,
  createdAt: new Date('2026-11-15'),
  updatedAt: new Date('2026-11-25'),
  learningObjectives: [
    'Model complex domain states with discriminated unions and generics',
    'Optimize React re-renders using immutable selectors and memoization',
    'Structure clean layered architectures separating API clients from UI'
  ],
  modules: [
    {
      _id: 'web_mod_1',
      courseId: 'course_webdev_12h',
      title: 'Module 1: Advanced TypeScript Generics & Type Narrowing',
      description: 'Conditional types, infer keyword, mapped types, and runtime schema validation with Zod.',
      order: 1,
      lessons: [
        {
          _id: 'web_les_1',
          moduleId: 'web_mod_1',
          courseId: 'course_webdev_12h',
          title: 'Discriminated Unions & Exhaustive Pattern Matching',
          description: 'Leveraging TypeScript type system to make invalid application states unrepresentable.',
          order: 1,
          startTime: 0,
          endTime: 1540,
          duration: '25:40',
          learningObjectives: ['Define robust state machines with tagged unions', 'Use never assertions for exhaustive switch checks'],
          keyConcepts: ['Discriminated Unions', 'never type', 'Exhaustive check'],
          summary: 'How to write bulletproof frontend state logic by eliminating illegal state combinations using TypeScript unions.',
          completed: true
        }
      ]
    }
  ]
};

export const sampleCloudCourse: ICourse = {
  _id: 'course_cloud_24h',
  title: 'AWS Cloud Solutions Architect Masterclass: High Availability & Cost Optimization',
  description: 'Design fault-tolerant, elastic, multi-region cloud infrastructures across EC2, ECS, Lambda, DynamoDB, S3, and Route 53.',
  category: 'Cloud Computing',
  sourceUrl: 'https://www.youtube.com/watch?v=Ia-UEYYR44s',
  videoId: 'Ia-UEYYR44s',
  isPlaylist: false,
  channelTitle: 'Stephane Maarek & Adrian Cantrill',
  thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  totalDuration: '24h 10m',
  totalDurationSeconds: 87000,
  difficulty: 'Advanced',
  tags: ['AWS', 'Cloud', 'Architecture', 'S3', 'Lambda', 'DynamoDB'],
  generatorModel: 'nvidia/nemotron-4-340b-instruct',
  isDemo: true,
  enrolled: false,
  progressPercent: 0,
  createdAt: new Date('2026-11-18'),
  updatedAt: new Date('2026-11-25'),
  learningObjectives: [
    'Design multi-AZ and multi-region disaster recovery setups with RTO and RPO goals',
    'Configure fine-grained IAM roles, policies, and KMS envelope encryption',
    'Optimize AWS cost structures using spot instances, savings plans, and S3 lifecycle rules'
  ],
  modules: [
    {
      _id: 'cloud_mod_1',
      courseId: 'course_cloud_24h',
      title: 'Module 1: VPC Architecture, Subnets & Internet Gateways',
      description: 'Designing isolated private and public subnets, NAT gateways, and peering connections.',
      order: 1,
      lessons: [
        {
          _id: 'cloud_les_1',
          moduleId: 'cloud_mod_1',
          courseId: 'course_cloud_24h',
          title: 'CIDR Block Allocation & Route Table Setup',
          description: 'Subnetting IPv4 CIDRs and managing traffic flow to Internet Gateways and NAT instances.',
          order: 1,
          startTime: 0,
          endTime: 1620,
          duration: '27:00',
          learningObjectives: ['Calculate subnet bitmasks', 'Configure secure egress for private subnets'],
          keyConcepts: ['CIDR /16 vs /24', 'Internet Gateway', 'NAT Gateway', 'Route Table'],
          summary: 'The essential blueprint for creating an enterprise-grade Virtual Private Cloud (VPC) on AWS.',
          completed: false
        }
      ]
    }
  ]
};

export const sampleProgrammingCourse: ICourse = {
  _id: 'course_prog_16h',
  title: 'Rust Systems Programming: Memory Safety Without Garbage Collection',
  description: 'Master ownership, borrowing, lifetimes, async Tokio runtime, and zero-cost abstractions to build blazing-fast CLI tools and microservices.',
  category: 'Programming',
  sourceUrl: 'https://www.youtube.com/watch?v=MsocPEZBd-M',
  videoId: 'MsocPEZBd-M',
  isPlaylist: false,
  channelTitle: 'Jon Gjengset & Crust of Rust',
  thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  totalDuration: '16h 40m',
  totalDurationSeconds: 60000,
  difficulty: 'Advanced',
  tags: ['Rust', 'Systems Programming', 'Concurrency', 'Memory Safety', 'Tokio'],
  generatorModel: 'nvidia/nemotron-4-340b-instruct',
  isDemo: true,
  enrolled: false,
  progressPercent: 0,
  createdAt: new Date('2026-11-20'),
  updatedAt: new Date('2026-11-25'),
  learningObjectives: [
    'Conquer the Rust borrow checker with explicit lifetime annotations',
    'Build multi-threaded worker pools with channels and Arc/Mutex synchronization',
    'Write high-performance asynchronous networking microservices using Tokio'
  ],
  modules: [
    {
      _id: 'prog_mod_1',
      courseId: 'course_prog_16h',
      title: 'Module 1: Ownership, Moving, Copying & Borrowing Semantics',
      description: 'How Rust enforces memory safety at compile-time without a runtime garbage collector.',
      order: 1,
      lessons: [
        {
          _id: 'prog_les_1',
          moduleId: 'prog_mod_1',
          courseId: 'course_prog_16h',
          title: 'The Stack vs The Heap & RAII Resource Management',
          description: 'Understanding pointer dereferencing, allocator semantics, and Drop trait cleanup.',
          order: 1,
          startTime: 0,
          endTime: 1480,
          duration: '24:40',
          learningObjectives: ['Distinguish stack frames from heap allocations', 'Implement custom Drop cleanup logic'],
          keyConcepts: ['Ownership', 'Stack vs Heap', 'RAII Pattern', 'Drop Trait'],
          summary: 'An in-depth explanation of how Rust manages memory without memory leaks or segmentation faults.',
          completed: false
        }
      ]
    }
  ]
};

export const sampleQuizzes: IQuiz[] = [
  {
    _id: 'quiz_les_1_1',
    courseId: 'course_devops_30h',
    moduleId: 'mod_1',
    lessonId: 'les_1_1',
    title: 'Quiz: Linux Kernel Architecture & Process Management',
    description: 'Test your understanding of Linux init systems, signals, and process management.',
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'Which signal cannot be caught, blocked, or ignored by any user-space process in Linux?',
        options: ['SIGINT (2)', 'SIGTERM (15)', 'SIGKILL (9)', 'SIGHUP (1)'],
        correctAnswer: 'SIGKILL (9)',
        explanation: 'SIGKILL (signal 9) and SIGSTOP are handled directly by the kernel and cannot be intercepted, blocked, or caught by an application.',
        relevantTimestamp: 340,
        concept: 'SIGTERM vs SIGKILL'
      },
      {
        id: 'q2',
        type: 'true_false',
        question: 'A Zombie process consumes active CPU cycles while awaiting its parent termination.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'A zombie process has already finished execution and terminated; it holds only an entry in the process table (PID) and consumes zero CPU cycles or active memory until reaped by its parent.',
        relevantTimestamp: 720,
        concept: 'Zombies & Orphans'
      },
      {
        id: 'q3',
        type: 'short_answer',
        question: 'What is the default process ID (PID) assigned to the Linux systemd or init process that initializes all user-space subsystems?',
        correctAnswer: '1',
        explanation: 'PID 1 is reserved for systemd (or init), which acts as the direct ancestor and parent of all orphans.',
        relevantTimestamp: 120,
        concept: 'PID 1 and systemd'
      },
      {
        id: 'q4',
        type: 'multiple_choice',
        question: 'Which directory in the Linux virtual filesystem exposes live kernel process metadata as dynamic virtual files?',
        options: ['/dev', '/proc', '/sys', '/etc'],
        correctAnswer: '/proc',
        explanation: 'The /proc directory is a pseudo-filesystem generated on-the-fly by the Linux kernel containing process memory maps, status, and system hardware information.',
        relevantTimestamp: 980,
        concept: '/proc filesystem'
      }
    ],
    createdAt: new Date('2026-11-10')
  },
  {
    _id: 'quiz_les_2_1',
    courseId: 'course_devops_30h',
    moduleId: 'mod_2',
    lessonId: 'les_2_1',
    title: 'Quiz: Docker Internals & Namespaces',
    description: 'Assess your knowledge on how Linux kernel namespaces and cgroups isolate container workloads.',
    questions: [
      {
        id: 'q5',
        type: 'multiple_choice',
        question: 'Which Linux kernel feature enforces hardware resource quotas such as maximum CPU cores and memory limits?',
        options: ['Namespaces', 'Control Groups (cgroups)', 'AppArmor', 'iptables'],
        correctAnswer: 'Control Groups (cgroups)',
        explanation: 'cgroups (Control Groups) meter, throttle, and enforce memory and CPU resource consumption, whereas namespaces handle visibility isolation.',
        relevantTimestamp: 4420,
        concept: 'cgroups v2'
      },
      {
        id: 'q6',
        type: 'true_false',
        question: 'Docker containers have their own independent Linux kernel instance running inside each container.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Containers share the host operating system Linux kernel. Isolation is created via namespaces and cgroups, unlike Virtual Machines which emulate hardware and run independent kernels.',
        relevantTimestamp: 4680,
        concept: 'Containers vs VMs'
      }
    ],
    createdAt: new Date('2026-11-10')
  }
];

export const sampleNotes: INote[] = [
  {
    _id: 'note_1',
    userId: 'user_default',
    courseId: 'course_devops_30h',
    lessonId: 'les_1_1',
    title: 'Signals Cheatsheet: Graceful Shutdown vs Forced Kill',
    content: `Always configure container entrypoints to trap SIGTERM (15) so the web application can finish processing active HTTP requests and close database connections before exiting.\n\n\`\`\`bash\ntrap 'echo "Shutting down gracefully..."; exit 0' SIGTERM\n\`\`\`\n\nIf the process does not exit within Docker's 10-second grace period, Docker sends SIGKILL (9) which terminates the process immediately.`,
    timestamp: 340,
    timestampFormatted: '05:40',
    tags: ['Linux', 'Signals', 'DevOps', 'Best-Practice'],
    bookmarked: true,
    createdAt: new Date('2026-11-21T10:30:00'),
    updatedAt: new Date('2026-11-21T10:30:00')
  },
  {
    _id: 'note_2',
    userId: 'user_default',
    courseId: 'course_devops_30h',
    lessonId: 'les_1_2',
    title: 'Network Port Inspection Command',
    content: `To inspect all listening TCP sockets along with the process names without waiting for slow DNS resolution:\n\n\`\`\`bash\nsudo ss -tulpn\n\`\`\`\n\nFlags breakdown:\n- \`-t\`: TCP sockets\n- \`-u\`: UDP sockets\n- \`-l\`: Listening sockets only\n- \`-p\`: Show process name and PID\n- \`-n\`: Numeric IP and port numbers (skips reverse DNS)`,
    timestamp: 1560,
    timestampFormatted: '26:00',
    tags: ['Networking', 'CLI', 'Troubleshooting'],
    bookmarked: true,
    createdAt: new Date('2026-11-22T14:15:00'),
    updatedAt: new Date('2026-11-22T14:15:00')
  },
  {
    _id: 'note_3',
    userId: 'user_default',
    courseId: 'course_devops_30h',
    lessonId: 'les_2_1',
    title: 'cgroups v2 OOM Killer Behavior',
    content: `When a container exceeds its memory limit configured via cgroups, the Linux kernel Out-Of-Memory (OOM) killer kicks in. Check with \`dmesg -T | grep -i oom\` to verify if your service was killed by memory exhaustion rather than an internal software bug.`,
    timestamp: 4580,
    timestampFormatted: '16:20',
    tags: ['Docker', 'Memory', 'OOM'],
    bookmarked: false,
    createdAt: new Date('2026-11-24T09:45:00'),
    updatedAt: new Date('2026-11-24T09:45:00')
  }
];

export const sampleStudyPlan: IStudyPlan = {
  _id: 'study_plan_default',
  userId: 'user_default',
  courseId: 'course_devops_30h',
  dailyStudyHours: 2,
  targetCompletionDate: '2026-12-15',
  schedulePreference: 'daily',
  tasks: [
    {
      id: 'task_1',
      lessonId: 'les_1_1',
      courseId: 'course_devops_30h',
      courseTitle: 'Full DevOps Engineering Bootcamp',
      lessonTitle: 'Linux Kernel Architecture & Process Management',
      durationMinutes: 21,
      targetDate: '2026-11-24',
      completed: true,
      completedAt: new Date('2026-11-24T18:00:00')
    },
    {
      id: 'task_2',
      lessonId: 'les_1_2',
      courseId: 'course_devops_30h',
      courseTitle: 'Full DevOps Engineering Bootcamp',
      lessonTitle: 'Linux Networking: Sockets, IP Tables & DNS Resolution',
      durationMinutes: 24,
      targetDate: '2026-11-24',
      completed: true,
      completedAt: new Date('2026-11-24T19:30:00')
    },
    {
      id: 'task_3',
      lessonId: 'les_1_3',
      courseId: 'course_devops_30h',
      courseTitle: 'Full DevOps Engineering Bootcamp',
      lessonTitle: 'Shell Scripting, Cron Automation & Error Handling',
      durationMinutes: 24,
      targetDate: '2026-11-25',
      completed: true,
      completedAt: new Date('2026-11-25T11:00:00')
    },
    {
      id: 'task_4',
      lessonId: 'les_2_1',
      courseId: 'course_devops_30h',
      courseTitle: 'Full DevOps Engineering Bootcamp',
      lessonTitle: 'Docker Internals: Namespaces & Control Groups (cgroups)',
      durationMinutes: 26,
      targetDate: '2026-11-25',
      completed: true,
      completedAt: new Date('2026-11-25T13:15:00')
    },
    {
      id: 'task_5',
      lessonId: 'les_2_2',
      courseId: 'course_devops_30h',
      courseTitle: 'Full DevOps Engineering Bootcamp',
      lessonTitle: 'Multi-Stage Dockerfiles & Image Size Optimization',
      durationMinutes: 29,
      targetDate: '2026-11-25',
      completed: false
    },
    {
      id: 'task_6',
      lessonId: 'les_2_3',
      courseId: 'course_devops_30h',
      courseTitle: 'Full DevOps Engineering Bootcamp',
      lessonTitle: 'Docker Compose, Networks & Health Checks',
      durationMinutes: 28,
      targetDate: '2026-11-26',
      completed: false
    },
    {
      id: 'task_7',
      lessonId: 'les_3_1',
      courseId: 'course_devops_30h',
      courseTitle: 'Full DevOps Engineering Bootcamp',
      lessonTitle: 'Kubernetes Control Plane & Worker Architecture',
      durationMinutes: 31,
      targetDate: '2026-11-26',
      completed: false
    },
    {
      id: 'task_8',
      lessonId: 'les_3_2',
      courseId: 'course_devops_30h',
      courseTitle: 'Full DevOps Engineering Bootcamp',
      lessonTitle: 'Deployments, ReplicaSets & Zero-Downtime Rollouts',
      durationMinutes: 31,
      targetDate: '2026-11-27',
      completed: false
    }
  ],
  createdAt: new Date('2026-11-20'),
  updatedAt: new Date('2026-11-25')
};
