import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Link, Text, chakra, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";

const ChakraRouterLink = chakra(ReactRouterLink);

export const LoginPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [badLogin, setBadLogin] = useState(false);
  const emailError = email === '';
  const passwordError = password === '' || password.length < 6;

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !emailError && !passwordError) {
      try {
        setLoading(true);
        await loginUser(email, password);
        setLoading(false);
      } catch (error) {
        if (loading) {
          setLoading(false);
        }
        console.log(error);
      }
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const authResponse = await axios.post('/api/auth/login', { email, password });

      setBadLogin(false);

      const token = authResponse.data.access_token;

      const timeResponse = await axios.get(`/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const expirationDate = timeResponse.data.exp;
      const userId = timeResponse.data.sub;

      const tokenObj = {
        access_token: token,
        expiration_date: expirationDate * 1000
      };

      localStorage.setItem('token', JSON.stringify(tokenObj));
      localStorage.setItem('user_id', userId);

      const redirectUrl = sessionStorage.getItem('redirect_after_login') || '/';
      sessionStorage.removeItem('redirect_after_login');
      navigate(redirectUrl, { replace: true });
    } catch (error) {
      console.log("Problem logging in: ", error);
      setBadLogin(true);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      await loginUser(email, password);
      setLoading(false);
    } catch (error) {
      if (loading) {
        setLoading(false);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    if (password.length === 0) {
      setBadLogin(false);
    }
  }, [password]);

  return (
    <Flex justifyContent={"center"} alignItems={"center"} h={"100vh"} flexDirection={"column"} position={"relative"} bgColor={"gray.300"}>
      <Heading position={"absolute"} top={"15%"} p={4}>Welcome to CWC Todo App!</Heading>
      <Flex flexDir={"column"} as="form" border={"1px solid black"} borderRadius={10} p={6} w={"450px"} mb={4} rowGap={8} bgColor={"white"}>
        <Heading>Login</Heading>

        <FormControl isRequired isInvalid={emailError}>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
          {emailError ? <FormErrorMessage>Email is required</FormErrorMessage> : null}
        </FormControl>

        <FormControl isRequired isInvalid={passwordError}>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={handleKeyPress}
            />
          {passwordError ? <FormErrorMessage>Password is required</FormErrorMessage> : null}
        </FormControl>

        {badLogin ? <Text color={"red.500"}>Incorrect email or password</Text> : null}

        <Button
          onClick={handleLogin}
          isDisabled={emailError || passwordError}
          isLoading={loading}
          >
            Login
        </Button>

        <Text w={"100%"} textAlign={"center"} marginY={-4} >-or-</Text>

        <Button as={ChakraRouterLink} to="/sign-up">Sign Up</Button>
      </Flex>
      <Flex>
        <Text mr={2}>Forgot your password?</Text>
        <Link as={ReactRouterLink} to="/forgot-password" color={"#209CF0"}>Click here</Link>
      </Flex>
    </Flex>
  )
}