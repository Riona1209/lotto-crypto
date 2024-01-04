import Header from "@/components/Header";
import MyTickets from "./components/MyTickets";
import Resume from "./components/Resume";
import * as S from "./styles";
import LastRounds from "../LastRounds";
import BetaHeader from "@/components/BetaHeader";
import { Button } from "@/components/ui/button";

import { useState } from "react";

interface HomeProps {}

const Home = ({}: HomeProps) => {
  const [date, setDate] = useState(new Date());

  return (
    <S.Container>
      <S.Content>
        <Resume />
        <MyTickets />
      </S.Content>
      <LastRounds />
    </S.Container>
  );
};

export default Home;
