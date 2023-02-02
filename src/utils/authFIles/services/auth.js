import axios from "axios";
import { useState } from "react";
import { v4 as uuid } from "uuid";

async function SignInRequest() {
  const user = getUsers();
  console.log(user);
  return {
    token: uuid(),
    User: {
      name: "",
      email: "",
    },
  };
}

async function getUsers() {
  const [users, setUsers] = useState([]);
  await axios("https://web-production-2ecf.up.railway.app/users").then((res) =>
    setUsers(res.data)
  );
  return users;
}

export default SignInRequest;
