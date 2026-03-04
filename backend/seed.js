import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ============================================================
// CONFIG
// ============================================================
const MONGODB_URL =
    "mongodb+srv://abhi:abhinav@resume.qvnwd9z.mongodb.net/AILMS?retryWrites=true&w=majority&appName=Resume";

// ============================================================
// MODELS
// ============================================================

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        description: { type: String },
        role: { type: String, enum: ["educator", "student"], required: true },
        photoUrl: { type: String, default: "" },
        enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
        resetOtp: { type: String },
        otpExpires: { type: Date },
        isOtpVerifed: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const lectureSchema = new mongoose.Schema(
    {
        lectureTitle: { type: String, required: true },
        videoUrl: { type: String },
        isPreviewFree: { type: Boolean },
    },
    { timestamps: true }
);

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        subTitle: { type: String },
        description: { type: String },
        category: { type: String, required: true },
        level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
        price: { type: Number },
        thumbnail: { type: String },
        enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }],
        creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        isPublished: { type: Boolean, default: false },
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Lecture = mongoose.model("Lecture", lectureSchema);
const Course = mongoose.model("Course", courseSchema);

// ============================================================
// FREE THUMBNAIL IMAGES (Picsum - always works, no API needed)
// ============================================================
const thumbnails = [
    "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80", // Web Dev
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80", // React
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80", // Python
    "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80", // ML
    "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=800&q=80", // AI Tools
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80", // App Dev
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", // Hacking
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", // Data Analytics
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80", // UI/UX
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80", // Deep Learning
];

// Free sample videos (Big Buck Bunny clips - public domain)
const sampleVideos = [
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://www.w3schools.com/html/movie.mp4",
    "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
];

// ============================================================
// COURSE DATA
// ============================================================
const coursesData = [
    {
        title: "Complete Web Development Bootcamp",
        subTitle: "Master HTML, CSS, JavaScript, Node.js & MongoDB from scratch",
        description:
            "This comprehensive web development bootcamp takes you from absolute beginner to a professional full-stack developer. You'll learn HTML5, CSS3, JavaScript ES6+, React.js, Node.js, Express.js, and MongoDB. By the end of this course, you'll be able to build real-world web applications and deploy them to production. Perfect for beginners who want to start a career in web development.",
        category: "Web Development",
        level: "Beginner",
        price: 499,
        thumbnail: thumbnails[0],
        lectures: [
            { title: "Introduction to Web Development", free: true },
            { title: "HTML5 Fundamentals & Semantic Elements", free: true },
            { title: "CSS3 & Flexbox Layouts", free: false },
            { title: "JavaScript ES6+ Basics", free: false },
            { title: "Building Your First Website", free: false },
        ],
    },
    {
        title: "Advanced React & Next.js Masterclass",
        subTitle: "Build production-ready apps with React 18, Next.js 14 & TypeScript",
        description:
            "Take your React skills to the next level with this advanced course covering React 18 features, Next.js 14 App Router, TypeScript integration, state management with Redux Toolkit, React Query, authentication, and deployment. You'll build 3 complete production-ready projects including an e-commerce platform and a social media app.",
        category: "Web Development",
        level: "Advanced",
        price: 799,
        thumbnail: thumbnails[1],
        lectures: [
            { title: "React 18 New Features Overview", free: true },
            { title: "Next.js 14 App Router Deep Dive", free: true },
            { title: "TypeScript with React", free: false },
            { title: "Redux Toolkit & State Management", free: false },
            { title: "Authentication with NextAuth.js", free: false },
        ],
    },
    {
        title: "Python for Data Science",
        subTitle: "Learn Python, Pandas, NumPy, Matplotlib & Scikit-learn",
        description:
            "Start your data science journey with Python. This beginner-friendly course covers Python basics, data manipulation with Pandas, numerical computing with NumPy, data visualization with Matplotlib and Seaborn, and machine learning fundamentals with Scikit-learn. You'll work on real datasets and build a complete data science portfolio by the end.",
        category: "Data Science",
        level: "Beginner",
        price: 599,
        thumbnail: thumbnails[2],
        lectures: [
            { title: "Python Basics for Data Science", free: true },
            { title: "NumPy Arrays & Operations", free: true },
            { title: "Data Manipulation with Pandas", free: false },
            { title: "Data Visualization with Matplotlib", free: false },
            { title: "Introduction to Scikit-learn", free: false },
        ],
    },
    {
        title: "Machine Learning A-Z",
        subTitle: "Complete ML course with Python & real-world projects",
        description:
            "Master machine learning from theory to practice. This course covers supervised learning (regression, classification), unsupervised learning (clustering, dimensionality reduction), ensemble methods, neural networks, model evaluation, and hyperparameter tuning. You'll implement algorithms from scratch and use industry-standard libraries like Scikit-learn, XGBoost, and TensorFlow.",
        category: "AI/ML",
        level: "Intermediate",
        price: 899,
        thumbnail: thumbnails[3],
        lectures: [
            { title: "Introduction to Machine Learning", free: true },
            { title: "Linear & Logistic Regression", free: true },
            { title: "Decision Trees & Random Forests", free: false },
            { title: "Support Vector Machines", free: false },
            { title: "Model Evaluation & Hyperparameter Tuning", free: false },
        ],
    },
    {
        title: "ChatGPT & AI Tools Mastery",
        subTitle: "Boost your productivity 10x with AI tools in 2024",
        description:
            "Learn to leverage the power of AI tools to supercharge your productivity. This course covers ChatGPT advanced prompting, Midjourney for image generation, GitHub Copilot for coding, Notion AI for writing, and 20+ other AI tools. Whether you're a student, professional, or entrepreneur, this course will transform how you work.",
        category: "AI Tools",
        level: "Beginner",
        price: 399,
        thumbnail: thumbnails[4],
        lectures: [
            { title: "Introduction to AI Tools Ecosystem", free: true },
            { title: "ChatGPT Advanced Prompting Techniques", free: true },
            { title: "AI Image Generation with Midjourney", free: false },
            { title: "GitHub Copilot for Developers", free: false },
            { title: "Building an AI-Powered Workflow", free: false },
        ],
    },
    {
        title: "Flutter App Development Bootcamp",
        subTitle: "Build iOS & Android apps with Flutter & Dart from scratch",
        description:
            "Learn to build beautiful, high-performance mobile apps for both iOS and Android using Flutter and Dart. This course covers Dart programming, Flutter widgets, state management with Provider and Riverpod, Firebase integration, REST APIs, local storage, animations, and publishing to App Store and Google Play. Build 5 real apps throughout the course.",
        category: "App Development",
        level: "Intermediate",
        price: 699,
        thumbnail: thumbnails[5],
        lectures: [
            { title: "Introduction to Flutter & Dart", free: true },
            { title: "Flutter Widgets & Layouts", free: true },
            { title: "State Management with Riverpod", free: false },
            { title: "Firebase Integration & Authentication", free: false },
            { title: "Publishing Your App to Stores", free: false },
        ],
    },
    {
        title: "Ethical Hacking Complete Course",
        subTitle: "Learn penetration testing, cybersecurity & ethical hacking",
        description:
            "Become a certified ethical hacker and cybersecurity professional. This comprehensive course covers network hacking, web application security, system hacking, social engineering, cryptography, and penetration testing methodologies. You'll use industry-standard tools like Kali Linux, Metasploit, Wireshark, Burp Suite, and Nmap. All techniques are taught in a legal, controlled environment.",
        category: "Ethical Hacking",
        level: "Advanced",
        price: 999,
        thumbnail: thumbnails[6],
        lectures: [
            { title: "Introduction to Ethical Hacking & Kali Linux", free: true },
            { title: "Network Scanning with Nmap", free: true },
            { title: "Web Application Penetration Testing", free: false },
            { title: "Exploitation with Metasploit", free: false },
            { title: "Writing a Professional Pentest Report", free: false },
        ],
    },
    {
        title: "Data Analytics with Excel & Power BI",
        subTitle: "Master data analysis, dashboards & business intelligence",
        description:
            "Transform raw data into powerful business insights. This course teaches you Excel advanced functions (VLOOKUP, pivot tables, macros), Power BI dashboard creation, DAX formulas, data modeling, SQL basics, and storytelling with data. By the end you'll be able to create professional dashboards and reports that drive business decisions.",
        category: "Data Analytics",
        level: "Beginner",
        price: 499,
        thumbnail: thumbnails[7],
        lectures: [
            { title: "Excel Fundamentals for Data Analysis", free: true },
            { title: "Pivot Tables & Advanced Functions", free: true },
            { title: "Introduction to Power BI", free: false },
            { title: "DAX Formulas & Data Modeling", free: false },
            { title: "Building Interactive Dashboards", free: false },
        ],
    },
    {
        title: "UI/UX Design Masterclass",
        subTitle: "Design stunning interfaces with Figma from scratch to pro",
        description:
            "Learn the complete UI/UX design process from research to final handoff. This course covers design thinking, user research, wireframing, prototyping, visual design principles, Figma mastery, design systems, accessibility, and portfolio building. You'll design 4 complete projects including a mobile app and a web platform, ready to show to clients or employers.",
        category: "UI UX Designing",
        level: "Intermediate",
        price: 599,
        thumbnail: thumbnails[8],
        lectures: [
            { title: "Introduction to UI/UX Design Thinking", free: true },
            { title: "Figma Basics & Interface Tour", free: true },
            { title: "Wireframing & Prototyping", free: false },
            { title: "Visual Design Principles & Typography", free: false },
            { title: "Building a Design System", free: false },
        ],
    },
    {
        title: "Deep Learning & Neural Networks",
        subTitle: "Master CNNs, RNNs, Transformers & LLMs with TensorFlow",
        description:
            "Dive deep into the world of deep learning and artificial intelligence. This advanced course covers neural network architectures, convolutional neural networks (CNNs) for computer vision, recurrent neural networks (RNNs) for NLP, transformer architecture, BERT, GPT models, transfer learning, and deploying models to production. Build cutting-edge AI applications.",
        category: "AI/ML",
        level: "Advanced",
        price: 1299,
        thumbnail: thumbnails[9],
        lectures: [
            { title: "Neural Networks from Scratch", free: true },
            { title: "Convolutional Neural Networks (CNN)", free: true },
            { title: "Recurrent Networks & LSTMs", free: false },
            { title: "Transformer Architecture & Attention", free: false },
            { title: "Fine-tuning LLMs & Deployment", free: false },
        ],
    },
];

// ============================================================
// SEEDER FUNCTION
// ============================================================
async function seed() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URL);
        console.log("✅ Connected to MongoDB!\n");

        // ------ CREATE EDUCATOR ------
        console.log("👤 Creating educator account...");
        const existingUser = await User.findOne({ email: "educator@ailms.com" });
        let educator;

        if (existingUser) {
            console.log("⚠️  Educator already exists, using existing account.");
            educator = existingUser;
        } else {
            const hashedPassword = await bcrypt.hash("Educator@123", 10);
            educator = await User.create({
                name: "Alex Johnson",
                email: "educator@ailms.com",
                password: hashedPassword,
                role: "educator",
                description:
                    "Senior Software Engineer & Educator with 10+ years of experience in Web Development, AI/ML, and Data Science. Passionate about making tech education accessible to everyone.",
                photoUrl:
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
            });
            console.log("✅ Educator created!");
            console.log("   📧 Email: educator@ailms.com");
            console.log("   🔑 Password: Educator@123\n");
        }

        // ------ CREATE COURSES ------
        console.log("📚 Creating 10 courses with lectures...\n");

        for (let i = 0; i < coursesData.length; i++) {
            const courseInfo = coursesData[i];
            console.log(`📖 Creating course ${i + 1}/10: ${courseInfo.title}`);

            // Create lectures
            const lectureIds = [];
            for (const lec of courseInfo.lectures) {
                const lecture = await Lecture.create({
                    lectureTitle: lec.title,
                    videoUrl: sampleVideos[i % sampleVideos.length],
                    isPreviewFree: lec.free,
                });
                lectureIds.push(lecture._id);
            }

            // Create course
            const course = await Course.create({
                title: courseInfo.title,
                subTitle: courseInfo.subTitle,
                description: courseInfo.description,
                category: courseInfo.category,
                level: courseInfo.level,
                price: courseInfo.price,
                thumbnail: courseInfo.thumbnail,
                creator: educator._id,
                lectures: lectureIds,
                isPublished: true,
            });

            console.log(
                `   ✅ Created with ${lectureIds.length} lectures | ₹${courseInfo.price} | ${courseInfo.level}`
            );
        }

        console.log("\n🎉 All done! Here's your summary:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("👤 Educator Login:");
        console.log("   Email    : educator@ailms.com");
        console.log("   Password : Educator@123");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📚 10 Courses Created & Published");
        console.log("🎬 5 Lectures per course (2 free preview)");
        console.log("🖼️  Thumbnails from Unsplash");
        console.log("🎥 Sample videos added");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\n✅ Go to your website and check!");

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
}

seed();