import { ButtonGroup, Flex, IconButton, useEditableControls } from "@chakra-ui/react";
import { AiFillCloseSquare } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { ImCheckboxChecked } from "react-icons/im";

export const EditableControls = () => {

  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

  return isEditing ? (
    <ButtonGroup>
      <IconButton icon={<ImCheckboxChecked />} aria-label="Save" {...getSubmitButtonProps()} bgColor={"buttonBg"} color={"btnFontColor"} _hover={{ bgColor: "editBtnsHover"}} />
      <IconButton icon={<AiFillCloseSquare />} aria-label="Cancel" {...getCancelButtonProps()} bgColor={"buttonBg"} color={"btnFontColor"} _hover={{ bgColor: "editBtnsHover"}} />
    </ButtonGroup>
  ) : (
    <Flex>
      <IconButton icon={<FaEdit />} aria-label="Edit" {...getEditButtonProps()} bgColor={"buttonBg"} color={"btnFontColor"} _hover={{ bgColor: "editBtnsHover"}} />
    </Flex>
  )
}