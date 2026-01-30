import { Metadata } from 'next';
import PostHeader from '@/components/post/PostHeader';
import ImageCarousel from '@/components/post/ImageCarousel';
import PostContent from '@/components/post/PostContent';
import CommentSection from '@/components/post/CommentSection';
import BottomActions from '@/components/post/BottomActions';

// Helper to get image dimensions
async function getImageDimensions(url: string): Promise<{ width: number; height: number } | null> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (!res.ok) return null;
    
    // For external URLs, we'll use a default aspect ratio based on common patterns
    // In production, you might want to use a real image processing service
    return { width: 800, height: 1067 }; // Default 3:4 ratio
  } catch {
    return null;
  }
}

async function getPost(id: string) {
  const images = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'
  ];
  
  return {
    id,
    author: {
      id: 'user123',
      name: 'Coklat Kue Kecil',
      avatar: 'https://i.pravatar.cc/150?img=1',
      followerCount: 125000,
      isFollowing: false
    },
    images,
    isLive: false,
    title: '166 125kg Tubuh Fitness Nyata Tanpa Kontrol Makan',
    content: `Masih harus percaya pada diri sendiri
Kita berusaha dengan baik berdasarkan genetika kita sendiri

Setiap orang memiliki perjalanan fitness yang berbeda. Yang penting adalah konsistensi dan menikmati prosesnya. Tidak perlu membandingkan diri dengan orang lain, yang terpenting adalah perubahan dari diri sendiri.

Fitness bukan tentang memiliki tubuh sempurna, tapi tentang menjadi versi terbaik dari diri sendiri. Semangat dan konsisten adalah kuncinya!`,
    tags: ['#FitnessDenganSenang', '#BadanSeperti', '#Kebugaran', '#HealthyLifestyle'],
    group: {
      id: 'g1',
      name: 'Klub Check-in Tanpa Kontrol Diet',
      memberCount: 16
    },
    event: {
      id: 'e1',
      name: 'Kompetisi Makan Komersial Dimulai'
    },
    suggestions: [{ text: 'Cara latihan paha dalam 2 minggu' }],
    location: 'Jakarta Selatan',
    editedAt: '2 jam yang lalu',
    originalityDeclared: true,
    interactions: { likes: 3450, favorites: 892, comments: 234 },
    comments: [
      {
        id: 'c1',
        author: { name: 'Yoga Lover', avatar: 'https://i.pravatar.cc/150?img=20', isAuthor: false },
        content: 'Inspirasi banget! Boleh share routine-nya ga?',
        timestamp: '1 jam yang lalu',
        location: 'Jakarta',
        likes: 45,
        replies: [
          { id: 'r1', author: 'Fitnes Indonesia', content: 'Bisa DM ya!', timestamp: '45 menit', likes: 12, isAuthor: false }
        ]
      },
      {
        id: 'c2',
        author: { name: 'Healthy Life', avatar: 'https://i.pravatar.cc/150?img=21', isAuthor: true },
        content: 'Amazing transformation! Semangat terus yaa 💪',
        timestamp: '2 jam yang lalu',
        location: 'Bandung',
        likes: 89
      },
      {
        id: 'c3',
        author: { name: 'Gym Buddy', avatar: 'https://i.pravatar.cc/150?img=22', isAuthor: false },
        content: 'Berapa lama全过程nya?',
        timestamp: '3 jam yang lalu',
        location: 'Surabaya',
        likes: 23
      }
    ]
  };
}

async function getRelatedPosts() {
  return [
    {
      id: 'rel1',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
      title: 'Rutinitas olahraga pagi untuk pemula',
      author: { name: 'Fitnes Indonesia', avatar: 'https://i.pravatar.cc/150?img=5' },
      views: 12500,
      likes: 2340
    },
    {
      id: 'rel2',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      title: 'Review peralatan gym terbaik tahun 2024',
      author: { name: 'Tech Review', avatar: 'https://i.pravatar.cc/150?img=6' },
      views: 8900,
      likes: 1890
    },
    {
      id: 'rel3',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      title: 'Koleksi sepatu gym terbaru yang wajib dimiliki',
      author: { name: 'Sneaker Head', avatar: 'https://i.pravatar.cc/150?img=7' },
      views: 15600,
      likes: 3456
    },
    {
      id: 'rel4',
      image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400',
      title: 'Inspirasi setup home gym di rumah kecil',
      author: { name: 'Interior Design', avatar: 'https://i.pravatar.cc/150?img=8' },
      views: 6700,
      likes: 1234
    }
  ];
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getPost(params.id);
  return {
    title: `${post.title} - Laku`,
    description: post.content.substring(0, 150)
  };
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  
  // Use default 3:4 aspect ratio for first image
  // In production, you would fetch the actual dimensions
  const aspectRatio = '3/4';

  return (
    <div className="min-h-screen bg-white pb-20">
      <PostHeader author={post.author} />
      <ImageCarousel images={post.images} isLive={post.isLive} aspectRatio={aspectRatio} />
      <PostContent post={post} />
      <CommentSection 
        postId={post.id} 
        comments={post.comments} 
        totalComments={post.interactions.comments} 
      />
      <BottomActions 
        postId={post.id} 
        initialData={post.interactions} 
      />
    </div>
  );
}
