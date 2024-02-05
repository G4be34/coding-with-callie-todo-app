import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Link, Text, chakra } from "@chakra-ui/react";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const ChakraRouterLink = chakra(ReactRouterLink);

export const LoginPage = () => {
  const { loginUser, badLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailError = email === '';
  const passwordError = password === '' || password.length < 6;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !emailError && !passwordError) {
      loginUser(email, password);
    }
  }

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

        <Button onClick={() => loginUser(email, password)} isDisabled={emailError || passwordError}>Login</Button>

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