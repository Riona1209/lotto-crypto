import Button from "@/components/Button";
import { useAdmin } from "@/hooks/useAdmin";
import { useForm } from "react-hook-form";
import * as S from "./styles";

type EditPropeties = {
  name: string;
  ticketPrice: number;
  minTicket: number;
  configFinishTime: number;
  configTimeToClaim: number;
  fee: number;
};

interface AdminProps {}

const Admin = ({}: AdminProps) => {
  const { register, handleSubmit } = useForm<EditPropeties>();
  const { editPropeties } = useAdmin();

  const onSubmit = (data: EditPropeties) => {
    console.log(data);
    editPropeties(data);
  };

  return (
    <S.Container>
      <h1>Admin Panel</h1>
      <S.Form onSubmit={handleSubmit(onSubmit)}>
        <S.p>Lottery Name:</S.p>
        <S.Input
          {...register("name")}
          type="text"
          placeholder="Lottery Name"
          required
        />
        <S.p>Ticket Price ($):</S.p>
        <S.Input
          {...register("ticketPrice")}
          type="text"
          placeholder="10"
          required
        />
        <S.p>Min. Ticket:</S.p>
        <S.Input
          {...register("minTicket")}
          type="text"
          placeholder="1"
          required
        />
        <S.p>Config Finish Time (minutes):</S.p>
        <S.Input
          {...register("configFinishTime")}
          type="text"
          placeholder="600"
        />
        <S.p>Fee ($):</S.p>
        <S.Input {...register("fee")} type="text" placeholder="1" required />
        <S.p>Claim Expirate at (minutes):</S.p>
        <S.Input
          {...register("configTimeToClaim")}
          type="text"
          placeholder="60000"
          required
        />
        <Button color="black">Salvar</Button>
      </S.Form>
    </S.Container>
  );
};

export default Admin;
