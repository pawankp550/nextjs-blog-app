import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import styles from '../../styles/Home.module.css'
import { useState } from 'react'

const getPost = async (slug: string) => {
    const res = await fetch(`${process.env.Blog_URL}ghost/api/v3/content/posts/slug/${slug}/?key=${process.env.Content_API_Key}`)
    const data = await res.json()
    return data.posts[0]
}

type Post = {
  slug: string,
  url: string,
  title: string,
  custom_excerpt: string,
  html: string
}

export const getStaticProps = async ({params}: { params: any }) => {
    const post = await getPost(params.slug)
    return {
      props: {
        post
      },
      revalidate: 10
    }
  }
  
  export async function getStaticPaths() {
    return {
      paths: [],
      fallback: true
    };
  }

export const Post: React.FC<{ post: Post  }> = ({ post }) => {
    const [loadComments, setLoadComments] = useState<boolean>(true)
    const router = useRouter()

    if (router.isFallback) {
        return(
            <div className={styles.container}>
                <h1>Loading...</h1>
            </div>
        )
    }

    const createMarkup = () => {
        return {__html: post.html};
      }
      
    function loadDiscuss () {
      setLoadComments(false);
      (window as any).disqus_config = function () {
        this.page.url = window.location.href
        this.page.identifier = post.slug
        }

      const d = document;
      const s = d.createElement('script');
      s.src = 'https://nehablogs.disqus.com/embed.js';
      s.setAttribute('data-timestamp', Date.now().toString());
      (d.head || d.body).appendChild(s) 
    }  
    return (
        <div className={styles.container}>
            <Link href="/">
                <a className={styles.back_btn}>Go Back</a>
            </Link>
            <div className={styles.container}>
              <h1>{post.title}</h1>
              <div dangerouslySetInnerHTML={createMarkup()} />
            </div>
            <div className={styles.disqus_container}>
              {
                loadComments ? (
                <p onClick={loadDiscuss} >
                  Load Comments
                </p>) : null
              }
              <div id="disqus_thread"></div>
            </div>
        </div>
    )
}


export default Post