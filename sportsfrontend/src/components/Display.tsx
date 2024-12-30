import { Box, Button, Input, Image, HStack, Heading } from "@chakra-ui/react";
import { useState } from "react";
import nbaImage from "../assets/nba.png";
import nflImage from "../assets/nfl.png";
import ncaabImage from "../assets/ncaab.png";
import ncaafImage from "../assets/ncaaf.png";
import euroleagueImage from "../assets/euroleague.png";
import wncaabImage from "../assets/NCAAWomenBasketball.webp";
import bblImage from "../assets/bbl.png";
import nhlImage from "../assets/nhl.png";

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
      {/* <Input
        placeholder="Enter name of athlete"
        _placeholder={{ color: "white" }}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleKeyDown}
      /> */}
      <HStack gap="5">
        <Button padding="1" size="2xl">
          <Image src={nbaImage} alt="NBA" boxSize="50px" objectFit="contain" />
        </Button>
        <Button padding="1" size="2xl">
          <Image src={nflImage} alt="NFL" boxSize="50px" objectFit="contain" />
        </Button>
        <Button padding="1" size="2xl">
          <Image src={nhlImage} alt="NHL" boxSize="50px" objectFit="contain" />
        </Button>
        <Button padding="1" size="2xl">
          <Image
            src={ncaabImage}
            alt="NCAAB"
            boxSize="50px"
            objectFit="contain"
          />
        </Button>
        <Button padding="1" size="2xl">
          <Image
            src={ncaafImage}
            alt="NCAAF"
            boxSize="50px"
            objectFit="contain"
          />
        </Button>
        <Button padding="1" size="2xl">
          <Image
            src={euroleagueImage}
            alt="EuroLeague Basketball"
            boxSize="50px"
            objectFit="contain"
          />
        </Button>
        <Button padding="1" size="2xl">
          <Image
            src={wncaabImage}
            alt="WNCAAB"
            boxSize="50px"
            objectFit="contain"
          />
        </Button>
        <Button padding="1" size="2xl">
          <Image src={bblImage} alt="BBL" boxSize="50px" objectFit="contain" />
        </Button>
      </HStack>
      <Heading>Choose a Sport!</Heading>
    </Box>
  );
};
