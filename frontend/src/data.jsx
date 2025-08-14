
import { IndianRupee, Receipt, TrendingUp } from "lucide-react";

import p1 from "./assets/p1.jpg";
import p2 from "./assets/p2.jpg";
import p3 from "./assets/p3.jpg";
import p4 from "./assets/p4.jpg";
import p5 from "./assets/p5.jpg";
import p6 from "./assets/p6.jpg";
import p7 from "./assets/p7.jpg";
import p8 from "./assets/p8.jpg";

const employees = [
  {
    id: "EMP001",
    name: "Ravi Kumar",
    image: p1,
    email: "rk@gmail.com",
    phone: "+91-9876543210",
    designation: "Frontend Developer",
    department: "Engineering",
    projectId: "PRJ001",
    project: "CRM Redesign",
    status: "Active",
    joiningDate: "2022-04-15",
  },
  {
    id: "EMP002",
    name: "Anjali Mehta",
    image: p2,
    email: "am@gmail.com",
    phone: "+91-9876501234",
    designation: "Backend Developer",
    department: "Engineering",
    projectId: "PRJ005",
    project: "Recruitment System",
    status: "Active",
    joiningDate: "2021-12-01",
  },
  {
    id: "EMP003",
    name: "Soham Roy",
    image: p3,
    email: "soham.roy@gmail.com",
    phone: "+91-9876532198",
    designation: "UI/UX Designer",
    department: "Design",
    projectId: "PRJ001",
    project: "CRM Redesign",
    status: "Active",
    joiningDate: "2023-01-10",
  },
  {
    id: "EMP004",
    name: "Nikita Sharma",
    image: p4,
    email: "nikita.sharma@gmail.com",
    phone: "+91-9867543210",
    designation: "QA Engineer",
    department: "Quality Assurance",
    projectId: "PRJ007",
    project: "E-Commerce Platform",
    status: "Active",
    joiningDate: "2022-07-22",
  },
  {
    id: "EMP005",
    name: "Arjun Verma",
    image: p5,
    email: "arjun.verma@gmail.com",
    phone: "+91-9845671234",
    designation: "DevOps Engineer",
    department: "Infrastructure",
    projectId: "PRJ003",
    project: "Payment Gateway",
    status: "Inactive",
    joiningDate: "2020-09-01",
  },
  {
    id: "EMP006",
    name: "Priya Desai",
    image: p6,
    email: "priya.desai@gmail.com",
    phone: "+91-9898989898",
    designation: "Product Manager",
    department: "Product",
    projectId: "PRJ009",
    project: "Learning Portal",
    status: "Active",
    joiningDate: "2021-05-15",
  },
  {
    id: "EMP007",
    name: "Manav Singh",
    image: p7,
    email: "manav.singh@gmail.com",
    phone: "+91-9876123456",
    designation: "Mobile Developer",
    department: "Engineering",
    projectId: "PRJ004",
    project: "Delivery App",
    status: "On Leave",
    joiningDate: "2022-10-20",
  },
  {
    id: "EMP008",
    name: "Kavya Iyer",
    image: p8,
    email: "kavya.iyer@gmail.com",
    phone: "+91-9765432109",
    designation: "HR Executive",
    department: "Human Resources",
    projectId: "PRJ010",
    project: "Onboarding System",
    status: "Active",
    joiningDate: "2023-02-01",
  },
];

export default employees;


export const projects = [
  {
    "projectId": "PRJ001",
    "title": "CRM Redesign",
    "description": "Redesign the customer relationship management system UI/UX and backend API integrations.",
    "manager": "Nikita Sharma",
    "email": "nikita.sharma@crmteam.com",
    "Skill": "ReactJS, Figma, Spring Boot, REST APIs",
    "tool": "Jira, Postman, GitHub, Figma",
    "status": "Ongoing"
  },
  {
    "projectId": "PRJ002",
    "title": "Inventory Tracker",
    "description": "A full-stack system to manage warehouse inventories with QR scanning and alerts.",
    "manager": "Ravi Kumar",
    "email": "ravi.kumar@crmteam.com",
    "Skill": "Java, Angular, MongoDB, QR SDK",
    "tool": "IntelliJ, Jenkins, GitLab, Firebase",
    "status": "Completed"
  },
  {
    "projectId": "PRJ003",
    "title": "Employee Portal",
    "description": "Build a role-based employee self-service portal for HR-related actions.",
    "manager": "Anjali Mehta",
    "email": "anjali.mehta@crmteam.com",
    "Skill": "ReactJS, Node.js, Express, JWT Auth",
    "tool": "VS Code, Postman, GitHub Actions, MongoDB Compass",
    "status": "Ongoing"
  },
  {
    "projectId": "PRJ004",
    "title": "E-Commerce Analytics",
    "description": "Analytics dashboard for tracking product performance and user trends.",
    "manager": "Arjun Patel",
    "email": "arjun.patel@crmteam.com",
    "Skill": "Python, Pandas, D3.js, ReactJS",
    "tool": "Tableau, Jupyter, VS Code, Git",
    "status": "Pending"
  },
  {
    "projectId": "PRJ005",
    "title": "Recruitment System",
    "description": "Automated recruitment pipeline management with resume parsing and scheduling.",
    "manager": "Divya Singh",
    "email": "divya.singh@crmteam.com",
    "Skill": "Node.js, Express, NLP, ReactJS",
    "tool": "Nodemailer, GitHub, Docker, VS Code",
    "status": "Ongoing"
  }
]

export const faqs = [
  {
    question: 'How do I raise a ticket?',
    answer: 'Click on the "Raise a Ticket" button and fill out the form with all necessary details about the issue.'
  },
  {
    question: 'How long does support take to respond?',
    answer: 'Our support team typically responds within 24-48 hours during business days.'
  },
  {
    question: 'Where can I track my ticket status?',
    answer: 'After submitting, you’ll receive a ticket ID. You can track it under the "My Tickets" section.'
  }
];

export const salaryBreakdown = {
    netSalary: 4200,
    baseSalary: 3000,
    allowances: 800,
    deductions: 600,
    bonus: 200,
  };

export const payslips = [
    { month: 'July 2024', date: '2024-07-30', amount: 4200 },
    { month: 'June 2024', date: '2024-06-30', amount: 4200 },
    { month: 'May 2024', date: '2024-05-30', amount: 4000 },
  ];
export const salary = [
  {
    label: "Net Salary",
    value: salaryBreakdown.netSalary,
    color: "green",
    icon: <IndianRupee className="h-5 w-5 text-green-600" />,
  },
  {
    label: "Base Salary",
    value: salaryBreakdown.baseSalary,
    color: "indigo",
    icon: <TrendingUp className="h-5 w-5 text-indigo-600" />,
  },
  {
    label: "Allowances",
    value: salaryBreakdown.allowances,
    color: "blue",
    icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
  },
  {
    label: "Deductions",
    value: salaryBreakdown.deductions,
    color: "red",
    icon: <Receipt className="h-5 w-5 text-red-600" />,
  },
]

export const monthBreadown=
[
  { label: 'Base Salary', amount: salaryBreakdown.baseSalary, type: 'positive' },
  { label: 'Housing Allowance', amount: 400, type: 'positive' },
  { label: 'Transport Allowance', amount: 200, type: 'positive' },
  { label: 'Medical Allowance', amount: 200, type: 'positive' },
  { label: 'Performance Bonus', amount: salaryBreakdown.bonus, type: 'positive' },
  { label: 'Income Tax', amount: -800, type: 'negative' },
  { label: 'Social Security', amount: -200, type: 'negative' },
  { label: 'Health Insurance', amount: -200, type: 'negative' },
]


export const attendance = [
  {
    employeeId: "EMP001",
    records: [
      {
        date: "2025-08-08",
        present: true,
        checkIn: "09:30 AM",
        checkOut: "06:10 PM"
      },
      {
        date: "2025-08-07",
        present: true,
        checkIn: "09:30 AM",
        checkOut: "06:10 PM"
      },
      {
        date: "2025-08-06",
        present: false,
        checkIn: "",
        checkOut: ""
      }
    ]
  },
  {
    employeeId: "EMP002",
    records: [
      {
        date: "2025-08-08",
        present: true,
        checkIn: "09:30 AM",
        checkOut: "06:10 PM"
      },
      {
        date: "2025-08-07",
        present: false,
        checkIn: "",
        checkOut: ""
      },
      {
        date: "2025-08-06",
        present: true,
        checkIn: "09:30 AM",
        checkOut: "06:10 PM"
      }
    ]
  }
];
