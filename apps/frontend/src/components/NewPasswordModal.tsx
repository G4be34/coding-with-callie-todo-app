import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Icon, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useState } from "react";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";

export const NewPasswordModal = ({ showPwModal, setShowPwModal, password, setPassword, pwMatch, confirmPassword, setConfirmPassword, codeMatch, code, setCode, submitNewPassword }) => {
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const passwordSymbolRegex = /[^A-Za-z0-9]/;
  const passwordNumRegex = /^(?=.*\d)/;

  return (
    <Modal isOpen={showPwModal} onClose={() => setShowPwModal(false)} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>A verification code has been sent to your email</ModalHeader>
        <ModalBody display={"flex"} flexDir={"column"} gap={4}>
          <FormControl isRequired isInvalid={password.length < 6 || !passwordSymbolRegex.test(password) || !passwordNumRegex.test(password)}>
            <FormLabel>Enter New Password</FormLabel>
            <InputGroup>
              <Input
                type={"password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="New Password"
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
            <FormLabel>Confirm New Password</FormLabel>
            <InputGroup>
              <Input
                type={"password"}
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                placeholder="Confirm Password"
                />
              <InputRightElement>
                <Button onClick={() => setShowConfirmPw(!showConfirmPw)} variant={"link"}>
                  <Icon as={showConfirmPw ? FaEyeSlash : FaEye} />
                </Button>
              </InputRightElement>
            </InputGroup>
            {!pwMatch ? <FormErrorMessage>Passwords do not match</FormErrorMessage> : null}
          </FormControl>
          <FormControl isRequired isInvalid={!codeMatch}>
            <FormLabel>Enter Verification Code</FormLabel>
            <Input
              type={"text"}
              onChange={(e) => setCode(e.target.value)}
              value={code}
              placeholder="Verification Code"
              />
            {!codeMatch ? <FormErrorMessage>Incorrect verification code</FormErrorMessage> : null}
          </FormControl>
        </ModalBody>
        <ModalFooter display={"flex"} justifyContent={"space-evenly"}>
          <Button onClick={submitNewPassword} isDisabled={password.length < 6 || !passwordSymbolRegex.test(password) || !passwordNumRegex.test(password) || confirmPassword.length < 6 || code.length < 6}>Submit</Button>
          <Button onClick={() => setShowPwModal(false)}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}