import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-700 to-green-900 dark:from-green-900 dark:to-green-950 text-white transition-colors duration-300 z-20 relative">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Rights Text on the left */}
          <div className="text-sm">
            <p>&copy; 2025 CropShield. All rights reserved.</p>
          </div>

          {/* GitHub Link */}
          <div>
            <a href="https://github.com/KT1205/CropShield.git" className="text-white hover:text-green-200 transition-colors duration-200">
              <span className="sr-only">GitHub</span>
              <FaGithub className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



