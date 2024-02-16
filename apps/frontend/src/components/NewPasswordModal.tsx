import { Button, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"

export const NewPasswordModal = ({ showPwModal, setShowPwModal, password, setPassword, pwMatch, confirmPassword, setConfirmPassword, codeMatch, code, setCode, submitNewPassword }) => {

  return (
    <Modal isOpen={showPwModal} onClose={() => setShowPwModal(false)} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>A verification code has been sent to your email</ModalHeader>
        <ModalBody display={"flex"} flexDir={"column"} gap={4}>
          <FormControl isRequired isInvalid={password.length < 6}>
            <FormLabel>Enter New Password</FormLabel>
            <Input
              type={"password"}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="New Password"
              />
            {password.length < 6 ? <FormErrorMessage>Password must be at least 6 characters long</FormErrorMessage> : null}
          </FormControl>
          <FormControl isRequired isInvalid={!pwMatch}>
            <FormLabel>Confirm New Password</FormLabel>
            <Input
              type={"password"}
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              placeholder="Confirm Password"
              />
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
          <Button onClick={submitNewPassword}>Submit</Button>
          <Button onClick={() => setShowPwModal(false)}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}