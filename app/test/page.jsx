'use client'

import { useState } from 'react'
import { uploadMedia } from '@/lib/supaBase/storage'

const Page = () => {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first!')
    setUploading(true)

    const { publicUrl } = await uploadMedia(file, 'posts') // you can change 'profile', 'posts', 'messages'
    setPreviewUrl(publicUrl)

    setUploading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Upload and Show Image</h1>

      <input 
        type="file" 
        onChange={handleFileChange} 
        className="mb-4"
      />

      <button 
        onClick={handleUpload} 
        disabled={uploading} 
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {previewUrl && (
        <div className="mt-6">
          <img 
            src={previewUrl} 
            alt="Uploaded" 
            className="w-64 h-64 object-cover rounded-lg shadow-md" 
          />
        </div>
      )}
    </div>
  )
}

export default Page
