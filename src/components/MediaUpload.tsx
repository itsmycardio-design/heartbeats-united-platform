import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon, Video, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MediaFile {
  url: string;
  type: "image" | "video";
  caption?: string;
}

interface MediaUploadProps {
  onMediaChange: (media: MediaFile[]) => void;
  currentMedia?: MediaFile[];
  maxFiles?: number;
}

export const MediaUpload = ({ 
  onMediaChange, 
  currentMedia = [],
  maxFiles = 10 
}: MediaUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(currentMedia);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (mediaFiles.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} files`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (!isImage && !isVideo) {
          toast.error(`${file.name}: Only images and videos are allowed`);
          return null;
        }

        // Size limits
        const maxSize = isVideo ? 500 * 1024 * 1024 : 5 * 1024 * 1024; // 500MB for video, 5MB for images
        if (file.size > maxSize) {
          toast.error(`${file.name}: File too large. Max ${isVideo ? '500MB' : '5MB'}`);
          return null;
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const bucket = isVideo ? "blog-videos" : "blog-images";

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        return {
          url: publicUrl,
          type: isVideo ? "video" as const : "image" as const,
        };
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter((r): r is MediaFile => r !== null);

      if (successfulUploads.length > 0) {
        const updatedMedia = [...mediaFiles, ...successfulUploads];
        setMediaFiles(updatedMedia);
        onMediaChange(updatedMedia);
        toast.success(`${successfulUploads.length} file(s) uploaded successfully`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload files");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const removeMedia = (index: number) => {
    const updatedMedia = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updatedMedia);
    onMediaChange(updatedMedia);
    toast.success("Media removed");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Media Gallery ({mediaFiles.length}/{maxFiles})</Label>
        {mediaFiles.length < maxFiles && (
          <Label htmlFor="media-upload" className="cursor-pointer">
            <Button type="button" size="sm" variant="outline" asChild>
              <span>
                <Plus className="w-4 h-4 mr-2" />
                Add Media
              </span>
            </Button>
            <Input
              id="media-upload"
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </Label>
        )}
      </div>

      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaFiles.map((media, index) => (
            <Card key={index} className="relative group overflow-hidden">
              {media.type === "image" ? (
                <div className="relative aspect-video">
                  <img
                    src={media.url}
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
              ) : (
                <div className="relative aspect-video bg-muted">
                  <video
                    src={media.url}
                    className="w-full h-full object-cover"
                    controls
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    Video
                  </div>
                </div>
              )}
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeMedia(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {mediaFiles.length === 0 && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
            <Video className="w-12 h-12 text-muted-foreground" />
          </div>
          <Label htmlFor="media-upload-empty" className="cursor-pointer">
            <span className="text-primary hover:underline">
              Click to upload
            </span>
            <span className="text-muted-foreground"> or drag and drop</span>
          </Label>
          <p className="text-sm text-muted-foreground mt-2">
            Images (PNG, JPG, WEBP up to 5MB) or Videos (MP4, WEBM up to 500MB)
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Upload up to {maxFiles} files
          </p>
          <Input
            id="media-upload-empty"
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </div>
      )}

      {uploading && (
        <p className="text-sm text-muted-foreground animate-pulse">
          Uploading files...
        </p>
      )}
    </div>
  );
};