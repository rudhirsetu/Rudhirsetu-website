export default function Loading() {
  return (
    <div className="pt-[100px] pb-12 sm:pb-16">
      <div className="container mx-auto px-4 animate-pulse">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="w-32 h-8 bg-gray-200 rounded-full mx-auto mb-6"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto"></div>
        </div>

        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded-lg w-64"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
              <div className="relative h-48 sm:h-56 md:h-64 bg-gray-200"></div>
              <div className="p-4 sm:p-6 md:p-8 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
