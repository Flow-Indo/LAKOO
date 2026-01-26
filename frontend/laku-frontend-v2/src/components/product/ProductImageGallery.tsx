import Image from 'next/image';
import ProductImageCarousel from '@/components/client/product/ProductImageCarousel';

interface ProductImage {
  id: string;
  url: string;
  thumbnail?: string;
  alt: string;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Tidak ada gambar tersedia</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: Full Width Carousel (like Taobao Image 1) */}
      <div className="lg:hidden">
        <ProductImageCarousel images={images} />
      </div>

      {/* Desktop: Vertical Thumbnails + Main Image */}
      <div className="hidden lg:flex gap-4">
        <div className="flex flex-col gap-2 w-20">
          {images.map((img) => (
            <div key={img.id} className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
              <Image src={img.thumbnail || img.url} alt={img.alt} width={80} height={80} className="object-cover" />
            </div>
          ))}
        </div>
        <div className="flex-1 aspect-square rounded-lg overflow-hidden bg-gray-100">
          <Image src={images[0].url} alt={images[0].alt} fill className="object-cover" />
        </div>
      </div>
    </>
  );
}