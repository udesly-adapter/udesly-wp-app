/*
interface Media {
  type: 'file' | 'dir'
  id: string
  directory: string
  filename: string
  previewSrc?: string
}

interface MediaList {
  items: Media[]
  limit: number
  offset: number
  nextOffset?: number
  totalCount: number
}

interface MediaUploadOptions {
  directory: string
  file: File
}

interface MediaListOptions {
  directory?: string
  limit?: number
  offset?: number
}
 */


export default class WordPressMediaStore {
    accept = window.options.accept || "image/png, image/jpeg, image/jpg, image/gif"

    askedItems = {};

    async uploadMedia(file) {
        const data = new FormData();
        data.set('action', 'upload-attachment');
        data.set('_wpnonce', window.options.nonce);
        data.set('async-upload', file);
        data.set('name', file.name);
        const res = await fetch(window.options.async_upload, {
            method: "POST",
            body:data
        });
        const jsonRes = await res.json();
        const wpMedia = jsonRes.data;
        return {
            id: wpMedia.id,
            type: 'file',
            directory: '',
            previewSrc: wpMedia.url,
            filename: wpMedia.filename
        }
    }

    async persist(files) {
        for (let file of files) {
            await this.uploadMedia(file.file);
        }
    }

    async previewSrc(src, fieldPath, formValues) {
       return src.previewSrc;
    }

    async list(options) {
        const data = new FormData();
        const page = Math.floor(options.offset/options.limit);

        data.set('action', 'query-attachments');
        data.set('query[posts_per_page]', options.limit || 40);
        data.set('query[paged]', page === 0 ? 1 : page + 1);
        // data.set('query[post_mime_type]', 'image/*');

        const res = await fetch(window.options.ajax_url, {method: "POST", body: data});

        const json = await res.json();

        const items = json.data.map(wpMedia => ({
            id: wpMedia.id,
            type: 'file',
            directory: '',
            previewSrc: wpMedia.type === "video" ? wpMedia.image.src : wpMedia.url,
            filename: wpMedia.filename,
            nonces: wpMedia.nonces
        }));

        const response = {
            items,
            limit: options.limit,
            offset: options.offset,
        }
        this.askedItems[page] = items.length;

        const length = Object.values(this.askedItems).reduce((curr, next) => curr+=next, 0);

        if (length === options.limit) {
            response.totalCount = length + 1;
        } else {
            response.totalCount = length;
        }

        return response;
    }

    async delete(media) {
        const data = new FormData();
        data.set('action', 'delete-post');
        data.set('id', media.id);
        data.set('_wpnonce', media.nonces.delete);

        await fetch(window.options.ajax_url, {method: "POST", body: data});
    }
}