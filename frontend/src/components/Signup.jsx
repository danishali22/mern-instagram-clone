import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";


const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
    });

    const changeEventHandler = (e) => {
        setInput({...input, [e.target.name]: e.target.value});  
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:4000/api/user/register", input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            console.log("res", res)
            if(res.data.success){
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

  return (
    <div>
      <div className="w-screen h-screen flex justify-center items-center">
        <form onSubmit={signupHandler} className="shadow-lg flex flex-col gap-5 p-8">
          <div className="my-4 text-center">
            <p className="uppercase text-2xl font-bold">Logo</p>
            <p className="text-sm">
              Signup to see photos & videos from your friends
            </p>
          </div>
          <div>
            <span className="font-bold">Username</span>
            <Input
              type="text"
              className="focus-visible:ring-transparent my-2"
              name="username"
              value={input.username}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <span className="font-bold">Email</span>
            <Input
              type="email"
              className="focus-visible:ring-transparent my-2"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <span className="font-bold">Password</span>
            <Input
              type="password"
              className="focus-visible:ring-transparent my-2"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
            />
          </div>
          <Button>Signup</Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
