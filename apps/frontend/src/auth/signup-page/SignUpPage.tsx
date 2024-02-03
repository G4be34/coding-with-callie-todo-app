import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Link, Text } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [pwMatch, setPwMatch] = useState(true);

  const createUser = async () => {
    try {
      if (password !== confirmPassword) {
        setPwMatch(false);
        return;
      }

      const newUser = {
        email,
        password,
        username,
        photo: "",
        theme: "",
        font: "",
      };

      const response = await axios.post('/api/users', newUser);
      console.log("Response data: ", response.data);
      navigate('/login');
    } catch (error) {
      console.log("Error creating user: ", error);
    }
  }

  return (
    <Flex flexDir={"column"} justifyContent={"center"} alignItems={"center"} h={"100vh"} bgColor={"gray.300"} pos={"relative"}>
      <Heading position={"absolute"} top={"15%"}>Sign up for CWC Todo App</Heading>
      <Flex flexDir={"column"} as="form" border={"1px solid black"} p={6} w={"450px"} borderRadius={10} rowGap={8} bgColor={"white"} mb={4}>
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        </FormControl>

        <FormControl isRequired isInvalid={!pwMatch}>
          <FormLabel>Confirm password</FormLabel>
          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
          {!pwMatch ? <FormErrorMessage>Passwords do not match</FormErrorMessage> : null}
        </FormControl>

        <Button onClick={createUser}>Sign up</Button>
      </Flex>
      <Text>Already have an account? <Link as={ReactRouterLink} to="/" color={"#209CF0"}>Login instead</Link></Text>
    </Flex>
  )
}