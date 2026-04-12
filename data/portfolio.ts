export const personalInfo = {
  name: "Manoj Kumar Palakuri",
  shortName: "Manoj",
  role: "Full-Stack Developer & Security Researcher",
  tagline: "Building Secure, Scalable Systems",
  bio: "Final-year BCA student specializing in Cybersecurity & Cloud Computing at Yenepoya University, Bengaluru. I build end-to-end systems where cryptographic guarantees meet distributed architectures — from real-world encryption tools to full-stack campus platforms. Passionate about the intersection of security, decentralization, and developer experience.",
  location: "Bengaluru, India",
  email: "manojkumarpalakuri@gmail.com",
  github: "https://github.com/ManojkumarPalakuri",
  university: "Yenepoya University, Bengaluru, India",
  degree: "Bachelor of Computer Applications (BCA)",
  specialization: "Cyber Security & Cloud Computing",
  cgpa: "9.02/10",
  graduation: "2023 – 2026",
  researchInterests: [
    "Applied Cryptography",
    "Distributed Systems",
    "Decentralized Architectures",
    "Blockchain Security",
  ],
};

export const projects = [
  {
    id: 1,
    title: "Yenepoya Student Hub",
    shortDesc: "Full-stack campus platform — auth, store, IDs & more",
    longDesc:
      "A monorepo MERN-stack campus portal designed and built from scratch. Handles the full range of campus services — JWT-based authentication with OTP email verification, real-time notifications, a 3D virtual student ID card with live QR code generation, a merchandise store with cart and order tracking, and a document services module with role-based admin approval workflows.",
    stack: ["React 18", "Vite", "Node.js", "Express", "MongoDB", "JWT", "Vercel"],
    category: "Full-Stack",
    featured: true,
    color: "#6c63ff",
    gradientFrom: "#6c63ff",
    gradientTo: "#3b82f6",
    highlights: [
      "JWT auth + OTP email verification",
      "3D virtual student ID with live QR code",
      "Role-based admin approval workflows",
      "Real-time notifications",
      "Merchandise store with cart & order tracking",
    ],
    liveUrl: "#",
    githubUrl: "https://github.com/ManojkumarPalakuri",
  },
  {
    id: 2,
    title: "ALLCRYPT",
    shortDesc: "MERN encryption tool with modern cryptographic techniques",
    longDesc:
      "An account-free, open-source MERN-stack encryption tool implementing modern cryptographic techniques and secure key derivation. Built end-to-end encryption pipelines ensuring secure data transmission. Supports AES-256/192/128 with stream-based file encryption, password strength metering, and QR code sharing.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Web Crypto API", "AES-256"],
    category: "Security",
    featured: true,
    color: "#ff6b6b",
    gradientFrom: "#ff6b6b",
    gradientTo: "#fbbf24",
    highlights: [
      "AES-256/192/128 encryption",
      "Secure key derivation (PBKDF2)",
      "Stream-based file encryption",
      "Zero account required — stateless",
      "QR code sharing",
    ],
    liveUrl: "#",
    githubUrl: "https://github.com/ManojkumarPalakuri",
  },
  {
    id: 3,
    title: "Secure RESTful Auth API",
    shortDesc: "High-performance API securing 1,000+ user accounts",
    longDesc:
      "Architected a high-performance secure REST API using Node.js, Express, and MongoDB. Implemented Argon2id password hashing and JWT-based authentication to protect 1,000+ user accounts. Prevented SQL injection and XSS attacks through strict validation and secure route handling.",
    stack: ["Node.js", "Express", "MongoDB", "JWT", "Argon2id", "Helmet.js"],
    category: "Backend",
    featured: false,
    color: "#10b981",
    gradientFrom: "#10b981",
    gradientTo: "#06b6d4",
    highlights: [
      "Argon2id password hashing",
      "JWT authentication",
      "1,000+ accounts secured",
      "SQL injection & XSS prevention",
    ],
    liveUrl: "#",
    githubUrl: "https://github.com/ManojkumarPalakuri",
  },
  {
    id: 4,
    title: "IBM Data Encryption Tool",
    shortDesc: "Applied cryptography for real-world data pipelines",
    longDesc:
      "Developing an applied cryptography solution at IBM involving secure key management, algorithm selection, and encryption workflows. Integrates encryption into real-world data pipelines, balancing security guarantees with system performance.",
    stack: ["Python", "Node.js", "OpenSSL", "Key Management", "AES", "RSA"],
    category: "Security",
    featured: false,
    color: "#8b5cf6",
    gradientFrom: "#8b5cf6",
    gradientTo: "#ec4899",
    highlights: [
      "Secure key management",
      "Multi-algorithm selection",
      "Real-world pipeline integration",
      "Performance-conscious security design",
    ],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 5,
    title: "Hybrid Blockchain Attendance",
    shortDesc: "On-chain verification with off-chain storage for scalability",
    longDesc:
      "Research paper presented at INCON-SDG 2026 International Conference. Designed a hybrid blockchain architecture combining on-chain immutability for verification while storing large datasets off-chain. Analyzes trade-offs between distributed trust, data integrity, and system performance.",
    stack: ["Blockchain", "Smart Contracts", "Off-chain Storage", "Cryptography"],
    category: "Research",
    featured: false,
    color: "#f59e0b",
    gradientFrom: "#f59e0b",
    gradientTo: "#ef4444",
    highlights: [
      "On-chain verification integrity",
      "Scalable off-chain storage",
      "INCON-SDG 2026 presentation",
      "Distributed trust analysis",
    ],
    liveUrl: "#",
    githubUrl: "#",
  },
];

export const experience = [
  {
    id: 1,
    role: "Data Encryption Tool Developer",
    company: "IBM",
    duration: "Feb 2026 – Present",
    type: "work",
    color: "#6c63ff",
    bullets: [
      "Developing applied cryptography solution with secure key management and algorithm selection",
      "Integrating encryption into real-world data pipelines",
      "Balancing security guarantees with system performance",
    ],
  },
  {
    id: 2,
    role: "Cloud & DevOps Intern",
    company: "TCS iON",
    duration: "Nov 2025 – Feb 2026",
    type: "work",
    color: "#3b82f6",
    bullets: [
      "Designed and implemented automated CI/CD pipeline deploying to AWS EC2",
      "Eliminated manual deployment steps; resolved environment inconsistencies",
      "Configured EC2 instances, IAM roles, and security groups",
    ],
  },
  {
    id: 3,
    role: "BCA — Cybersecurity & Cloud Computing",
    company: "Yenepoya University, Bengaluru",
    duration: "2023 – 2026",
    type: "education",
    color: "#10b981",
    bullets: [
      "CGPA: 9.02/10",
      "Coursework: Data Structures, Machine Learning, Cloud Computing, Network Security, Cryptography",
      "Co-founded YenShield Cybersecurity Club",
    ],
  },
  {
    id: 4,
    role: "Cybersecurity Intern",
    company: "Corizo (Wipro Collaboration)",
    duration: "Dec 2023 – Jan 2024",
    type: "work",
    color: "#f59e0b",
    bullets: [
      "Analyzed real-time network traffic with Wireshark and Nmap",
      "Conducted penetration testing using Burp Suite",
      "Recommended remediation strategies improving application-level security",
    ],
  },
];

export const skills = {
  Languages: ["JavaScript", "Python", "HTML", "CSS", "TypeScript"],
  "Frameworks & Libraries": ["React", "Next.js", "Node.js", "Express", "Framer Motion", "GSAP"],
  "Databases": ["MongoDB", "MySQL"],
  "Cloud & DevOps": ["AWS EC2", "AWS IAM", "CI/CD Pipelines", "Vercel", "Docker"],
  "Security": ["Wireshark", "Nmap", "Burp Suite", "JWT", "Argon2id", "SSL/TLS", "AES-256", "PBKDF2"],
  "Tools": ["Git", "GitHub", "VS Code", "Postman", "Linux"],
};

export const certifications = [
  "Matrix Algebra for Engineers – Coursera",
  "Computer Networking – Coursera",
  "Digital 101 Journey – NASSCOM FutureSkills",
  "Programming Fundamentals – Coursera",
  "Frontend Development using React – Coursera",
];

export const research = [
  {
    title: "A Hybrid Blockchain Attendance System Using Off-Chain Storage and On-Chain Verification",
    venue: "INCON-SDG 2026 International Conference",
    date: "March 2026",
    description:
      "Designed hybrid blockchain architecture combining on-chain immutability for verification with off-chain storage to address scalability. Analyzed trade-offs between distributed trust, data integrity, and system performance.",
  },
];

export const leadership = [
  {
    role: "Co-Founder",
    org: "YenShield Cybersecurity Club",
    duration: "2023 – Present",
    bullets: [
      "Organized cybersecurity bootcamps, seminars, and awareness programs",
      "Promoted knowledge-sharing culture within the student community",
    ],
  },
  {
    role: "Hackathon Volunteer",
    org: "Yenepoya University & IBM",
    duration: "2024",
    bullets: ["Coordinated logistics and participant engagement for university-level hackathon"],
  },
];
