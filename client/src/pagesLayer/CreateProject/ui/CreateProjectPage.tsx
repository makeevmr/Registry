"use client";
import { useAuthQuery } from "@/entities/User";
import { CreateProjectForm } from "@/features/CreateProject";
import { Container, LoadingCircle } from "@/shared/ui";
import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets/Header";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";

const CreateProjectPage: FC = () => {
  const router = useRouter();
  const { data: user, isLoading } = useAuthQuery();

  // Only employers may open this page; the server endpoint is the real gate.
  useEffect(() => {
    if (!isLoading && user?.userType !== "employer") router.push("/");
  }, [isLoading, user, router]);

  return (
    <>
      <Container>
        <div className="pt-6" />
        <Header text="dark" />
        <div className="pt-10" />
        {isLoading || user?.userType !== "employer" ? (
          <LoadingCircle />
        ) : (
          <CreateProjectForm />
        )}
        <div className="pt-10" />
      </Container>
      <div className="pt-8" />
      <Footer />
    </>
  );
};

export default CreateProjectPage;
