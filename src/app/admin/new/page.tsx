import PostForm from '@/components/PostForm';

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Buat Artikel Baru</h1>
        <p className="text-sm text-gray-500 mt-1">Isi formulir di bawah untuk membuat artikel baru</p>
      </div>
      <PostForm mode="create" />
    </div>
  );
}
