import { Tool, ToolCategory } from "../types/tools";

export const categories: ToolCategory[] = [
  {
    name: "Encoding",
    tools: [
      {
        name: "JWT Generator",
        path: "/jwt-generator",
        premium: false,
        description: "Generate and verify JSON Web Tokens",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        ),
        category: "Encoding",
      },
      {
        name: "Base64 Converter",
        path: "/base64-converter",
        premium: false,
        description: "Encode and decode Base64 strings",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <path d="M4 15v3c0 1.1.9 2 2 2h3"></path>
            <path d="M4 9v3"></path>
            <path d="M20 9v3"></path>
            <path d="M15 4h3c1.1 0 2 .9 2 2v3"></path>
            <path d="m14 15-9-9"></path>
            <path d="m19 10-9 9"></path>
          </svg>
        ),
        category: "Encoding",
      },
      {
        name: "URL Encoder",
        path: "/url-encoder",
        premium: false,
        description: "Encode and decode URLs",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        ),
        category: "Encoding",
      },
    ],
  },
  {
    name: "Data Conversion",
    tools: [
      {
        name: "JSON to YAML",
        path: "/json-to-yaml",
        premium: false,
        description: "Convert between JSON and YAML formats",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        ),
        category: "Data Conversion",
      },
      {
        name: "CSV to JSON",
        path: "/csv-to-json",
        premium: true,
        description: "Convert CSV data to JSON format and vice versa",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <path d="M21 15V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8"></path>
            <path d="M16 2v4"></path>
            <path d="M8 2v4"></path>
            <path d="M3 10h18"></path>
            <circle cx="18" cy="18" r="3"></circle>
            <path d="m21 21-2-2"></path>
          </svg>
        ),
        category: "Data Conversion",
      },
      {
        name: "XML Formatter",
        path: "/xml-formatter",
        premium: false,
        description: "Format and validate XML documents",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        ),
        category: "Data Conversion",
      },
    ],
  },
  {
    name: "Security",
    tools: [
      {
        name: "Password Generator",
        path: "/password-generator",
        premium: false,
        description: "Generate strong random passwords",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        ),
        category: "Security",
      },
      {
        name: "Hash Generator",
        path: "/hash-generator",
        premium: false,
        description: "Generate MD5, SHA-1, SHA-256 and other hashes",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <rect x="2" y="6" width="20" height="12" rx="2"></rect>
            <path d="M6 12h4"></path>
            <path d="M14 12h4"></path>
          </svg>
        ),
        category: "Security",
      },
      {
        name: "Encryption Tool",
        path: "/encryption-tool",
        premium: true,
        description: "Encrypt and decrypt text using various algorithms",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 1 0 9 4.5 4.5 0 0 1-5-4.5 4.5 4.5 0 0 1 5-4.5 4.5 4.5 0 0 0 5-4.5 4.5 4.5 0 0 0-5-4.5Z"></path>
          </svg>
        ),
        category: "Security",
      },
    ],
  },
  {
    name: "Text Processing",
    tools: [
      {
        name: "Text Diff Checker",
        path: "/text-diff",
        premium: false,
        description: "Compare two texts and highlight differences",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <path d="M21 9V6a2 2 0 0 0-2-2H9"></path>
            <path d="M3 16v3a2 2 0 0 0 2 2h14"></path>
            <path d="m9 18 3-3-3-3"></path>
            <path d="m15 6-3 3 3 3"></path>
          </svg>
        ),
        category: "Text Processing",
      },
      {
        name: "Markdown Editor",
        path: "/markdown-editor",
        premium: true,
        description: "Write and preview Markdown with syntax highlighting",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
            <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
            <path d="M9 17h6"></path>
            <path d="M9 13h6"></path>
          </svg>
        ),
        category: "Text Processing",
      },
      {
        name: "Text Case Converter",
        path: "/text-case-converter",
        premium: false,
        description:
          "Convert text to uppercase, lowercase, title case and more",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <polyline points="4 7 4 4 20 4 20 7"></polyline>
            <line x1="9" y1="20" x2="15" y2="20"></line>
            <line x1="12" y1="4" x2="12" y2="20"></line>
          </svg>
        ),
        category: "Text Processing",
      },
    ],
  },
  {
    name: "Development",
    tools: [
      {
        name: "Regex Tester",
        path: "/regex-tester",
        premium: false,
        description: "Test and debug regular expressions",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <path d="M17 3v10"></path>
            <path d="m12.67 5.5 8.66 5"></path>
            <path d="m12.67 10.5 8.66-5"></path>
            <path d="M9 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2z"></path>
          </svg>
        ),
        category: "Development",
      },
      {
        name: "Code Formatter",
        path: "/code-formatter",
        premium: true,
        description: "Format and beautify code in various languages",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <path d="m18 16 4-4-4-4"></path>
            <path d="m6 8-4 4 4 4"></path>
            <path d="m14.5 4-5 16"></path>
          </svg>
        ),
        category: "Development",
      },
      {
        name: "API Tester",
        path: "/api-tester",
        premium: false,
        description: "Test API endpoints with various HTTP methods",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <path d="M3 3v18h18"></path>
            <path d="m9 9 3 3-3 3"></path>
            <path d="M14 15h1"></path>
            <path d="M19 15h2"></path>
            <path d="M19 11h2"></path>
            <path d="M14 11h1"></path>
            <path d="M14 7h1"></path>
            <path d="M19 7h2"></path>
          </svg>
        ),
        category: "Development",
      },
    ],
  },
];

// Helper function to get a flat list of all tools
export const getAllTools = (): Tool[] => {
  return categories.flatMap((category) => category.tools);
};
