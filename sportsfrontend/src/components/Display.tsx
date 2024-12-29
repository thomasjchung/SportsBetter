import { Box, Input } from "@chakra-ui/react";
import { useState } from "react";
export const Display = () => {
  const [inputValue, setInputValue] = useState("");
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == "Enter") {
      console.log(inputValue);
      setInputValue("");
    }
  };
  return (
    <Box bgColor="gray" width="100%" padding="4" color="white">
      <Input
        placeholder="Enter name of athlete"
        _placeholder={{ color: "white" }}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    </Box>
  );
};
