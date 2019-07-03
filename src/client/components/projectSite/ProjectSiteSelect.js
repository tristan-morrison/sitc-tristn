import React from "react";
import loglevel from 'loglevel';
import { withRouter } from 'react-router-dom';

import sitcAirtable from "./../../api/sitcAirtable";
import SiteSelect from "./../SiteSelect";

export default function ProjectSiteSelect (props) {
  return (
    <SiteSelect
      type="project"
      getSites={sitcAirtable.getProjectSites}
      localStorageItemId="defaultProjectSiteId"
    />
  )
}
