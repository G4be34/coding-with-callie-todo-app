import { Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Icon, Input, InputGroup, InputRightElement, Link, Spinner, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";

export const SignUpPage = () => {
  const bgImageNum = Math.floor(Math.random() * 3) + 1;
  const navigate = useNavigate();
  const toast = useToast();

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
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const passwordSymbolRegex = /[^A-Za-z0-9]/;
  const passwordNumRegex = /^(?=.*\d)/;
  const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const createUser = async () => {
    try {
      setLoading(true);
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

      const user = await axios.post('/api/users', newUser);

      const completeColumn = {
        column_id: 'column-1',
        title: 'Completed',
        position: 0,
        userId: user.data.id,
      };

      await axios.post('/api/groups', completeColumn);

      setLoading(false);
      navigate('/login');
      toast({
        title: 'Account Created',
        description: "Your account has been created.",
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
    } catch (error) {
      setLoading(false);
      console.log("Error creating user: ", error);
      toast({
        title: 'Error',
        description: "Something went wrong, Please try again",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom'
      })
    }
  };

  const sendVerificationEmail = async (username: string, email: string) => {
    try {
      if (!validEmailRegex.test(email)) {
        setInvalidEmail(true);
        return;
      }

      setLoading(true);
      if (password !== confirmPassword) {
        setPwMatch(false);
        setLoading(false);
        return;
      }

      const existingUser = await axios.get(`/api/email/${email}`);

      if (existingUser.data) {
        setExistingUser(true);
        setInvalidEmail(false);
        setLoading(false);
        return;
      }

      const code = await axios.post('/api/email', { username, email });

      setEmailCode(code.data.code.toString());
      setLoading(false);
      setCompleteSignup(true);
      toast({
        title: 'Email Sent',
        description: "Verification code has been sent",
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({
        title: 'Error',
        description: "Something went wrong, Please try again",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom'
      })
    }

  };

  const handleBackButton = () => {
    setCompleteSignup(false);
    setCodeMatch(true)
    setCode("");
    setEmailCode("");
  };

  return (
    <Flex flexDir={"column"} justifyContent={"center"} alignItems={"center"} flex={1} bgColor={"gray.300"} pos={"relative"} overflow={"auto"} bgImg={`/${bgImageNum}-GlassMorphismBg.jpg`} bgSize={"cover"} bgPos={"center"}>
      {loading ? <Spinner position={"fixed"} top={"50%"} left={"50%"} right={"50%"} bottom={"50%"} color="blue.500" size="xl" /> : null}
      <Heading p={{ sm: 4, md: 6, lg: 8}} color={"#ffffff"}>Sign up for CWC Todo App</Heading>
      <Flex flexDir={"column"} as="form" border={"2px solid #d6d6c2"} p={6} w={"450px"} borderRadius={20} rowGap={8} mb={4} bgColor={"rgba(255, 255, 255, 0.05)"} backdropFilter={"blur(10px)"}>
        {!completeSignup
          ? <>
              <FormControl isRequired isInvalid={username.length < 3}>
                <FormLabel color={"#ffffff"}>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  />
                {username.length < 3
                  ? <FormErrorMessage display={"flex"} alignItems={"center"} gap={2}>
                      <IoMdCloseCircleOutline />
                      Username must be at least 3 characters long
                    </FormErrorMessage>
                  : <FormHelperText color={"green"} display={"flex"} alignItems={"center"} gap={2}>
                      <FaCheck />
                      Username must be at least 3 characters long
                    </FormHelperText>
                }
              </FormControl>

              <FormControl isRequired isInvalid={existingUser || invalidEmail}>
                <FormLabel color={"#ffffff"}>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  />
                {existingUser ? <FormErrorMessage>Email already exists</FormErrorMessage> : null}
                {invalidEmail ? <Text mt={2} fontSize={"sm"} color={"red"}>Email must be a valid email address</Text > : null}
              </FormControl>

              <FormControl isRequired isInvalid={password.length < 6 || !passwordSymbolRegex.test(password) || !passwordNumRegex.test(password)}>
                <FormLabel color={"#ffffff"}>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    />
                  <InputRightElement>
                    <Button onClick={() => setShowPw(!showPw)} variant={"link"}>
                      <Icon as={showPw ? FaEyeSlash : FaEye} />
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {password.length < 6
                  ? <FormErrorMessage display={"flex"} alignItems={"center"} gap={2}>
                      <IoMdCloseCircleOutline />
                      Password must be at least 6 characters
                    </FormErrorMessage>
                  : <FormHelperText color={"green"} display={"flex"} alignItems={"center"} gap={2}>
                      <FaCheck />
                      Password must be at least 6 characters
                    </FormHelperText>
                }
                {!passwordSymbolRegex.test(password)
                  ? <FormErrorMessage display={"flex"} alignItems={"center"} gap={2}>
                      <IoMdCloseCircleOutline />
                      Password must contain at least one special character
                    </FormErrorMessage>
                  : <FormHelperText color={"green"} display={"flex"} alignItems={"center"} gap={2}>
                      <FaCheck />
                      Password must contain at least one special character
                    </FormHelperText>
                }
                {!passwordNumRegex.test(password)
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

              <FormControl isRequired isInvalid={!pwMatch}>
                <FormLabel color={"#ffffff"}>Confirm password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPw ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    />
                  <InputRightElement>
                    <Button onClick={() => setShowConfirmPw(!showConfirmPw)} variant={"link"}>
                      <Icon as={showConfirmPw ? FaEyeSlash : FaEye} />
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {!pwMatch ? <FormErrorMessage>Passwords do not match</FormErrorMessage> : null}
              </FormControl>

              <Button
                onClick={() => sendVerificationEmail(username, email)}
                isDisabled={username.length < 3 || password.length < 6}
                color={"#ffffff"}
                _hover={ bgImageNum == 1 ? { backgroundColor: "#fcae4f" } : bgImageNum === 2 ? { backgroundColor: "#c98bda" } : { backgroundColor: "#b6afb0" }}
                bgColor={bgImageNum === 1 ? "rgb(253, 150, 20, 1)" : bgImageNum === 2 ? "rgb(123, 45, 144, 1)" : "rgb(82, 76, 77, 1)"}
                >
                  Sign up
              </Button>
            </>
          : <>
              <FormControl isRequired isInvalid={!codeMatch}>
                <Text mb={6} color={"#ffffff"}>Verification email has been sent. Please check your inbox</Text>
                <FormLabel color={"#ffffff"}>Verification Code</FormLabel>
                <Input
                  type="text"
                  placeholder="Verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  />
                {!codeMatch ? <FormErrorMessage>Incorrect verification code</FormErrorMessage> : null}
              </FormControl>

              <Button 
                onClick={createUser} 
                isDisabled={code.length < 6}
                color={"#ffffff"}
                _hover={ bgImageNum == 1 ? { backgroundColor: "#fcae4f" } : bgImageNum === 2 ? { backgroundColor: "#c98bda" } : { backgroundColor: "#b6afb0" }}
                bgColor={bgImageNum === 1 ? "rgb(253, 150, 20, 1)" : bgImageNum === 2 ? "rgb(123, 45, 144, 1)" : "rgb(82, 76, 77, 1)"}
              >
                Verify Email
              </Button>

              <Text textAlign={"center"} mt={-4} mb={-4}>- or -</Text>

              <Button 
                onClick={handleBackButton}
                color={"#ffffff"}
                _hover={ bgImageNum == 1 ? { backgroundColor: "#fcae4f" } : bgImageNum === 2 ? { backgroundColor: "#c98bda" } : { backgroundColor: "#b6afb0" }}
                bgColor={bgImageNum === 1 ? "rgb(253, 150, 20, 1)" : bgImageNum === 2 ? "rgb(123, 45, 144, 1)" : "rgb(82, 76, 77, 1)"}
              >
                Go back
              </Button>
              <Flex>
                <Text color={"#ffffff"}>Didn't recieve the email?</Text>
                <Text onClick={() => sendVerificationEmail(username, email)} color={"#209CF0"} marginLeft={2} _hover={{ cursor: "pointer", textDecoration: "underline" }}>Resend it</Text>
              </Flex>
            </>
        }
      </Flex>
      {!completeSignup
        ? <Text pb={4} color={"#ffffff"}>
            Already have an account? 
            <Link as={ReactRouterLink} to="/" color={"#209CF0"} marginLeft={2}>Login instead</Link>
          </Text>
        : null
      }
    </Flex>
  )
}