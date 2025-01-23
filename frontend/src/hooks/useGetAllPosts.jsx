import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice.js";


const useGetAllPosts = () => {
    const dispatch = useDispatch();

    useEffect(()=> {
        const fetchAllPosts = async () => {
            try {
                const res = await axios.get("http://localhost:4000/api/post/all", { withCredentials: true })
                if(res.data.success){
                    console.log("res data get all posts", res.data.data);
                    dispatch(setPosts(res.data.data));
                }
            } catch (error) {
                console.error("Error fetching posts:", error); 
                toast.error(error.response.data.message);
            }
        }
        fetchAllPosts();
    }, [dispatch]);
}

export default useGetAllPosts