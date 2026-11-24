/* ==========================================================
   RESUME DATA — edit ONLY this file to update the whole site.
   The page, terminal, AI chat and voice all read from here.
   (It's a .js file instead of .json so it also works when you
    open index.html directly, without a server.)
   ========================================================== */
window.RESUME = {
  name: "Avinash P V",
  title: "AI Software Developer",
  company: "Amrita Hospital, Kochi",
  location: "Ernakulam, Kerala",
  email: "avinashpv03@gmail.com",
  phone: "+91 99465 89218",
  resumePdf: "assets/resume.pdf",          // 2-page resume
  resumePdfShort: "assets/resume-1page.pdf",  // 1-page version
  links: {
    linkedin: "https://linkedin.com/in/avinashpvb053b1225",
    github: "https://github.com/avinash20003"
  },

  tagline: "I build healthcare software with AI inside it: LLM-powered assistants with Gemma and vLLM, data pipelines, and full-stack apps on Next.js, Node.js, PostgreSQL, Frappe and Flutter.",

  typing: [
    "building LLM-powered healthcare apps",
    "shipping AI chatbots with Gemma + vLLM",
    "full-stack: Next.js · Node · PostgreSQL",
    "Flutter apps on Frappe backends",
    "turning hospital data into insight"
  ],

  // tech "planets" orbiting the AI core in the hero (inner → outer ring)
  orbits: [
    ["Next.js", "Node.js", "PostgreSQL"],
    ["Flutter", "Frappe", "Python"],
    ["Gemma", "vLLM", "Docker", "StreamSets"]
  ],

  stats: [
    { value: 1,  suffix: "",  label: "Year of experience" },
    { value: 25, suffix: "+", label: "Projects handled" },
    { value: 95, suffix: "%", label: "ML gesture accuracy" },
    { text: "IEEE",           label: "Published research" }
  ],

  about: [
    "I'm an <strong>Application Developer</strong> in the Digital Transformation team at <strong>Amrita Institute of Medical Sciences, Kochi</strong>. I've handled <strong>25+ projects</strong> there, covering payroll, inventory, patient queues and management dashboards.",
    "My background is in <strong>Electronics &amp; Communication Engineering</strong> with a minor in Computer Science, which gave me a feel for both hardware and software. Today I mostly work across the stack: APIs, databases, data pipelines, mobile apps, and AI features using local LLMs.",
    "I like software that people depend on every day and that has to work with sensitive data."
  ],

  highlights: [
    { icon: "chat",  title: "LLM-powered assistants", text: "In-app AI chatbots built on Gemma and served with vLLM, so users get help inside the hospital workflow itself." },
    { icon: "chart", title: "Data & intelligence",    text: "StreamSets pipelines, SQL reporting and AURA dashboards that turn hospital data into decisions." },
    { icon: "spark", title: "Machine learning",       text: "Published in IEEE Xplore: real-time Malayalam speech-to-sign-language with 95% accuracy." }
  ],

  skills: {
    "Languages":              ["Python", "JavaScript", "TypeScript", "SQL", "Dart"],
    "Frontend & Mobile":      ["Next.js", "React.js", "Vue.js", "HTML5", "CSS3", "Flutter"],
    "Backend & Frameworks":   ["Node.js", "Express.js", "Frappe", "ERPNext", "REST APIs", "Workflow Automation"],
    "Databases":              ["PostgreSQL", "MySQL", "MariaDB", "MongoDB", "Firebase"],
    "Data & AI":              ["StreamSets", "AURA", "Data Pipelines", "Gemma", "vLLM", "LLMs"],
    "DevOps & Tools":         ["Docker", "Git", "GitHub", "Postman", "OneSignal", "FCM", "Android Studio"]
  },

  experience: [
    {
      role: "Application Developer",
      company: "Digital Transformation Team · Amrita Institute of Medical Sciences, Kochi",
      period: "1 Year — Present",
      points: [
        "Handled <b>25+ projects</b> and assisted on multiple others across administrative, financial and patient-facing hospital workflows.",
        "Currently building <b>PayrollX</b>, the hospital's salary calculation system and reporting dashboard (Next.js, Node.js, PostgreSQL).",
        "Built the <b>Materials Tracking System</b>, a Flutter mobile app with a Frappe backend for hospital stores.",
        "Delivered the <b>Dental Token System</b> for the Faculty Practice department.",
        "Built StreamSets data pipelines, SQL reports and AURA dashboards; added push notifications, Gemma/vLLM AI features and Docker-based deployments."
      ]
    },
    {
      role: "Embedded Systems & IoT Intern",
      company: "NEST Cyber Campus",
      period: "",
      points: [
        "Built Arduino/ARM firmware and real-time IoT monitoring dashboards using UART, SPI, I2C, Adafruit IO and Blynk."
      ]
    }
  ],

  projects: [
    { id: "payrollx", category: "work", featured: true, label: "In progress", live: true,
      title: "PayrollX — Salary Calculation & Reporting",
      summary: "Payroll platform that automates salary calculation for Amrita Hospital staff, with a reporting dashboard for HR and finance teams.",
      problem: "Salary processing for a large hospital workforce involves many pay components and manual reports that are slow to put together and easy to get wrong.",
      built: ["Salary calculation engine for hospital staff", "Reporting dashboard for HR and finance", "Next.js frontend with a Node.js API layer", "PostgreSQL schema for employees, pay components and payroll runs"],
      impact: "Moves payroll from manual calculation to a single automated system with consistent, on-demand reports.",
      stack: ["Next.js", "Node.js", "PostgreSQL"] },

    { id: "materials", category: "work", label: "Mobile + Backend",
      title: "Materials Tracking System",
      summary: "Tracks hospital store materials from indent to delivery: a Flutter app on a Frappe backend with push notifications and a Gemma-powered AI chatbot.",
      problem: "Hospital stores tracked indents, transfers and deliveries through paper and phone calls, so nobody could see where an item was.",
      built: ["Flutter mobile app for store and department staff", "Frappe backend covering indent → transfer → picking → checking → delivery", "Role-based workflows and REST APIs", "Real-time push notifications with OneSignal", "Gemma-powered AI chatbot for in-app help"],
      impact: "Every material movement is now trackable end to end, and staff get notified the moment an item needs action.",
      stack: ["Flutter", "Dart", "Frappe", "MariaDB", "REST APIs", "OneSignal", "Gemma"] },

    { id: "dental", category: "work", label: "Healthcare",
      title: "Dental Token System",
      summary: "Token and queue management for the Faculty Practice dental department, with live token display to keep patient flow moving.",
      problem: "Faculty Practice dental outpatients waited without knowing their position in the queue.",
      built: ["Token generation at registration", "Queue management for doctors and staff", "Live token display screens for waiting areas"],
      impact: "Patients can see where they are in the queue, and staff call patients in order without confusion.",
      stack: ["Queue Management", "Live Display"] },

    { id: "mis", category: "work", label: "Data",
      title: "MIS — Hospital Administration Dashboard",
      summary: "Central dashboard giving management a view of administrative and operational activity, built on SQL reports and StreamSets pipelines.",
      problem: "Management had no single view of administrative and operational activity across departments.",
      built: ["StreamSets pipelines to pull data from source systems", "SQL queries and reports", "AURA dashboards and visualizations"],
      impact: "Gives hospital leadership one dashboard for data-driven monitoring and decisions.",
      stack: ["Python", "SQL", "StreamSets", "AURA", "Frappe"] },

    { id: "exit", category: "work", label: "Workflow",
      title: "Student Exit Clearance System",
      summary: "Digital clearance across multiple departments, with role-based approvals, workflow automation, and digital signature and seal management.",
      problem: "Student exit clearance meant collecting physical signatures from many departments.",
      built: ["Multi-department approval workflow", "Role-based approvals", "Digital signature and seal management"],
      impact: "Students no longer need to run between departments for physical signatures, and every approval has a recorded trail.",
      stack: ["Python", "JavaScript", "Frappe", "Workflow Automation"] },

    { id: "feedback", category: "work", label: "Healthcare",
      title: "Patient Feedback System",
      summary: "Collects and analyzes patient experience data to support ongoing improvements in service quality.",
      problem: "Patient experience feedback was scattered and hard to act on.",
      built: ["Structured feedback capture", "Analysis and reporting of feedback data"],
      impact: "Feeds service quality improvement with organized patient experience data.",
      stack: ["Analytics", "Reporting"] },

    { id: "tracker", category: "work", label: "Web App",
      title: "Project Tracker",
      summary: "Manages projects, tasks and progress, giving teams a clear view of project status.",
      problem: "With 25+ projects running, the team needed one place to see status and progress.",
      built: ["Projects, tasks and progress tracking", "Status views for monitoring", "Vue.js frontend on REST APIs"],
      impact: "Clearer view of project status across the team.",
      stack: ["Vue.js", "Python", "JavaScript", "REST APIs", "SQL"] },

    { id: "msl", category: "academic", featured: true, label: "IEEE Xplore · KTU-Funded",
      title: "Real-Time Malayalam Speech-to-MSL Interpreter",
      summary: "Converts Malayalam speech into Malayalam Sign Language in real time, reaching 95% gesture recognition accuracy. District Champion at the Young Innovators Programme (YIP).",
      problem: "Deaf and hard-of-hearing people who use Malayalam Sign Language have very few tools that translate spoken Malayalam.",
      built: ["Real-time Malayalam speech recognition", "ML model mapping speech to MSL gestures", "Iterative training and evaluation cycles"],
      impact: "95% gesture recognition accuracy · District Champion at YIP · Funded by APJ Abdul Kalam Technological University · Published in IEEE Xplore.",
      stack: ["Python", "Machine Learning", "Speech Recognition"] },

    { id: "glove", category: "academic", label: "Hardware",
      title: "Sign Language to Text & Speech",
      summary: "Smart glove with flex sensors and Arduino that recognizes 50+ hand gestures and converts them to text and speech.",
      problem: "Signers need a way to talk with people who do not know sign language.",
      built: ["Smart glove with flex sensors", "Arduino-based gesture recognition", "Text and speech output"],
      impact: "Recognizes 50+ unique hand gestures.",
      stack: ["Arduino", "Flex Sensors", "C"] },

    { id: "farm", category: "academic", label: "Marketplace",
      title: "Farm Connect",
      summary: "Mobile and web marketplace that connects farmers directly with consumers, with listing, search and transaction flows.",
      problem: "Middlemen take a large share of the money between farmers and consumers.",
      built: ["Mobile and web marketplace", "Product listing, search and transaction flows"],
      impact: "Connects farmers directly with consumers.",
      stack: ["Mobile", "Web"] }
  ],

  education: {
    degree: "B.Tech — Electronics & Communication Engineering",
    detail: "Minor in Computer Science",
    school: "Federal Institute of Science and Technology (FISAT), Angamaly",
    period: "2021 — 2025",
    score: "CGPA 7.0",
    activities: "Class Representative (1st & 2nd year), coordinated placement drives for QBurst and Applied Materials. Student Member, IEEE."
  },

  certifications: [
    { name: "VEGA Processors & Ecosystem Workshop",             by: "C-DAC Trivandrum" },
    { name: "32-bit ARM Microcontroller & Arduino Systems",     by: "NEST Cyber Campus" },
    { name: "Business English Certificate (B1)",                by: "Cambridge English" }
  ],

  openTo: "roles in AI-powered software, full-stack development and healthcare tech",

  // Extra answers for the AI chat. "k" = trigger keywords, "a" = answer.
  faq: [
    { k: ["why", "strength", "different", "unique", "should we"],
      a: "Three things stand out: <b>real production experience</b> (25+ hospital projects), <b>AI features he has actually shipped</b> (not only tutorials), and <b>domain knowledge</b> of hospital workflows and sensitive data, which most developers don't have." },
    { k: ["frappe", "erpnext", "erp"],
      a: "He builds on the <b>Frappe Framework / ERPNext</b> every day: role-based workflows, approvals, REST APIs and mobile backends (Materials Tracking, Student Exit Clearance, MIS)." },
    { k: ["docker", "devops", "deploy", "cloud"],
      a: "He uses <b>Docker</b> for containerized deployments, along with Git/GitHub and Postman in his daily workflow." },
    { k: ["data", "pipeline", "dashboard", "streamsets", "aura", "report"],
      a: "He builds data pipelines in <b>StreamSets</b>, writes SQL reports, and makes dashboards in <b>AURA</b>, including the hospital's MIS administration dashboard." },
    { k: ["ai", "llm", "gemma", "vllm", "machine learning", "ml", "genai", "chatbot", "artificial"],
      a: "AI work so far:<br>• A <b>Gemma-powered chatbot</b> inside the Materials Tracking app<br>• Local LLM serving with <b>vLLM</b><br>• A <b>Malayalam speech-to-sign-language</b> ML system with 95% accuracy, published in IEEE Xplore" }
  ]
};
