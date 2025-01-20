import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("res", res);
      if (res.data.success) {
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="w-screen h-screen flex justify-center items-center">
        <form
          onSubmit={loginHandler}
          className="shadow-lg flex flex-col gap-5 p-8"
        >
          <div className="my-4 text-center">
            <p className="uppercase text-2xl font-bold">Logo</p>
            <p className="text-sm">
              Login to see photos & videos from your friends
            </p>
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
          <Button disabled={loading}>Login</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
