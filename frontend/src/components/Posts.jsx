import { useSelector } from "react-redux";
import Post from "./Post";

const Posts = () => {
  const { posts } = useSelector((store) => store.posts);
  console.log("posts, ", posts);
  return (

    <div>
        {
            posts.map((post)=> <Post key={post._id} post={post} /> )
        }
    </div>
  )
}

export default Posts