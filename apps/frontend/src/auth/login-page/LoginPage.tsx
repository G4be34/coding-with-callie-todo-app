import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Icon, Input, InputGroup, InputRightElement, Link, Text, chakra } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import "./LoginPage.css";

const ChakraRouterLink = chakra(ReactRouterLink);

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [badLogin, setBadLogin] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [bgImageNum] = useState(Math.floor(Math.random() * 3) + 1);
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
    }
  };

  useEffect(() => {
    if (password.length === 0) {
      setBadLogin(false);
    }
  }, [password]);

  return (
    <Flex justifyContent={"center"} alignItems={"center"} h={"100vh"} flexDirection={"column"} position={"relative"} overflow={"auto"} bgImg={`/${bgImageNum}-GlassMorphismBg.jpg`} bgSize={"cover"} bgPos={"center"}>
      <Heading p={{ sm: 4, md: 6, lg: 8}} color={"#ffffff"}>Welcome to CWC Todo App!</Heading>
      <Flex flexDir={"column"} as="form" borderRadius={20} border={"2px solid #d6d6c2"} p={6} w={{ sm: "300px", md: "375px", lg: "450px" }} mb={4} rowGap={8} bgColor={"rgba(255, 255, 255, 0.05)"} backdropFilter={"blur(10px)"}>
        <Heading color={"#ffffff"}>Login</Heading>

        <FormControl isRequired isInvalid={emailError} pos={"relative"}>
          <InputGroup>
            <Input
              type="email"
              value={email}
              color={"#ffffff"}
              borderColor="#555"
              focusBorderColor="#555"
              errorBorderColor="#555"
              _hover={{ border: "2px solid #555" }}
              className={`floating-input ${email ? 'filled' : ''}`}
              onChange={(e) => setEmail(e.target.value)}
              onKeyUp={handleKeyPress}
              />
            <FormLabel color={"#d9d9d9"} className="floating-label" requiredIndicator={false}>Email</FormLabel>
          </InputGroup>
          {emailError ? <FormErrorMessage>Email is required</FormErrorMessage> : null}
        </FormControl>

        <FormControl isRequired isInvalid={passwordError} pos={"relative"}>
          <InputGroup>
            <Input
              type={showPw ? "text" : "password"}
              value={password}
              color={"#ffffff"}
              borderColor="#555"
              focusBorderColor="#555"
              errorBorderColor="#555"
              _hover={{ border: "2px solid #555" }}
              className="floating-input"
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={handleKeyPress}
              />
            <FormLabel color={"#d9d9d9"} className="floating-label" requiredIndicator={false}>Password</FormLabel>
            <InputRightElement>
              <Button onClick={() => setShowPw(!showPw)} variant={"link"}>
                <Icon as={showPw ? FaEyeSlash : FaEye} />
              </Button>
            </InputRightElement>
          </InputGroup>
          {passwordError ? <FormErrorMessage>Password is required</FormErrorMessage> : null}
        </FormControl>

        {badLogin ? <Text color={"red.500"}>Incorrect email or password</Text> : null}

        <Button
          onClick={handleLogin}
          isDisabled={emailError || passwordError}
          isLoading={loading}
          color={"#ffffff"}
          aria-label="Login to your account"
          _hover={ bgImageNum == 1 ? { backgroundColor: "#fcae4f" } : bgImageNum === 2 ? { backgroundColor: "#c98bda" } : { backgroundColor: "#b6afb0" }}
          bgColor={bgImageNum === 1 ? "rgb(253, 150, 20, 1)" : bgImageNum === 2 ? "rgb(123, 45, 144, 1)" : "rgb(82, 76, 77, 1)"}
        >
            Login
        </Button>

        <Text w={"100%"} textAlign={"center"} marginY={-4} color={"#ffffff"}>-or-</Text>

        <Button
          as={ChakraRouterLink}
          to="/sign-up"
          color={"#ffffff"}
          _hover={ bgImageNum == 1 ? { backgroundColor: "#fcae4f" } : bgImageNum === 2 ? { backgroundColor: "#c98bda" } : { backgroundColor: "#b6afb0" }}
          bgColor={bgImageNum === 1 ? "rgb(253, 150, 20, 1)" : bgImageNum === 2 ? "rgb(123, 45, 144, 1)" : "rgb(82, 76, 77, 1)"}
          aria-label="Sign up for an account"
        >
          Sign Up
        </Button>
      </Flex>
      <Flex pb={4}>
        <Text mr={2} color={"white"}>Forgot your password?</Text>
        <Link as={ReactRouterLink} to="/forgot-password" color={"#209CF0"}>Click here</Link>
      </Flex>
    </Flex>
  )
}