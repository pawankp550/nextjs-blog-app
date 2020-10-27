import Link from 'next/link'
import styles from '../styles/Home.module.css'

type Post = {
  slug: string,
  url: string,
  title: string,
  custom_excerpt: string
}

const getPosts = async () => {
  const res = await fetch(`${process.env.Blog_URL}ghost/api/v3/content/posts/?key=${process.env.Content_API_Key}&fields=slug,title,custom_excerpt`)
  const data = await res.json()
  return data.posts
}

export const getStaticProps = async ({ params }: { params: any }) => {
  const posts = await getPosts()
  return {
    props: {
      posts
    },
    revalidate: 1,
  }
}

const Home: React.FC<{ posts: Post[] }> = ({posts}) => {
  return (
    <div className={styles.container}>
      <h1>Welcome to my posts</h1>
      <ul>
        {
          posts.map(post => {
            return(
              <li key={post.slug} className={styles.card}>
                <Link href='post/[slug]' as={`post/${post.slug}`}>
                  <a>{post.title}</a>
                </Link>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default Home