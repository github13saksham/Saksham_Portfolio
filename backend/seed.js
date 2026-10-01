const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with updated resume data...');

  // 1. Clear old data
  await prisma.experience.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.skill.deleteMany({});
  console.log('Old records cleared!');

  // 2. Seed Experiences
  const experiences = [
    {
      type: "job",
      date: "May 2026 – Present",
      title: "Full Stack Developer Intern",
      subtitle: "Primus Partners Solution Pvt Ltd | India",
      description: "Built the PrimusOne website end-to-end in Next.js, including responsive pages, a CMS admin portal for live content preview, and a local PostgreSQL backend with database seeding. Developed responsive UI pages for the Choice (Parivar Pehchan Patra, Uttarakhand) and MPIDC projects, focusing on reusable components and cross-device compatibility."
    },
    {
      type: "job",
      date: "Aug 2025 – Jan 2026",
      title: "Full Stack Developer Intern",
      subtitle: "DOT Defence | India",
      description: "Delivered full-stack features using React.js, Node.js, and MongoDB from spec to deployment. Partnered with the team to debug and optimize production issues."
    },
    {
      type: "job",
      date: "May 2025 – Jul 2025",
      title: "Frontend Developer Intern",
      subtitle: "Primus Partners Solution Pvt Ltd | India",
      description: "Built the login flow and multilingual family dashboard for a government portal using React.js, Tailwind CSS, and i18next. Coordinated with backend engineers on API integration and accessibility fixes."
    },
    {
      type: "education",
      date: "2022 – 2026",
      title: "B.Tech, Computer Science Engineering",
      subtitle: "Sharda University",
      description: "Focusing on full-stack development, AI, and scalable backend architectures. Deepened skills in Machine Learning and Deep Learning."
    }
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log('Experiences seeded!');

  // 3. Seed Projects
  const projects = [
    {
      name: "Leveraging AI for Precise Cost Estimation",
      description: "Built a model to predict software project costs with higher accuracy than traditional methods. Added a predictive analytics dashboard comparing estimated vs. actual cost for validation. Published Research at ICSDS-2025.",
      html_url: "https://github.com/github13saksham",
      language: "Python",
      stargazers_count: 12,
      forks_count: 3
    },
    {
      name: "The Fútbol Store – Live E-commerce Platform",
      description: "Independently designed and shipped a live e-commerce platform for premium and retro football jerseys, covering storefront, cart, and checkout. Integrated Cashfree payment gateway & Firebase admin backend.",
      html_url: "https://thefutbolstore.in",
      language: "TypeScript",
      stargazers_count: 18,
      forks_count: 4
    },
    {
      name: "Facial Recognition System",
      description: "Trained a face recognition model integrating machine learning and deep learning algorithms. Built a MySQL-backed pipeline to store and match face embeddings with a Tkinter UI.",
      html_url: "https://github.com/github13saksham",
      language: "Python",
      stargazers_count: 24,
      forks_count: 5
    },
    {
      name: "Emotion Detection from Facial Images",
      description: "Built and evaluated a CNN for emotion classification from facial images. Covered data preprocessing, train/validation/test splitting, and model performance evaluation.",
      html_url: "https://github.com/github13saksham",
      language: "Jupyter",
      stargazers_count: 15,
      forks_count: 2
    }
  ];

  for (const proj of projects) {
    await prisma.project.create({ data: proj });
  }
  console.log('Projects seeded!');

  // 4. Seed Certificates
  const certificates = [
    {
      date: "Completed",
      title: "AWS – Amazon Web Services (30 hrs)",
      issuer: "AWS",
      description: "Comprehensive training covering AWS core services, deployment, and cloud architecture.",
      link: ""
    },
    {
      date: "Completed",
      title: "Generative AI: Introduction & Applications",
      issuer: "IBM",
      description: "Deep dive into foundational Generative AI models, prompt engineering, and business applications.",
      link: ""
    },
    {
      date: "Completed",
      title: "Python Bootcamp",
      issuer: "Udemy",
      description: "Advanced Python programming encompassing data structures, algorithms, and full-stack integration.",
      link: ""
    },
    {
      date: "In Progress",
      title: "Generative AI",
      issuer: "GeeksforGeeks",
      description: "Exploring advanced AI topics including LLMs, RAG pipelines, and vector databases.",
      link: ""
    }
  ];

  for (const cert of certificates) {
    await prisma.certificate.create({ data: cert });
  }
  console.log('Certificates seeded!');

  // 5. Seed Skills for 3D Revolving Stack & Detailed Skills
  const skills = [
    { category: 'Languages', name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: '#3776AB' },
    { category: 'Languages', name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', color: '#F7DF1E' },
    { category: 'Languages', name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg', color: '#A8B9CC' },
    { category: 'Languages', name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', color: '#4479A1' },
    
    { category: 'ML / AI', name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg', color: '#FF6F00' },
    { category: 'ML / AI', name: 'Keras', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg', color: '#D00000' },
    { category: 'ML / AI', name: 'scikit-learn', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg', color: '#F7931E' },
    { category: 'ML / AI', name: 'OpenCV', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg', color: '#5C3EE8' },
    { category: 'ML / AI', name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg', color: '#150458' },
    { category: 'ML / AI', name: 'NumPy', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg', color: '#013243' },

    { category: 'Frontend', name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', color: '#E34F26' },
    { category: 'Frontend', name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', color: '#1572B6' },
    { category: 'Frontend', name: 'React.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: '#61DAFB' },
    { category: 'Frontend', name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', color: '#FFFFFF' },

    { category: 'Backend', name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: '#339933' },
    { category: 'Backend', name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', color: '#FFFFFF' },

    { category: 'Databases', name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', color: '#47A248' },
    { category: 'Databases', name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', color: '#4169E1' },
    { category: 'Databases', name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', color: '#4479A1' },
    { category: 'Databases', name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg', color: '#FFCA28' },

    { category: 'Tools & DevOps', name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', color: '#F05032' },
    { category: 'Tools & DevOps', name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', color: '#FFFFFF' },
    { category: 'Tools & DevOps', name: 'Postman', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg', color: '#FF6C37' },
    { category: 'Tools & DevOps', name: 'Jupyter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg', color: '#F37626' }
  ];

  for (const sk of skills) {
    await prisma.skill.create({ data: sk });
  }
  console.log('Skills seeded!');

  console.log('Database seeding complete successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
