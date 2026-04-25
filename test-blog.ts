import { getBlogPost, getBlogPosts } from './src/lib/blog/blog-utils';

async function test() {
  try {
    console.log("Fetching all posts...");
    const posts = await getBlogPosts();
    console.log(`Found ${posts.length} posts`);
    
    console.log("Fetching specific post...");
    const post = await getBlogPost('como-reparar-parabrisas-astillado');
    if (post) {
      console.log(`Success! Title: ${post.title}`);
      console.log(`Content length: ${post.content.length}`);
    } else {
      console.log("Post not found");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
