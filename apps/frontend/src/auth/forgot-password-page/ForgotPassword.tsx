import { Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Icon, Input, InputGroup, InputRightElement, Link, Text, chakra, useToast } from "@chakra-ui/react";
import axios, { isAxiosError } from "axios";
import { useState } from "react";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Link as ReactRouterLink } from "react-router-dom";
import "../login-page/LoginPage.css";

const ChakraRouterLink = chakra(ReactRouterLink);

export const ForgotPassword = () => {
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [, setFoundUser] = useState(false);
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
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [bgImageNum] = useState(Math.floor(Math.random() * 3) + 1);

  const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordSymbolRegex = /[^A-Za-z0-9]/;
  const passwordNumRegex = /^(?=.*\d)/;

  const sendCode = async () => {
    try {
      if (!validEmailRegex.test(email)) {
        setInvalidEmail(true);
        return;
      }

      setLoading(true);
      const response = await axios.post('/api/email', { email });
      setCodeEmail(response.data.code.toString());
      setUserId(response.data.id.toString());
      setLoading(false);
      setSuccessfulEmail(true);
      toast({
        title: 'Email Sent',
        description: "Verification code has been sent to your email.",
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    } catch (error) {
      setLoading(false);
      if (isAxiosError(error) && error.response && error.response.data.statusCode === 404) {
        setFoundUser(true);
        return;
      }
      toast({
        title: 'Error',
        description: "Something went wrong, Please try again",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

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

      toast({
        title: 'Password Reset',
        description: "Your password has been reset.",
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    } catch (error) {
      if (loading) {
        setLoading(false);
      }
      toast({
        title: 'Error',
        description: "Something went wrong, Please try again",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  return (
    <Flex position={"relative"} flexDir={"column"} justifyContent={"center"} alignItems={"center"} h={"100vh"} pos={"relative"} bgImg={`/${bgImageNum}-GlassMorphismBg.jpg`} bgSize={"cover"} bgPos={"center"}>
      <Heading position={"absolute"} top={"15%"} color={"#ffffff"}>Forgot your password?</Heading>

      <Flex flexDir={"column"} as="form" border={"2px solid #d6d6c2"} p={6} w={"450px"} borderRadius={20} rowGap={8} bgColor={"rgba(255, 255, 255, 0.05)"} backdropFilter={"blur(10px)"} mb={4}>
        {!successfulEmail && !completeReset ?
          <>
            <FormControl isInvalid={invalidEmail} isRequired>
              <FormLabel color={"#ffffff"}>We'll send you an email to reset it</FormLabel>
              <InputGroup pos={"relative"}>
                <Input
                  type="email"
                  value={email}
                  color={"#ffffff"}
                  borderColor="#555"
                  focusBorderColor="#555"
                  errorBorderColor="#555"
                  _hover={{ border: "2px solid #555" }}
                  className={`floating-input ${email ? "filled" : ""}`}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && email.length > 5) {
                      e.preventDefault();
                      sendCode();
                    }
                  }}
                  />
                <FormLabel color={"#d9d9d9"} className="floating-label" requiredIndicator={false}>Email</FormLabel>
              </InputGroup>
              <FormHelperText color={"#ffffff"}>Please enter the email address you used to register</FormHelperText>
              {invalidEmail ? <FormErrorMessage>Please enter a valid email address</FormErrorMessage> : null}
            </FormControl>

            <Button
              onClick={sendCode}
              color={"#ffffff"}
              isLoading={loading}
              _hover={ bgImageNum == 1 ? { backgroundColor: "#fcae4f" } : bgImageNum === 2 ? { backgroundColor: "#c98bda" } : { backgroundColor: "#b6afb0" }}
              bgColor={bgImageNum === 1 ? "rgb(253, 150, 20, 1)" : bgImageNum === 2 ? "rgb(123, 45, 144, 1)" : "rgb(82, 76, 77, 1)"}
              aria-label="Send the verification email"
            >
              Send Email
            </Button>
          </>
          : null
        }

        {successfulEmail && !completeReset ?
          <>
            <FormControl isRequired isInvalid={newPassword.length < 6 || !passwordNumRegex.test(newPassword) || !passwordSymbolRegex.test(newPassword)}>
              <FormLabel color={"#ffffff"}> New password</FormLabel>
              <InputGroup>
                <Input
                  type={showPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  color={"#ffffff"}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && code.length > 5) {
                      e.preventDefault();
                      completePwReset();
                    }
                  }}
                  />
                <InputRightElement>
                  <Button onClick={() => setShowPw(!showPw)} variant={"link"} aria-label="Toggle password visibility">
                    <Icon as={showPw ? FaEyeSlash : FaEye} />
                  </Button>
                </InputRightElement>
              </InputGroup>
              {newPassword.length < 6
                ? <FormErrorMessage display={"flex"} alignItems={"center"} gap={2}>
                    <IoMdCloseCircleOutline />
                    Password must be at least 6 characters
                  </FormErrorMessage>
                : <FormHelperText color={"green"} display={"flex"} alignItems={"center"} gap={2}>
                    <FaCheck />
                    Password must be at least 6 characters
                  </FormHelperText>
              }
              {!passwordSymbolRegex.test(newPassword)
                ? <FormErrorMessage display={"flex"} alignItems={"center"} gap={2}>
                    <IoMdCloseCircleOutline />
                    Password must contain at least one special character
                  </FormErrorMessage>
                : <FormHelperText color={"green"} display={"flex"} alignItems={"center"} gap={2}>
                    <FaCheck />
                    Password must contain at least one special character
                  </FormHelperText>
              }
              {!passwordNumRegex.test(newPassword)
                ? <FormErrorMessage display={"flex"} alignItems={"center"} gap={2}>
                    <IoMdCloseCircleOutline />
                    Password must contain at least one number
                  </FormErrorMessage>
                : <FormHelperText color={"green"} display={"flex"} alignItems={"center"} gap={2}>
                    <FaCheck />
                    Password must contain at least one number
                  </FormHelperText>
              }
            </FormControl>

            <FormControl isRequired isInvalid={!pwMatch || existingPw}>
              <FormLabel color={"#ffffff"}>Confirm new password</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPw ? "text" : "password"}
                  value={confirmNewPassword}
                  color={"#ffffff"}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && code.length > 5) {
                      e.preventDefault();
                      completePwReset();
                    }
                  }}
                  />
                <InputRightElement>
                    <Button onClick={() => setShowConfirmPw(!showConfirmPw)} variant={"link"} aria-label="Toggle password visibility">
                      <Icon as={showConfirmPw ? FaEyeSlash : FaEye} />
                    </Button>
                  </InputRightElement>
              </InputGroup>
              {!pwMatch ? <FormErrorMessage>Passwords do not match</FormErrorMessage> : null}
              {existingPw ? <FormErrorMessage>Cannot use an existing password</FormErrorMessage> : null}
            </FormControl>

            <FormControl isRequired isInvalid={!codeMatch}>
              <FormLabel color={"#ffffff"}>Verification code</FormLabel>
              <Input
                type="text"
                value={code}
                color={"#ffffff"}
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

            <Button
              onClick={completePwReset}
              color={"#ffffff"}
              isLoading={loading}
              aria-label="Confirm password reset"
              _hover={ bgImageNum == 1 ? { backgroundColor: "#fcae4f" } : bgImageNum === 2 ? { backgroundColor: "#c98bda" } : { backgroundColor: "#b6afb0" }}
              bgColor={bgImageNum === 1 ? "rgb(253, 150, 20, 1)" : bgImageNum === 2 ? "rgb(123, 45, 144, 1)" : "rgb(82, 76, 77, 1)"}
            >
              Reset Password
            </Button>
          </>
         : null
        }

        {completeReset ?
          <>
            <Text color={"#ffffff"}>Your password has been reset</Text>
            <Button
              as={ChakraRouterLink}
              to="/"
              color={"#ffffff"}
              aria-label="Return to login page"
              _hover={ bgImageNum == 1 ? { backgroundColor: "#fcae4f" } : bgImageNum === 2 ? { backgroundColor: "#c98bda" } : { backgroundColor: "#b6afb0" }}
              bgColor={bgImageNum === 1 ? "rgb(253, 150, 20, 1)" : bgImageNum === 2 ? "rgb(123, 45, 144, 1)" : "rgb(82, 76, 77, 1)"}
            >
              Login
            </Button>
          </>
          : null
        }
      </Flex>

      {completeReset ? null : <Text color={"#ffffff"}>Already have an account? <Link as={ReactRouterLink} to="/" color={"#209CF0"}>Login instead</Link></Text>}
    </Flex>
  )
}