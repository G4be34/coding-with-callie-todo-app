import { Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Link, Text, chakra } from "@chakra-ui/react";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

const ChakraRouterLink = chakra(ReactRouterLink);

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [foundUser, setFoundUser] = useState(false);
  const [successfulEmail, setSuccessfulEmail] = useState(false);
  const [completeReset, setCompleteReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [code, setCode] = useState('');


  return (
    <Flex flexDir={"column"} justifyContent={"center"} alignItems={"center"} h={"100vh"} bgColor={"gray.300"} pos={"relative"}>
      <Heading position={"absolute"} top={"15%"}>Forgot your password?</Heading>

      <Flex flexDir={"column"} as="form" border={"1px solid black"} p={6} w={"450px"} borderRadius={10} rowGap={8} bgColor={"white"} mb={4}>
        {!successfulEmail && !completeReset ?
          <>
            <FormControl isInvalid={foundUser}>
              <FormLabel>We'll send you an email to reset it</FormLabel>
              <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              {!foundUser ? <FormHelperText>Please enter the email address you used to register</FormHelperText> : <FormErrorMessage>Email not found</FormErrorMessage>}
            </FormControl>

            <Button>Send Email</Button>
          </>
          : null
        }

        {successfulEmail && !completeReset ?
          <>
            <FormControl isRequired>
              <FormLabel> New password</FormLabel>
              <Input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Confirm new password</FormLabel>
              <Input type="text" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Reset password code</FormLabel>
              <Input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
            </FormControl>

            <Button>Reset Password</Button>
          </>
         : null
        }

        {completeReset ?
          <>
            <Text>Your password has been reset</Text>
            <Button as={ChakraRouterLink} to="/">Login</Button>
          </>
          : null
        }
      </Flex>

      <Text>Already have an account? <Link as={ReactRouterLink} to="/" color={"#209CF0"}>Login instead</Link></Text>
    </Flex>
  )
}