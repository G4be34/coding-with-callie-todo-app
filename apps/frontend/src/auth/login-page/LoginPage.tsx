import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Link, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailError = email === '';
  const passwordError = password === '';

  return (
    <Flex justifyContent={"center"} alignItems={"center"} h={"100vh"} flexDirection={"column"} position={"relative"}>
      <Heading position={"absolute"} top={"15%"} p={4}>Welcome to CWC Todo App!</Heading>
      <Flex flexDir={"column"} as="form" border={"1px solid black"} borderRadius={10} p={6} w={"450px"} mb={4} rowGap={8}>
        <Heading>Login</Heading>
        <FormControl isRequired isInvalid={emailError}>
          <FormLabel>Email</FormLabel>
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {emailError ? <FormErrorMessage>Email is required</FormErrorMessage> : null}
        </FormControl>
        <FormControl isRequired isInvalid={passwordError}>
          <FormLabel>Password</FormLabel>
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {passwordError ? <FormErrorMessage>Password is required</FormErrorMessage> : null}
        </FormControl>
        <Button>Login</Button>
      </Flex>
      <Flex>
        <Text mr={2}>Forgot your password?</Text>
        <Link as={ReactRouterLink} to="/forgot-password" color={"#209CF0"}>Click here</Link>
      </Flex>
    </Flex>
  )
}