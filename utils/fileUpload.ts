import * as FileSystem from 'expo-file-system/legacy';

/**
 * On Android release/APK, ImagePicker returns content:// URIs.
 * FormData/fetch cannot read content:// URIs, so we copy to cache (file://) for upload.
 * If the URI is already file://, returns it as-is.
 */
export async function getUploadableUri(uri: string): Promise<string> {
  if (!uri) return uri;
  // file:// URIs work with FormData; no need to copy
  if (uri.startsWith('file://')) return uri;

  const cacheDir = FileSystem.cacheDirectory;
  if (!cacheDir) return uri;

  const ext = getExtension(uri);
  const destUri = `${cacheDir}upload_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;

  try {
    await FileSystem.copyAsync({ from: uri, to: destUri });
    return destUri;
  } catch (e) {
    console.warn('getUploadableUri copy failed, using original:', e);
    return uri;
  }
}

function getExtension(uri: string): string {
  const name = uri.split('/').pop() || '';
  const match = /\.(\w+)$/i.exec(name);
  if (match) return '.' + match[1].toLowerCase();
  return '.jpg';
}
