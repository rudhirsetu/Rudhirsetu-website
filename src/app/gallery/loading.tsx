export default function Loading() {
  return (
    <div className="pt-[100px] pb-16 sm:pb-24">
      <div className="container mx-auto px-4 sm:px-8 animate-pulse">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-32 h-8 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto"></div>
        </div>

        <div className="h-[400px] bg-gray-200 rounded-2xl mb-12"></div>

        <div className="flex justify-between mb-8">
          <div className="h-8 bg-gray-200 rounded-lg w-40"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-64"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
