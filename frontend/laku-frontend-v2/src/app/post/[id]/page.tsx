import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostHeader from '@/components/post/PostHeader';
import ImageCarousel from '@/components/post/ImageCarousel';
import TaggedProductsList from '@/components/post/TaggedProductsList'; // NEW
import PostContent from '@/components/post/PostContent';
import BottomActions from '@/components/post/BottomActions';
import RelatedPosts from '@/components/post/RelatedPosts';
import { getProductBySlug, getAllProductSlugs, getProductsByTags } from '@/lib/products-data';

export async function generateStaticParams() {
  const slugs = getAllProductSlugs();
  return slugs.map((slug) => ({ id: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProductBySlug(id);

  if (!product) {
    return {
      title: 'Post Not Found - Laku'
    };
  }

  return {
    title: `${product.postData.title} - Laku`,
    description: product.postData.content.substring(0, 160)
  };
}

// Mock comments for the post

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductBySlug(id);

  if (!product) {
    notFound();
  }

  // Get tagged products - NEW
  const taggedProducts = product.taggedProducts
    ? getProductsByTags(product.taggedProducts.tags)
    : [];

  return (
    <div className="min-h-screen bg-white pb-20">
      <PostHeader author={product.postData.author} />

      <main>
        {/* Image Carousel with Post Images (eksplor) - UPDATED */}
        <ImageCarousel
          images={product.postImages}
          isLive={false}
          aspectRatio="3/4"
          taggedProducts={taggedProducts}
          likesCount={product.postData.interactions.likes}
          commentsCount={product.postData.interactions.comments}
          sharesCount={0}
          savesCount={product.postData.interactions.favorites}
        />

        {/* Tagged Products List - NEW */}
        <TaggedProductsList products={taggedProducts} />

        <PostContent
          post={{
            title: product.postData.title,
            content: product.postData.content,
            tags: product.postData.tags,
            location: product.postData.location,
            editedAt: product.postData.editedAt,
            originalityDeclared: true
          }}
        />

        <RelatedPosts />
      </main>

      <BottomActions
        postId={product.id}
      />
    </div>
  );
}
