import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../../../utils/supabaseClient';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

export default function MediaLibrary({ pageId, onSelectMedia }) {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    fetchMedia();
  }, [pageId]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('content_media')
        .select('*')
        .eq('page_id', pageId);
        
      if (error) throw error;
      
      setMediaFiles(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('Failed to load media files');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    
    try {
      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${pageId}/${fileName}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('content_media')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('content_media')
          .getPublicUrl(filePath);
          
        // Save media reference to database
        const { data: mediaData, error: mediaError } = await supabase
          .from('content_media')
          .insert([{
            page_id: pageId,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type,
            file_size: file.size,
            public_url: publicUrl
          }]);
          
        if (mediaError) throw mediaError;
      }
      
      // Refresh media list
      fetchMedia();
      toast.success('Media uploaded successfully');
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Failed to upload media');
    } finally {
      setUploading(false);
    }
  }, [pageId]);
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg'],
      'application/pdf': ['.pdf']
    }
  });

  const deleteMedia = async (mediaId, filePath) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('content_media')
        .remove([filePath]);
        
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('content_media')
        .delete()
        .eq('id', mediaId);
        
      if (dbError) throw dbError;
      
      // Refresh media list
      setMediaFiles(mediaFiles.filter(file => file.id !== mediaId));
      toast.success('Media deleted successfully');
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error('Failed to delete media');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Media</h3>
        <div 
          {...getRootProps()} 
          className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
        >
          <div className="text-center">
            <input {...getInputProps()} />
            {uploading ? (
              <LoadingSpinner size="medium" />
            ) : (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500"
                  >
                    <span>Upload files</span>
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  PNG, JPG, GIF, WEBP, MP4, WEBM up to 10MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Media Library</h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="medium" />
          </div>
        ) : mediaFiles.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No media files uploaded yet</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaFiles.map((file) => (
              <div key={file.id} className="relative group">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                  {file.file_type.startsWith('image/') ? (
                    <img
                      src={file.public_url}
                      alt={file.file_name}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : file.file_type.startsWith('video/') ? (
                    <video
                      src={file.public_url}
                      className="h-full w-full object-cover object-center"
                      controls
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xs text-gray-500 truncate" title={file.file_name}>
                    {file.file_name}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => onSelectMedia(file.public_url)}
                      className="text-xs text-primary-600 hover:text-primary-900"
                    >
                      Insert
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMedia(file.id, file.file_path)}
                      className="text-xs text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
