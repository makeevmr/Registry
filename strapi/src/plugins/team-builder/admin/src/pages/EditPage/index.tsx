import {
  Layout,
  ContentLayout,
  Flex,
  Divider,
  Box,
  Loader,
} from "@strapi/design-system";
import React, { FC, useEffect } from "react";
import DraftHeader from "../../components/DraftHeader";
import Marginer from "../../components/shared/Marginer";
import { HalfWidthLargeScreen } from "./styles";
import UserSelect from "../../components/UserSelect";
import FormSelect from "../../components/FormSelect";
import SurveySelect from "../../components/SurveySelect";
import AutoGenerate from "../../components/AutoGenerate";
import TeamList from "../../components/TeamList";
import { useParams } from "react-router-dom";
import DraftNameEdit from "../../components/DraftNameEdit";
import { useDraft } from "../../entities/Draft";
import ProjectSelect from "../../components/ProjectSelect";

interface EditPageProps {
  pluginId: string;
}

const EditPage: FC<EditPageProps> = ({ pluginId }) => {
  const params = useParams<{ id: string | undefined }>();

  const { initialize, draft, isSurveyBased } = useDraft();

  useEffect(() => {
    if (params && params.id) initialize(+params.id);
  }, []);

  if (!draft)
    return (
      <Layout>
        <Flex justifyContent="center" alignItems="center" height="90vh">
          <Loader>Loading content...</Loader>
        </Flex>
      </Layout>
    );

  return (
    <Layout>
      <DraftHeader pluginId={pluginId} />
      <ContentLayout>
        <Box
          background="neutral0"
          hasRadius
          shadow="filterShadow"
          paddingTop={8}
          paddingBottom={8}
          paddingLeft={7}
          paddingRight={7}
        >
          <DraftNameEdit />
          <Marginer vertical={20} />
          <Flex justifyContent="space-between">
            <HalfWidthLargeScreen>
              {isSurveyBased ? <SurveySelect /> : <FormSelect />}
            </HalfWidthLargeScreen>
            <HalfWidthLargeScreen>
              <UserSelect />
            </HalfWidthLargeScreen>
          </Flex>
          <Marginer vertical={25} />
          <ProjectSelect />
          <Marginer vertical={25} />
          <Box padding={4}>
            <Divider />
          </Box>
          <Marginer vertical={25} />
          <AutoGenerate isSurveyBased={isSurveyBased} />
        </Box>
        <Marginer vertical={30} />
        <TeamList />
      </ContentLayout>
    </Layout>
  );
};

export default EditPage;
