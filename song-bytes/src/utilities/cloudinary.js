export const uploadToCloudinary = async (file) => { 
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Free Public Upload');
    try {
        const response = await fetch(import.meta.env.VITE_CLOUDINARY_UPLOAD_URL, {
            method: 'POST',
            body: formData,
        });
        
        if(!response.ok) {
            throw new Error('Failed to upload image to Cloudinary');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }

}