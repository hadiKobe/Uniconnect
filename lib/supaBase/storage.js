    import { supabase } from './supabaseClient'



    export async function uploadMedia(file, type = 'posts') {
    // Decide folder based on type
    const folder = {
        profile: 'profile',
        messages: 'messages',
        posts: 'posts'
    }[type] || 'posts'; // default to posts if type is wrong

    const filePath = `${folder}/${Date.now()}_${file.name}`

    const { data, error } = await supabase.storage
        .from('unity')
        .upload(filePath, file)

    if (error) {
        console.error('Upload error:', error.message)
        return null
    }

    // Get the public URL immediately
    const { data: urlData } = supabase
        .storage
        .from('unity')
        .getPublicUrl(filePath)

    return {
        filePath,
        publicUrl: urlData.publicUrl
    }
    }

    export async function deleteMedia(filePath) {
    const { data, error } = await supabase.storage
        .from('unity')
        .remove([filePath])

    if (error) {
        console.error('Delete error:', error.message)
        return false
    }

    return true
    }
