'use client';

import { useState, useRef } from 'react';
import UserAvatar from '@/components/shared/UserAvatar';
import { postApi, MediaItemDTO } from '@/lib/api/postApi';
import { useAuth } from '@/contexts/AuthContext';

const MAX_IMAGES = 4;
const MAX_SIZE_MB = 5;

interface CreatePostCardProps {
  onPostCreated: () => void;
}

export default function CreatePostCard({ onPostCreated }: CreatePostCardProps) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const oversized = files.find(f => f.size > MAX_SIZE_MB * 1024 * 1024);
    if (oversized) {
      setError(`Each image must be under ${MAX_SIZE_MB}MB.`);
      return;
    }
    setSelectedFiles(prev => [...prev, ...files].slice(0, MAX_IMAGES));
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!text.trim() && selectedFiles.length === 0) return;
    setSubmitting(true);
    setError('');
    try {
      let mediaUrls: MediaItemDTO[] = [];
      if (selectedFiles.length > 0) {
        const { storageService } = await import('@/lib/storage');
        mediaUrls = await Promise.all(
          selectedFiles.map(async file => {
            const url = await storageService.uploadFile(
              `posts/${Date.now()}_${file.name}`,
              file,
            );
            return { url, mediaType: 'IMAGE' as const, fileName: file.name };
          }),
        );
      }
      await postApi.createPost({ textContent: text.trim() || undefined, mediaUrls });
      setText('');
      setSelectedFiles([]);
      setExpanded(false);
      onPostCreated();
    } catch {
      setError('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = !submitting && (text.trim().length > 0 || selectedFiles.length > 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex gap-3">
        <UserAvatar
          name={user?.email || '?'}
          initials={(user?.email?.[0] || '?').toUpperCase()}
          size="md"
        />
        <div className="flex-1">
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="w-full text-left px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-400 text-sm transition-colors"
            >
              Share something with your department…
            </button>
          ) : (
            <div className="space-y-3">
              <textarea
                autoFocus
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="What's on your mind?"
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-400 resize-none"
              />

              {/* Image previews */}
              {selectedFiles.length > 0 && (
                <div className={`grid gap-1 ${selectedFiles.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {selectedFiles.map((file, i) => (
                    <div key={i} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full object-cover rounded-lg max-h-48"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none transition-colors"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedFiles.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors text-xs"
                      title="Add image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      Photo
                    </button>
                  )}
                  <span className="text-xs text-gray-400">{text.length}/5000</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setExpanded(false); setText(''); setSelectedFiles([]); setError(''); }}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? (selectedFiles.length > 0 ? 'Uploading…' : 'Posting…') : 'Post'}
                  </button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
