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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="h-[400px] bg-gray-200 rounded-xl"></div>
          <div className="space-y-8">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-40 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
