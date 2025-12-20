/**
 * Vercel Blob Storage 工具函数
 * 用于管理行程单和宣传册文件
 */

export async function getBlobUrl(pathname) {
  try {
    const response = await fetch(
      `https://blob.vercel-storage.com/${pathname}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get blob URL");
    }

    return response.url;
  } catch (error) {
    console.error("Error getting blob URL:", error);
    throw error;
  }
}

export async function listBlobs(prefix = "") {
  try {
    const response = await fetch(
      `https://blob.vercel-storage.com?prefix=${prefix}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to list blobs");
    }

    const data = await response.json();
    return data.blobs || [];
  } catch (error) {
    console.error("Error listing blobs:", error);
    throw error;
  }
}
