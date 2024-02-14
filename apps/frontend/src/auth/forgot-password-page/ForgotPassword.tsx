import { Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Link, Spinner, Text, chakra } from "@chakra-ui/react";
import axios, { isAxiosError } from "axios";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

const ChakraRouterLink = chakra(ReactRouterLink);

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [foundUser, setFoundUser] = useState(false);
  const [successfulEmail, setSuccessfulEmail] = useState(false);
  const [completeReset, setCompleteReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwMatch, setPwMatch] = useState(true);
  const [existingPw, setExistingPw] = useState(false);
  const [code, setCode] = useState('');
  const [codeEmail, setCodeEmail] = useState('');
  const [codeMatch, setCodeMatch] = useState(true);
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/email', { email });
      setCodeEmail(response.data.code.toString());
      setUserId(response.data.id.toString());
      setLoading(false);
      setSuccessfulEmail(true);
    } catch (error) {
      if (loading) {
        setLoading(false);
      }
      if (isAxiosError(error) && error.response && error.response.data.statusCode === 404) {
        setFoundUser(true);
      }
      console.log("Error sending code: ", error);
    }
  }

  const completePwReset = async () => {
    try {
      setLoading(true);
      if (newPassword !== confirmNewPassword || newPassword.length < 6 || confirmNewPassword.length < 6) {
        setPwMatch(false);
        setLoading(false);
        return;
      }

      if (code !== codeEmail || code.length < 6) {
        setCodeMatch(false);
        setLoading(false);
        return;
      }

      const existingPw = await axios.post(`/api/users/match-password`, {
        id: userId,
        password: newPassword
      });

      console.log("existingPw: ", existingPw.data);

      if (existingPw.data) {
        setExistingPw(true);
        setLoading(false);
        return;
      }

      await axios.patch(`/api/users/${userId}`, {
        password: newPassword
      });
      setLoading(false);
      setCompleteReset(true);
    } catch (error) {
      if (loading) {
        setLoading(false);
      }
      console.log("Error sending code: ", error);
    }
  }

  return (
    <Flex position={"relative"} flexDir={"column"} justifyContent={"center"} alignItems={"center"} h={"100vh"} bgColor={"gray.300"} pos={"relative"}>
      {loading
        ? <Spinner size={"xl"} pos={"fixed"} top={"50%"} left={"50%"} right={"50%"} bottom={"50%"} zIndex={200} color={"blue.500"} />
        : null
      }
      <Heading position={"absolute"} top={"15%"}>Forgot your password?</Heading>

      <Flex flexDir={"column"} as="form" border={"1px solid black"} p={6} w={"450px"} borderRadius={10} rowGap={8} bgColor={"white"} mb={4}>
        {!successfulEmail && !completeReset ?
          <>
            <FormControl isInvalid={foundUser}>
              <FormLabel>We'll send you an email to reset it</FormLabel>
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && email.length > 5) {
                    e.preventDefault();
                    sendCode();
                  }
                }}
                />
              <FormHelperText>Please enter the email address you used to register</FormHelperText>
            </FormControl>

            <Button onClick={sendCode}>Send Email</Button>
          </>
          : null
        }

        {successfulEmail && !completeReset ?
          <>
            <FormControl isRequired isInvalid={newPassword.length < 6}>
              <FormLabel> New password</FormLabel>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && code.length > 5) {
                    e.preventDefault();
                    completePwReset();
                  }
                }}
                />
              {newPassword.length < 6 ? <FormErrorMessage>Password must be at least 6 characters long</FormErrorMessage> : null}
            </FormControl>

            <FormControl isRequired isInvalid={!pwMatch || existingPw}>
              <FormLabel>Confirm new password</FormLabel>
              <Input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && code.length > 5) {
                    e.preventDefault();
                    completePwReset();
                  }
                }}
                />
              {!pwMatch ? <FormErrorMessage>Passwords do not match</FormErrorMessage> : null}
              {existingPw ? <FormErrorMessage>Cannot use an existing password</FormErrorMessage> : null}
            </FormControl>

            <FormControl isRequired isInvalid={!codeMatch}>
              <FormLabel>Verification code</FormLabel>
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Verification code"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && code.length > 5) {
                    e.preventDefault();
                    completePwReset();
                  }
                }}
                />
              {!codeMatch ? <FormErrorMessage>Code does not match</FormErrorMessage> : null}
            </FormControl>

            <Button onClick={completePwReset}>Reset Password</Button>
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

      {completeReset ? null : <Text>Already have an account? <Link as={ReactRouterLink} to="/" color={"#209CF0"}>Login instead</Link></Text>}
    </Flex>
  )
}