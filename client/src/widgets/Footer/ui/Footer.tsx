import { Container } from "@/shared/ui";
import { FC } from "react";

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  return (
    <div className="bg-black text-white">
      <div className="pt-12" />
      <Container className="flex gap-10 border-t border-white pb-20 pt-2 text-[13px]">
        <p>
          Уникальный проект Санкт-Петербургского государственного университета
          получения практических
          <br /> навыков без отрыва от учебного процесса для решения задач,
          поставленных заказчиком.
        </p>
        <p className="ml-auto whitespace-nowrap">© СПбГУ, 2023</p>
      </Container>
    </div>
  );
};

export default Footer;
