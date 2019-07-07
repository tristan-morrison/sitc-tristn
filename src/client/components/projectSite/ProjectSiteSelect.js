import React from "react";
import loglevel from 'loglevel';
import { withRouter } from 'react-router-dom';

import Typography from "@material-ui/core/Typography";

import sitcAirtable from "./../../api/sitcAirtable";
import SiteSelect from "./../SiteSelect";

export default function ProjectSiteSelect (props) {
  loglevel.info("ProjectSiteSelect is running!");
  return (
    <React.Fragment>
      <Typography variant="h6">Select project site</Typography>
      <SiteSelect
        {...props}
        type="project"
        getSites={sitcAirtable.getProjectSites}
        localStorageItemId="defaultProjectSiteId"
        routeUrl="/project"
      />
    </React.Fragment>
  )
}
