export function AppSkeleton() {
  return (
    <div className="w-full h-full p-4 space-y-4">
      {/* 헤더 스켈레톤 */}
      <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
      
      {/* 컨텐츠 스켈레톤 */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
      </div>

      {/* 카드 스켈레톤 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      
      {/* 아바타와 텍스트가 있는 리스트 스켈레톤 */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
