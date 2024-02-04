import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Link, Text } from "@chakra-ui/react";
import axios, { isAxiosError } from "axios";
import { useState } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [existingUser, setExistingUser] = useState(false);
  const [email, setEmail] = useState('');
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMatch, setPwMatch] = useState(true);
  const [username, setUsername] = useState('');
  const [completeSignup, setCompleteSignup] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [code, setCode] = useState('');
  const [codeMatch, setCodeMatch] = useState(true);

  const createUser = async () => {
    try {
      if (code !== emailCode) {
        setCodeMatch(false);
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

      await axios.post('/api/users', newUser);

      navigate('/login');
    } catch (error) {
      if (isAxiosError(error) && error.response && error.response.status === 409) {
        setInvalidEmail(false);
        setExistingUser(true);
      }

      if (isAxiosError(error) && error.response && error.response.data.message.includes('email must be an email')) {
        setInvalidEmail(true);
      }
      console.log("Error creating user: ", error);
    }
  }

  const sendVerificationEmail = async (username: string, email: string) => {
    if (password !== confirmPassword) {
      setPwMatch(false);
      return;
    }

    const existingUser = await axios.get(`/api/email/${email}`);

    if (existingUser.data) {
      setExistingUser(true);
      return;
    }

    const code = await axios.post('/api/email', { username, email });

    setEmailCode(code.data.toString());
    setCompleteSignup(true);
  }

  return (
    <Flex flexDir={"column"} justifyContent={"center"} alignItems={"center"} h={"100vh"} bgColor={"gray.300"} pos={"relative"}>
      <Heading position={"absolute"} top={"15%"}>Sign up for CWC Todo App</Heading>
      <Flex flexDir={"column"} as="form" border={"1px solid black"} p={6} w={"450px"} borderRadius={10} rowGap={8} bgColor={"white"} mb={4}>
        {!completeSignup
          ? <>
              <FormControl isRequired isInvalid={username.length < 3}>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  />
                {username.length < 3 ? <FormErrorMessage>Username must be at least 3 characters long</FormErrorMessage> : null}
              </FormControl>

              <FormControl isRequired isInvalid={existingUser}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  />
                {existingUser ? <FormErrorMessage>Email already exists</FormErrorMessage> : null}
                {invalidEmail ? <Text mt={2} fontSize={"sm"} color={"red"}>Email must be a valid email address</Text > : null}
              </FormControl>

              <FormControl isRequired isInvalid={password.length < 6}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  />
                {password.length < 6 ? <FormErrorMessage>Password must be at least 6 characters</FormErrorMessage> : null}
              </FormControl>

              <FormControl isRequired isInvalid={!pwMatch}>
                <FormLabel>Confirm password</FormLabel>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
                {!pwMatch ? <FormErrorMessage>Passwords do not match</FormErrorMessage> : null}
              </FormControl>

              <Button
                onClick={() => sendVerificationEmail(username, email)}
                isDisabled={username.length < 3 || password.length < 6}
                >
                  Sign up
                </Button>
            </>
          : <>
              <FormControl isRequired isInvalid={!codeMatch}>
                <Text mb={6}>Verification email has been sent. Please check your inbox</Text>
                <FormLabel>Verification Code</FormLabel>
                <Input
                  type="text"
                  placeholder="Verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  />
                {!codeMatch ? <FormErrorMessage>Incorrect verification code</FormErrorMessage> : null}
              </FormControl>

              <Button onClick={createUser} isDisabled={code.length < 6}>Verify Email</Button>

              <Text textAlign={"center"} mt={-4} mb={-4}>- or -</Text>

              <Button onClick={() => {
                setCompleteSignup(false);
                setCodeMatch(true)
                setCode("");
                setEmailCode("");
              }}>Go back</Button>
              <Flex>
                <Text>Didn't recieve the email?</Text>
                <Text onClick={() => sendVerificationEmail(username, email)} color={"#209CF0"} marginLeft={2} _hover={{ cursor: "pointer", textDecoration: "underline" }}>Resend it</Text>
              </Flex>
            </>
        }
      </Flex>
      {!completeSignup
        ? <Text>Already have an account? <Link as={ReactRouterLink} to="/" color={"#209CF0"} marginLeft={2}>Login instead</Link></Text>
        : null
      }
    </Flex>
  )
}