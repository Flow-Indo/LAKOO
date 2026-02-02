import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostHeader from '@/components/post/PostHeader';
import ImageCarousel from '@/components/post/ImageCarousel';
import TaggedProductsList from '@/components/post/TaggedProductsList'; // NEW
import PostContent from '@/components/post/PostContent';
import CommentSection from '@/components/post/CommentSection';
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
function getMockComments(product: any) {
  return [
    {
      id: '1',
      author: {
        name: 'Sarah Style',
        avatar: '',
        isAuthor: false
      },
      content: 'Bagus banget kak! Beli dimana ya?',
      timestamp: '2 jam yang lalu',
      location: 'Jakarta',
      likes: 23,
      replies: [
        {
          id: 'r1',
          author: {
            name: product.postData.author.name,
            avatar: '',
            isAuthor: true
          },
          content: 'Link ada di bio ya kak! 😊',
          timestamp: '1 jam yang lalu',
          location: 'Jakarta',
          likes: 12
        }
      ]
    },
    {
      id: '2',
      author: {
        name: 'Fashion Lover',
        avatar: '',
        isAuthor: false
      },
      content: 'Cantik banget! Kualitasnya bagus gak?',
      timestamp: '3 jam yang lalu',
      location: 'Bandung',
      likes: 45
    }
  ];
}

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

  const comments = getMockComments(product);

  return (
    <div className="min-h-screen bg-white pb-20">
      <PostHeader author={product.postData.author} />

      <main>
        {/* Image Carousel with Post Images (eksplor) - UPDATED */}
        <ImageCarousel
          images={product.postImages}
          isLive={false}
          aspectRatio="3/4"
          taggedProducts={taggedProducts} // NEW
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

        <CommentSection
          postId={product.id}
          comments={comments}
          totalComments={product.postData.interactions.comments}
        />

        <RelatedPosts />
      </main>

      <BottomActions
        postId={product.id}
        initialData={product.postData.interactions}
      />
    </div>
  );
}
