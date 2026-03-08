import Link from "next/link";

export default function FloatingFranchise({ franchiseName }) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
      <Link
        href="#contact"
        className="inline-flex items-center px-6 py-3 bg-red-500 text-center text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-sm md:text-base"
      >
        Learn more about {franchiseName}
      </Link>
    </div>
  );
}
