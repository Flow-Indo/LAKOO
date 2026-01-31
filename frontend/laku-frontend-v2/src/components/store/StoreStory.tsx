interface StoreStoryProps {
  story: {
    about: string;
    mission: string;
    founded: string;
  };
  storeName: string;
}

export default function StoreStory({ story, storeName }: StoreStoryProps) {
  return (
    <div className="py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Tentang {storeName}
      </h2>

      <div className="space-y-4">
        {/* About */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Cerita Kami
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {story.about}
          </p>
        </div>

        {/* Mission */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Misi Kami
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {story.mission}
          </p>
        </div>
      </div>
    </div>
  );
}
