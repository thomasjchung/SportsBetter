import {
  Box,
  Button,
  Image,
  HStack,
  Heading,
  Text,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import nbaImage from "../assets/nba.png";
import nflImage from "../assets/nfl.png";
import ncaabImage from "../assets/ncaab.png";
import ncaafImage from "../assets/ncaaf.png";
import euroleagueImage from "../assets/euroleague.png";
import wncaabImage from "../assets/NCAAWomenBasketball.webp";
import bblImage from "../assets/bbl.png";
import nhlImage from "../assets/nhl.png";

type ArbitrageData = {
  home_teams: string[];
  away_teams: string[];
  home_bets: number[];
  away_bets: number[];
  total_profit: number[];
  home_bookmakers: string[];
  away_bookmakers: string[];
  rounded_min_p: number[];
  rounded_max_p: number[];
  rounded_home: number[];
  rounded_away: number[];
};

export const Display = () => {
  const [sportValue, setSportValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [arbitrageData, setArbitrageData] = useState<
    ArbitrageData | string | null
  >(null);
  const [stakeValue, setStakeValue] = useState("");
  const [clickedIndexes, setClickedIndexes] = useState<number[]>([]); // Track clicked indexes

  const handleRoundClick = (index: number) => {
    setClickedIndexes((prev) => [...prev, index]); // Mark the index as clicked
  };

  const fetchArbitrageData = async () => {
    if (!sportValue) {
      alert("Plase select a sport first!");
      return;
    }

    if (!stakeValue || isNaN(Number(stakeValue))) {
      alert("Please enter a valid stake value!");
      return;
    }

    const stakeNum = Number(stakeValue);

    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/odds?sport=${sportValue}&stake=${stakeNum}`
      );
      const data = await response.json();

      if (response.ok) {
        if (data.home_teams && data.home_teams.length > 0) {
          setArbitrageData(data);
        } else {
          setArbitrageData("No Arbitrage Found!");
        }
      } else {
        console.error(data.error || "Failed to fetch data");
        setArbitrageData("An error occurred while fetching arbitrage data.");
      }
    } catch (error) {
      console.error("Error fetching arbitrage data:", error);
      setArbitrageData("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
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
        <Button
          padding="1"
          size="2xl"
          onClick={() => setSportValue("basketball_nba")}
        >
          <Image src={nbaImage} alt="NBA" boxSize="50px" objectFit="contain" />
        </Button>
        <Button
          padding="1"
          size="2xl"
          onClick={() => setSportValue("americanfootball_nfl")}
        >
          <Image src={nflImage} alt="NFL" boxSize="50px" objectFit="contain" />
        </Button>
        <Button
          padding="1"
          size="2xl"
          onClick={() => setSportValue("icehockey_nhl")}
        >
          <Image src={nhlImage} alt="NHL" boxSize="50px" objectFit="contain" />
        </Button>
        <Button padding="1" size="2xl">
          <Image
            src={ncaabImage}
            alt="NCAAB"
            boxSize="50px"
            objectFit="contain"
            onClick={() => setSportValue("basketball_ncaab")}
          />
        </Button>
        <Button
          padding="1"
          size="2xl"
          onClick={() => setSportValue("americanfootball_ncaaf")}
        >
          <Image
            src={ncaafImage}
            alt="NCAAF"
            boxSize="50px"
            objectFit="contain"
          />
        </Button>
        <Button
          padding="1"
          size="2xl"
          onClick={() => setSportValue("basketball_euroleague")}
        >
          <Image
            src={euroleagueImage}
            alt="EuroLeague Basketball"
            boxSize="50px"
            objectFit="contain"
          />
        </Button>
        <Button
          padding="1"
          size="2xl"
          onClick={() => setSportValue("basketball_wncaab")}
        >
          <Image
            src={wncaabImage}
            alt="WNCAAB"
            boxSize="50px"
            objectFit="contain"
          />
        </Button>
        <Button
          padding="1"
          size="2xl"
          onClick={() => setSportValue("cricket_big_bash")}
        >
          <Image src={bblImage} alt="BBL" boxSize="50px" objectFit="contain" />
        </Button>
      </HStack>
      <Heading>Select Your Sport!</Heading>

      <HStack mt="4">
        <Input
          placeholder="Enter Stake"
          value={stakeValue}
          onChange={(e) => setStakeValue(e.target.value)} // Convert to number and handle invalid input
          _placeholder={{ color: "white" }}
          color="black"
        />
        <Button color="white" onClick={fetchArbitrageData} disabled={loading}>
          {loading ? "Loading..." : "Submit!"}
        </Button>
      </HStack>

      {arbitrageData && (
        <Box mt="4">
          {typeof arbitrageData === "string" ? (
            <Text fontSize="lg" color="red">
              {arbitrageData}
            </Text>
          ) : (
            <Box>
              <Heading size="md">
                Arbitrage Opportunities with stake {stakeValue}:
              </Heading>
              {arbitrageData.home_teams.map((homeTeam, index) => (
                <Box key={index} mt="2">
                  <Text>
                    {homeTeam} ({arbitrageData.home_bookmakers[index]}-
                    {arbitrageData.home_bets[index]}) vs{" "}
                    {arbitrageData.away_teams[index]} (
                    {arbitrageData.away_bookmakers[index]}-
                    {arbitrageData.away_bets[index]}) -- Total Profit = (
                    {arbitrageData.total_profit[index]})
                  </Text>
                  {!clickedIndexes.includes(index) ? (
                    <Button
                      padding="1"
                      size="sm"
                      color="pink"
                      onClick={() => handleRoundClick(index)}
                    >
                      Round!
                    </Button>
                  ) : (
                    <Text>
                      Rounded Min Profit: {arbitrageData.rounded_min_p[index]} |{" "}
                      Rounded Max Profit: {arbitrageData.rounded_max_p[index]}
                    </Text>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
