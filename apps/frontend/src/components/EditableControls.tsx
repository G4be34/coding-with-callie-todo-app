import { ButtonGroup, Flex, IconButton, useEditableControls } from "@chakra-ui/react";
import { AiFillCloseSquare } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { ImCheckboxChecked } from "react-icons/im";

export const EditableControls = () => {

  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

  return isEditing ? (
    <ButtonGroup>
      <IconButton icon={<ImCheckboxChecked />} aria-label="Save" {...getSubmitButtonProps()} />
      <IconButton icon={<AiFillCloseSquare />} aria-label="Cancel" {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : (
    <Flex>
      <IconButton icon={<FaEdit />} aria-label="Edit" {...getEditButtonProps()} />
    </Flex>
  )
}