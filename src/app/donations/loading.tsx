export default function Loading() {
  return (
    <div className="py-12 pt-[100px]">
      <div className="container mx-auto px-4 animate-pulse">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-24 h-8 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-1/3 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-2/3 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-72 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
